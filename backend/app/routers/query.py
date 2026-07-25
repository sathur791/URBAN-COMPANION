from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.db_models import User
from app.models.schemas import QueryRequest, QueryResponse
from app.services.nlu import parse_query
from app.services.data_aggregator import aggregate_city_data
from app.services.feature_engineering import build_features
from app.services.prediction import get_all_predictions
from app.services.recommendation_engine import generate_recommendations
from app.services.explainability import get_shap_explanations
from app.services.rag import retrieve_context
from app.services.llm_generator import generate_response

router = APIRouter(prefix="/api", tags=["query"])


@router.post("/query", response_model=QueryResponse)
async def handle_query(req: QueryRequest, current_user: User = Depends(get_current_user)):
    nlu = await parse_query(req)
    city_data = await aggregate_city_data(req, nlu)
    features = build_features(city_data, nlu, current_user.id)
    predictions = get_all_predictions(features)
    ranked = generate_recommendations(predictions, current_user.id)
    shap_explanations = get_shap_explanations(features)
    rag_ctx = retrieve_context(current_user.id, nlu)
    live_conditions = {
        "traffic": city_data.get("traffic", {}),
        "weather": city_data.get("weather", {}),
        "parking": city_data.get("parking", {}),
        "air_quality": city_data.get("pollution", {}),
        "transit": city_data.get("transit", {}),
    }

    final_text = await generate_response(ranked, shap_explanations, rag_ctx, req.text or "")

    return QueryResponse(
        recommendation=final_text,
        ranked_options=ranked,
        shap_explanations=shap_explanations,
        live_conditions=live_conditions,
        rag_context=rag_ctx,
    )
