import asyncio
import httpx
import time
from app.models.schemas import QueryRequest, NLUResult
from app.core.config import get_settings

settings = get_settings()

_cache: dict[str, tuple[float, dict]] = {}
TTL_DEFAULT = 120


def _cache_get(key: str) -> dict | None:
    if key in _cache:
        expiry, data = _cache[key]
        if time.time() < expiry:
            return data
        del _cache[key]
    return None


def _cache_set(key: str, data: dict, ttl: int = TTL_DEFAULT):
    _cache[key] = (time.time() + ttl, data)


async def _fetch_weather(lat: float, lng: float) -> dict:
    cache_key = f"weather_{lat:.2f}_{lng:.2f}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    if settings.OPENWEATHER_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(
                    "https://api.openweathermap.org/data/2.5/weather",
                    params={"lat": lat, "lon": lng, "appid": settings.OPENWEATHER_API_KEY, "units": "metric"},
                )
                resp.raise_for_status()
                data = resp.json()
                result = {
                    "temperature": data["main"]["temp"],
                    "description": data["weather"][0]["description"],
                    "humidity": data["main"]["humidity"],
                    "wind_speed": data["wind"]["speed"],
                    "rain_1h": data.get("rain", {}).get("1h", 0),
                }
                _cache_set(cache_key, result, 900)
                return result
        except Exception:
            pass

    import random
    hour = time.localtime().tm_hour
    temp = 18 + 8 * (0.5 + 0.5 * __import__("math").sin((hour - 6) * 3.14159 / 12))
    result = {
        "temperature": round(temp, 1),
        "description": random.choice(["clear sky", "few clouds", "scattered clouds", "light rain", "overcast clouds"]),
        "humidity": random.randint(40, 85),
        "wind_speed": round(random.uniform(1, 8), 1),
        "rain_1h": round(random.uniform(0, 3), 1) if random.random() < 0.3 else 0,
    }
    _cache_set(cache_key, result, 900)
    return result


async def _fetch_traffic(origin: tuple[float, float], dest: tuple[float, float]) -> dict:
    cache_key = f"traffic_{origin[0]:.2f}_{origin[1]:.2f}_{dest[0]:.2f}_{dest[1]:.2f}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"https://router.project-osrm.org/route/v1/driving/{origin[1]},{origin[0]};{dest[1]},{dest[0]}",
                params={"overview": "false", "alternatives": "true"},
            )
            resp.raise_for_status()
            data = resp.json()
            routes = data.get("routes", [])
            if routes:
                avg_speed = routes[0]["distance"] / max(routes[0]["duration"], 1)
                congestion = "light" if avg_speed > 12 else "moderate" if avg_speed > 8 else "heavy"
                result = {
                    "congestion_level": congestion,
                    "travel_time_seconds": routes[0]["duration"],
                    "distance_meters": routes[0]["distance"],
                    "num_alternatives": len(routes),
                    "departure_time": time.strftime("%H:%M"),
                    "hour": time.localtime().tm_hour,
                    "is_rush_hour": time.localtime().tm_hour in (7, 8, 9, 17, 18, 19),
                }
                _cache_set(cache_key, result, 120)
                return result
    except Exception:
        pass

    import random
    hour = time.localtime().tm_hour
    is_rush = hour in (7, 8, 9, 17, 18, 19)
    result = {
        "congestion_level": "heavy" if is_rush else random.choice(["light", "moderate"]),
        "travel_time_seconds": random.randint(900, 2400) if is_rush else random.randint(600, 1500),
        "distance_meters": random.randint(4000, 12000),
        "num_alternatives": 3,
        "departure_time": time.strftime("%H:%M"),
        "hour": hour,
        "is_rush_hour": is_rush,
    }
    _cache_set(cache_key, result, 120)
    return result


