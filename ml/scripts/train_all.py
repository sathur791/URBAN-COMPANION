import numpy as np
import pandas as pd
import xgboost as xgb
import lightgbm as lgb
import os
import json
from datetime import datetime


def generate_synthetic_data(n_samples: int = 5000):
    np.random.seed(42)
    hour = np.random.randint(0, 24, n_samples)
    day_of_week = np.random.randint(0, 7, n_samples)
    is_weekend = (day_of_week >= 5).astype(int)
    is_rush_hour = np.isin(hour, [7, 8, 9, 17, 18, 19]).astype(int)
    rush_intensity = np.where(np.isin(hour, [8, 18]), 1.0, np.where(is_rush_hour, 0.6, 0))

    temperature = 15 + 15 * np.sin(np.random.uniform(0, 2 * np.pi, n_samples))
    rain_mm = np.random.exponential(1, n_samples) * (np.random.random(n_samples) < 0.3)
    humidity = np.random.uniform(30, 95, n_samples)
    wind_speed = np.random.exponential(3, n_samples)
    weather_severity = (
        (rain_mm > 5).astype(float)
        + (rain_mm > 0).astype(float) * 0.3
        + (wind_speed > 10).astype(float) * 0.5
        + (humidity > 85).astype(float) * 0.3
        + ((temperature < 0) | (temperature > 35)).astype(float)
    )

    base_congestion = (
        1.0
        + rush_intensity * 2.5
        + is_weekend * (-0.5)
        + rain_mm * 0.15
        + np.random.normal(0, 0.3, n_samples)
    )
    congestion_score = np.clip(base_congestion, 0.5, 5)

    parking_spots = np.random.randint(5, 120, n_samples)
    parking_price = 3 + rush_intensity * 2 + np.random.normal(0, 0.5, n_samples)
    parking_availability = parking_spots / 100

    aqi = np.random.randint(1, 5, n_samples)
    transit_time = 25 + 10 * rush_intensity + np.random.normal(0, 5, n_samples)
    transit_transfers = np.random.randint(0, 4, n_samples)

    traffic_minutes = (
        15
        + congestion_score * 5
        + weather_severity * 2
        + np.random.normal(0, 2, n_samples)
    )

    crowd_density = (
        30
        + rush_intensity * 35
        - is_weekend * 10
        + (hour > 18).astype(float) * 10
        + rain_mm * (-2)
        + np.random.normal(0, 5, n_samples)
    )
    crowd_density = np.clip(crowd_density, 0, 100)

    parking_predicted = (
        parking_spots * 0.8
        - rush_intensity * 20
        + is_weekend * 10
        + np.random.normal(0, 5, n_samples)
    )
    parking_predicted = np.clip(parking_predicted, 0, 100)

    df = pd.DataFrame({
        "hour_of_day": hour,
        "day_of_week": day_of_week,
        "is_weekend": is_weekend,
        "is_rush_hour": is_rush_hour,
        "rush_hour_intensity": rush_intensity,
        "temperature": temperature,
        "rain_mm": rain_mm,
        "humidity": humidity,
        "wind_speed": wind_speed,
        "weather_severity": weather_severity,
        "congestion_score": congestion_score,
        "parking_spots": parking_spots,
        "parking_price": parking_price,
        "parking_availability": parking_availability,
        "aqi": aqi,
        "transit_time_minutes": transit_time,
        "transit_transfers": transit_transfers,
    })

    return df, traffic_minutes, crowd_density, parking_predicted


def train_and_save():
    df, traffic_y, crowd_y, parking_y = generate_synthetic_data(5000)
    feature_cols = df.columns.tolist()
    X = df.values

    models_dir = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "models"))
    os.makedirs(models_dir, exist_ok=True)

    metrics = {}

    # Traffic model
    traffic_model = xgb.XGBRegressor(
        n_estimators=200, max_depth=6, learning_rate=0.1,
        objective="reg:squarederror", random_state=42,
    )
    traffic_model.fit(X, traffic_y)
    traffic_model.save_model(os.path.join(models_dir, "traffic_model.json"))
    traffic_pred = traffic_model.predict(X)
    traffic_mae = float(np.mean(np.abs(traffic_y - traffic_pred)))
    traffic_rmse = float(np.sqrt(np.mean((traffic_y - traffic_pred) ** 2)))
    metrics["traffic"] = {"mae": traffic_mae, "rmse": traffic_rmse}

    # Crowd model
    crowd_model = lgb.LGBMRegressor(
        n_estimators=200, max_depth=6, learning_rate=0.1,
        objective="regression", random_state=42, verbose=-1,
    )
    crowd_model.fit(X, crowd_y)
    crowd_model.booster_.save_model(os.path.join(models_dir, "crowd_model.txt"))
    crowd_pred = crowd_model.predict(X)
    crowd_mae = float(np.mean(np.abs(crowd_y - crowd_pred)))
    crowd_rmse = float(np.sqrt(np.mean((crowd_y - crowd_pred) ** 2)))
    metrics["crowd"] = {"mae": crowd_mae, "rmse": crowd_rmse}

    # Parking model
    parking_model = xgb.XGBRegressor(
        n_estimators=200, max_depth=6, learning_rate=0.1,
        objective="reg:squarederror", random_state=42,
    )
    parking_model.fit(X, parking_y)
    parking_model.save_model(os.path.join(models_dir, "parking_model.json"))
    parking_pred = parking_model.predict(X)
    parking_mae = float(np.mean(np.abs(parking_y - parking_pred)))
    parking_rmse = float(np.sqrt(np.mean((parking_y - parking_pred) ** 2)))
    metrics["parking"] = {"mae": parking_mae, "rmse": parking_rmse}

    print("Training complete!")
    print(json.dumps(metrics, indent=2))

    with open(os.path.join(models_dir, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)

    return metrics


if __name__ == "__main__":
    train_and_save()
