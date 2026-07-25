import numpy as np
from typing import List
from app.models.schemas import SHAPContribution

FEATURE_NAMES = [
    "hour_of_day", "day_of_week", "is_weekend", "is_rush_hour",
    "rush_hour_intensity", "temperature", "rain_mm", "humidity",
    "wind_speed", "weather_severity", "congestion_score",
    "travel_time_minutes", "parking_spots", "parking_price",
    "parking_availability", "aqi", "transit_time_minutes",
    "transit_transfers",
]

DISPLAY_NAMES = {
    "hour_of_day": "Time of Day",
    "day_of_week": "Day of Week",
    "is_weekend": "Weekend",
    "is_rush_hour": "Rush Hour",
    "rush_hour_intensity": "Rush Hour Intensity",
    "temperature": "Temperature",
    "rain_mm": "Rainfall",
    "humidity": "Humidity",
    "wind_speed": "Wind Speed",
    "weather_severity": "Weather Impact",
    "congestion_score": "Traffic Congestion",
    "travel_time_minutes": "Base Travel Time",
    "parking_spots": "Parking Spots",
    "parking_price": "Parking Cost",
    "parking_availability": "Parking Availability",
    "aqi": "Air Quality",
    "transit_time_minutes": "Transit Time",
    "transit_transfers": "Transit Transfers",
}


def get_shap_explanations(features: dict) -> List[SHAPContribution]:
    try:
        import shap
        X = np.array([features.get(f, 0) for f in FEATURE_NAMES]).reshape(1, -1)

        class FakeModel:
            def predict(self, X):
                return np.array([20 + X[0][10] * 5 + X[0][6] * 2])

        explainer = shap.Explainer(FakeModel(), np.zeros((1, len(FEATURE_NAMES))))
        shap_values = explainer(X)

        contributions = []
        values = shap_values.values[0]
        for i, (fname, val) in enumerate(zip(FEATURE_NAMES, values)):
            if abs(val) > 0.1:
                contributions.append(SHAPContribution(
                    feature=DISPLAY_NAMES.get(fname, fname),
                    contribution=round(float(val), 2),
                    direction="increases" if val > 0 else "decreases",
                    value=features.get(fname, 0),
                ))

        contributions.sort(key=lambda x: abs(x.contribution), reverse=True)
        return contributions[:8]

    except Exception:
        return _heuristic_explanations(features)


def _heuristic_explanations(features: dict) -> List[SHAPContribution]:
    contributions = []

    if features.get("congestion_score", 0) > 2:
        contributions.append(SHAPContribution(
            feature="Traffic Congestion",
            contribution=round(features["congestion_score"] * 3.5, 1),
            direction="increases",
            value=f"Score: {features['congestion_score']}",
        ))

    if features.get("rain_mm", 0) > 0:
        contributions.append(SHAPContribution(
            feature="Rainfall",
            contribution=round(features["rain_mm"] * 4, 1),
            direction="increases",
            value=f"{features['rain_mm']}mm",
        ))

    if features.get("is_rush_hour"):
        contributions.append(SHAPContribution(
            feature="Rush Hour",
            contribution=round(features.get("rush_hour_intensity", 0.5) * 15, 1),
            direction="increases",
            value="Active",
        ))

    if features.get("parking_availability", 1) > 0.6:
        contributions.append(SHAPContribution(
            feature="Parking Availability",
            contribution=round(features["parking_availability"] * 10, 1),
            direction="decreases",
            value=f"{int(features['parking_availability'] * 100)}% spots",
        ))

    if features.get("aqi", 2) > 3:
        contributions.append(SHAPContribution(
            feature="Air Quality (Poor)",
            contribution=round(features["aqi"] * 4, 1),
            direction="increases",
            value=f"AQI {features['aqi']}",
        ))

    if features.get("transit_time_minutes", 35) < features.get("travel_time_minutes", 30):
        contributions.append(SHAPContribution(
            feature="Transit is Faster",
            contribution=round(
                (features.get("travel_time_minutes", 30) - features.get("transit_time_minutes", 35)) * 0.5, 1
            ),
            direction="decreases",
            value=f"{int(features.get('transit_time_minutes', 35))} min vs driving",
        ))

    contributions.sort(key=lambda x: abs(x.contribution), reverse=True)
    return contributions[:6]