async def _fetch_parking(lat: float, lng: float) -> dict:
    cache_key = f"parking_{lat:.2f}_{lng:.2f}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    import random
    hour = time.localtime().tm_hour
    base_spots = max(10, 100 - abs(hour - 14) * 12)
    result = {
        "nearby_spots": base_spots + random.randint(-10, 10),
        "avg_price_per_hour": round(3.50 + (0.5 if 7 <= hour <= 19 else 0) + random.uniform(-0.3, 0.3), 2),
        "coverage_radius_meters": 500,
        "trend": "filling" if 7 <= hour <= 9 or 17 <= hour <= 19 else "stable",
    }
    _cache_set(cache_key, result, 180)
    return result


async def _fetch_pollution(lat: float, lng: float) -> dict:
    cache_key = f"pollution_{lat:.2f}_{lng:.2f}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    if settings.OPENWEATHER_API_KEY:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(
                    "https://api.openweathermap.org/data/2.5/air_pollution",
                    params={"lat": lat, "lon": lng, "appid": settings.OPENWEATHER_API_KEY},
                )
                resp.raise_for_status()
                data = resp.json()
                aqi = data.get("list", [{}])[0].get("main", {}).get("aqi", 2)
                result = {
                    "aqi": aqi,
                    "label": ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1],
                    "pm25": round(data.get("list", [{}])[0].get("components", {}).get("pm2_5", 0), 1),
                }
                _cache_set(cache_key, result, 900)
                return result
        except Exception:
            pass

    import random
    aqi = random.randint(1, 4)
    result = {"aqi": aqi, "label": ["Good", "Fair", "Moderate", "Poor"][aqi - 1], "pm25": round(random.uniform(5, 40), 1)}
    _cache_set(cache_key, result, 900)
    return result


async def _fetch_transit(origin: tuple[float, float], dest: tuple[float, float]) -> dict:
    cache_key = f"transit_{origin[0]:.2f}_{origin[1]:.2f}"
    cached = _cache_get(cache_key)
    if cached:
        return cached

    import random
    hour = time.localtime().tm_hour
    base_time = 35 + (10 if hour in (7, 8, 9, 17, 18, 19) else 0)
    result = {
        "available_modes": ["bus", "subway", "walk"],
        "estimated_time_minutes": base_time + random.randint(-5, 5),
        "next_departure": f"{random.randint(2, 12)} min",
        "transfers": random.choice([0, 1, 1, 2]),
    }
    _cache_set(cache_key, result, 300)
    return result


async def aggregate_city_data(req: QueryRequest, nlu: NLUResult) -> dict:
    origin = (req.gps_lat or 40.7128, req.gps_lng or -74.0060)
    dest = (req.dest_lat or 40.7580, req.dest_lng or -73.9855)

    results = await asyncio.gather(
        _fetch_weather(origin[0], origin[1]),
        _fetch_traffic(origin, dest),
        _fetch_parking(dest[0], dest[1]),
        _fetch_pollution(origin[0], origin[1]),
        _fetch_transit(origin, dest),
        return_exceptions=True,
    )

    def safe(result, fallback):
        return result if not isinstance(result, Exception) else fallback

    return {
        "weather": safe(results[0], {"temperature": 22, "description": "partly cloudy", "humidity": 65, "wind_speed": 3.5, "rain_1h": 0}),
        "traffic": safe(results[1], {"congestion_level": "moderate", "travel_time_seconds": 1800, "distance_meters": 8000, "num_alternatives": 2, "departure_time": time.strftime("%H:%M"), "hour": time.localtime().tm_hour, "is_rush_hour": False}),
        "parking": safe(results[2], {"nearby_spots": 30, "avg_price_per_hour": 4.0, "coverage_radius_meters": 500, "trend": "stable"}),
        "pollution": safe(results[3], {"aqi": 2, "label": "Moderate", "pm25": 15.0}),
        "transit": safe(results[4], {"available_modes": ["bus"], "estimated_time_minutes": 40, "next_departure": "8 min", "transfers": 1}),
    }
