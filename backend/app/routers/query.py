from fastapi import APIRouter, Depends, Query as QueryParam, Request
import os
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user, get_optional_user
from app.models.db_models import User, Trip
from app.models.schemas import QueryRequest, QueryResponse
from app.services.nlu import parse_query
from app.services.data_aggregator import aggregate_city_data
from app.services.feature_engineering import build_features
from app.services.prediction import get_all_predictions
from app.services.recommendation_engine import generate_recommendations
from app.services.explainability import get_shap_explanations
from app.services.rag import retrieve_context
from app.services.llm_generator import generate_response
from app.services.geocoding import geocode_location, search_places
from app.services.routing import fetch_osrm_route, compute_departure_windows, calculate_eco_impact
import asyncio

router = APIRouter(prefix="/api", tags=["query"])


@router.get("/geocoding/search")
async def autocomplete_search(q: str = QueryParam(..., min_length=2)):
    """Live place search autocomplete endpoint."""
    return await search_places(q)


@router.post("/query", response_model=QueryResponse)
async def handle_query(
    req: QueryRequest,
    request: Request = None,
    current_user: User = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    if request and request.headers.get("x-grok-key"):
        os.environ["GROK_API_KEY"] = request.headers.get("x-grok-key").strip()

    nlu = await parse_query(req)

    # Resolve Origin Coordinates & Address
    o_lat, o_lng = req.gps_lat or 40.7128, req.gps_lng or -74.0060
    o_addr = "Current Location"
    if req.origin_name:
        o_lat, o_lng, o_addr = await geocode_location(req.origin_name, o_lat, o_lng)

    # Resolve Destination Coordinates & Address
    d_lat, d_lng = req.dest_lat or 40.7580, req.dest_lng or -73.9855
    d_addr = "Destination"
    if req.dest_name:
        d_lat, d_lng, d_addr = await geocode_location(req.dest_name, d_lat, d_lng)

    # Override request coords for city data aggregation
    req.gps_lat, req.gps_lng = o_lat, o_lng
    req.dest_lat, req.dest_lng = d_lat, d_lng

    # Fetch City Sensors & Live Data
    city_data = await aggregate_city_data(req, nlu)

    # Parallel OSRM Real Routing for Drive, Transit/Bike, Walk
    driving_route, bike_route, foot_route = await asyncio.gather(
        fetch_osrm_route((o_lat, o_lng), (d_lat, d_lng), "driving"),
        fetch_osrm_route((o_lat, o_lng), (d_lat, d_lng), "bike"),
        fetch_osrm_route((o_lat, o_lng), (d_lat, d_lng), "foot"),
        return_exceptions=True,
    )

    def safe_route(res, default_dist=5000, default_dur=900):
        if isinstance(res, dict):
            return res
        return {"distance_meters": default_dist, "duration_seconds": default_dur, "geometry": [[o_lat, o_lng], [d_lat, d_lng]], "steps": []}

    d_route = safe_route(driving_route, 6000, 1000)
    b_route = safe_route(bike_route, 5800, 1400)
    f_route = safe_route(foot_route, 5500, 3600)

    # Build ML Features & Recommendations
    features = build_features(city_data, nlu, current_user.id)
    predictions = get_all_predictions(features)
    ranked = generate_recommendations(predictions, current_user.id)
    shap_explanations = get_shap_explanations(features)
    rag_ctx = retrieve_context(current_user.id, nlu)

    # Compute Smart Features: Departure Forecast & Eco Impact
    departure_windows = compute_departure_windows(d_route["duration_seconds"])
    eco_impact = calculate_eco_impact(d_route["distance_meters"])

    live_conditions = {
        "traffic": city_data.get("traffic", {}),
        "weather": city_data.get("weather", {}),
        "parking": city_data.get("parking", {}),
        "air_quality": city_data.get("pollution", {}),
        "transit": city_data.get("transit", {}),
    }

    final_text = await generate_response(ranked, shap_explanations, rag_ctx, req.text or "", nlu, city_data)

    # Log trip in DB
    new_trip = Trip(
        user_id=current_user.id,
        origin_lat=o_lat,
        origin_lng=o_lng,
        dest_lat=d_lat,
        dest_lng=d_lng,
        origin_name=o_addr,
        dest_name=d_addr,
        mode=ranked[0].mode if ranked else "drive",
        recommended_option=ranked[0].label if ranked else None,
        duration_minutes=ranked[0].travel_time_minutes if ranked else 15,
    )
    db.add(new_trip)
    await db.commit()
    await db.refresh(new_trip)

    return QueryResponse(
        recommendation=final_text,
        ranked_options=ranked,
        shap_explanations=shap_explanations,
        live_conditions=live_conditions,
        rag_context=rag_ctx,
        query_id=new_trip.id,
        origin_coords={"lat": o_lat, "lng": o_lng},
        dest_coords={"lat": d_lat, "lng": d_lng},
        origin_address=o_addr,
        dest_address=d_addr,
        routes_geometry={
            "drive": d_route["geometry"],
            "bike": b_route["geometry"],
            "walk": f_route["geometry"],
        },
        departure_windows=departure_windows,
        eco_impact=eco_impact,
        turn_by_turn_steps=d_route["steps"],
    )

