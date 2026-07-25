import numpy as np
from datetime import datetime
from app.models.schemas import NLUResult


def build_features(city_data: dict, nlu: NLUResult, user_id: int) -> dict:
    now = datetime.now()
    weather = city_data.get("weather", {})
    traffic = city_data.get("traffic", {})
    parking = city_data.get("parking", {})
    pollution = city_data.get("pollution", {})
    transit = city_data.get("transit", {})

    temp = weather.get("temperature", 22)
    rain = weather.get("rain_1h", 0)
    humidity = weather.get("humidity", 50)
    wind = weather.get("wind_speed", 0)

    weather_severity = (
        (1.0 if rain > 5 else 0.3 if rain > 0 else 0)
        + (1.0 if temp < 0 or temp > 35 else 0)
        + (0.5 if wind > 10 else 0)
        + (0.3 if humidity > 85 else 0)
    )
    weather_severity = min(weather_severity, 5.0)

    congestion = traffic.get("congestion_level", "moderate")
    congestion_score = {"light": 1, "moderate": 2.5, "heavy": 4}.get(congestion, 2.5)

    travel_time = traffic.get("travel_time_seconds", 1800) / 60

    parking_spots = parking.get("nearby_spots", 30)
    parking_price = parking.get("avg_price_per_hour", 4.0)
    parking_availability = min(parking_spots / 100, 1.0)

    aqi = pollution.get("aqi", 2)

    transit_time = transit.get("estimated_time_minutes", 35)
    transfers = transit.get("transfers", 0)

    day_of_week = now.weekday()
    hour = now.hour
    is_weekend = day_of_week >= 5
    is_rush_hour = hour in (7, 8, 9, 17, 18, 19)

    rush_hour_intensity = 0
    if is_rush_hour:
        if hour in (8, 18):
            rush_hour_intensity = 1.0
        else:
            rush_hour_intensity = 0.6

    features = {
        "hour_of_day": hour,
        "day_of_week": day_of_week,
        "is_weekend": int(is_weekend),
        "is_rush_hour": int(is_rush_hour),
        "rush_hour_intensity": rush_hour_intensity,
        "temperature": temp,
        "rain_mm": rain,
        "humidity": humidity,
        "wind_speed": wind,
        "weather_severity": weather_severity,
        "congestion_score": congestion_score,
        "travel_time_minutes": travel_time,
        "parking_spots": parking_spots,
        "parking_price": parking_price,
        "parking_availability": parking_availability,
        "aqi": aqi,
        "transit_time_minutes": transit_time,
        "transit_transfers": transfers,
        "user_id": user_id,
        "intent": nlu.intent,
        "confidence": nlu.confidence,
    }
    return features


def features_to_array(features: dict) -> np.ndarray:
    FEATURE_ORDER = [
        "hour_of_day", "day_of_week", "is_weekend", "is_rush_hour",
        "rush_hour_intensity", "temperature", "rain_mm", "humidity",
        "wind_speed", "weather_severity", "congestion_score",
        "parking_spots", "parking_price",
        "parking_availability", "aqi", "transit_time_minutes",
        "transit_transfers",
    ]
    return np.array([features.get(f, 0) for f in FEATURE_ORDER]).reshape(1, -1)
