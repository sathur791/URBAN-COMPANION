import httpx
import time
from typing import Optional, List, Dict

_geocoding_cache: dict = {}

# Fallback known places for instant lookup without network delay
KNOWN_PLACES = {
    "times square": (40.7580, -73.9855, "Times Square, New York, NY"),
    "central park": (40.7829, -73.9654, "Central Park, New York, NY"),
    "empire state": (40.7484, -73.9857, "Empire State Building, New York, NY"),
    "grand central": (40.7527, -73.9772, "Grand Central Terminal, New York, NY"),
    "jfk airport": (40.6413, -73.7781, "JFK International Airport, Queens, NY"),
    "downtown": (40.7128, -74.0060, "Downtown, New York, NY"),
    "brooklyn bridge": (40.7061, -73.9969, "Brooklyn Bridge, New York, NY"),
    "financial district": (40.7075, -74.0089, "Financial District, New York, NY"),
}


async def search_places(query: str) -> List[Dict]:
    """Live location autocomplete search using Nominatim API with cache & fast timeout."""
    if not query or len(query.strip()) < 2:
        return []

    q_lower = query.strip().lower()
    cache_key = f"search_{q_lower}"
    if cache_key in _geocoding_cache:
        return _geocoding_cache[cache_key]

    # Check known fast places
    for name, coords in KNOWN_PLACES.items():
        if name in q_lower or q_lower in name:
            res = [{"display_name": coords[2], "lat": coords[0], "lng": coords[1], "type": "known"}]
            _geocoding_cache[cache_key] = res
            return res

    try:
        async with httpx.AsyncClient(timeout=2.5) as client:
            resp = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params={
                    "q": query.strip(),
                    "format": "json",
                    "addressdetails": 1,
                    "limit": 5,
                },
                headers={"User-Agent": "UrbanCompanion/1.0"},
            )
            if resp.status_code == 200:
                data = resp.json()
                results = []
                for item in data:
                    results.append({
                        "display_name": item.get("display_name", ""),
                        "lat": float(item["lat"]),
                        "lng": float(item["lon"]),
                        "type": item.get("type", "location"),
                    })
                _geocoding_cache[cache_key] = results
                return results
    except Exception as e:
        print("Geocoding fast fallback:", e)

    return []


async def geocode_location(place_name: str, fallback_lat: float = 40.7128, fallback_lng: float = -74.006) -> tuple[float, float, str]:
    """Convert place name to coordinates (lat, lng, display_name)."""
    if not place_name or not place_name.strip():
        return fallback_lat, fallback_lng, "Current Location"

    results = await search_places(place_name)
    if results:
        return results[0]["lat"], results[0]["lng"], results[0]["display_name"]

    return fallback_lat, fallback_lng, place_name
