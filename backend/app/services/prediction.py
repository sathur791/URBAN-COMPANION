import os
import numpy as np
from app.services.feature_engineering import features_to_array

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "ml", "models")
MODEL_DIR = os.path.normpath(MODEL_DIR)

_loaded_models = {}


class MockTrafficModel:
    def predict(self, X):
        X_arr = np.array(X)
        base = 15 + X_arr[:, 10] * 5 + X_arr[:, 4] * 8
        base += X_arr[:, 6] * 2
        return base + np.random.normal(0, 1, len(X_arr))


class MockCrowdModel:
    def predict(self, X):
        X_arr = np.array(X)
        base = 50 + X_arr[:, 3] * 30 + X_arr[:, 0] * 2
        base -= X_arr[:, 2] * 15
        return np.clip(base + np.random.normal(0, 5, len(X_arr)), 0, 100)


class MockParkingModel:
    def predict(self, X):
        X_arr = np.array(X)
        base = X_arr[:, 12] * 0.8 - X_arr[:, 3] * 20
        base += X_arr[:, 2] * 10
        return np.clip(base + np.random.normal(0, 5, len(X_arr)), 0, 100)


_fallbacks = {
    "traffic": MockTrafficModel(),
    "crowd": MockCrowdModel(),
    "parking": MockParkingModel(),
}


def _load_model(name: str):
    if name in _loaded_models:
        return _loaded_models[name]

    xgb_path = os.path.join(MODEL_DIR, f"{name}_model.json")
    lgb_path = os.path.join(MODEL_DIR, f"{name}_model.txt")

    try:
        if os.path.exists(xgb_path):
            import xgboost as xgb
            model = xgb.XGBRegressor()
            model.load_model(xgb_path)
            _loaded_models[name] = model
            return model
        elif os.path.exists(lgb_path):
            import lightgbm as lgb
            model = lgb.LGBMRegressor()
            model.booster_ = lgb.Booster(model_file=lgb_path)
            _loaded_models[name] = model
            return model
    except Exception:
        pass

    return _fallbacks.get(name, MockTrafficModel())


def get_all_predictions(features: dict) -> dict:
    X = features_to_array(features)
    arr = X.flatten().tolist()

    traffic_minutes = float(_load_model("traffic").predict([arr])[0])
    crowd_density = float(_load_model("crowd").predict([arr])[0])
    parking_available = float(_load_model("parking").predict([arr])[0])

    return {
        "traffic_minutes": max(5, traffic_minutes),
        "crowd_density": max(0, min(100, crowd_density)),
        "parking_available_pct": max(0, min(100, parking_available)),
        "weather_penalty": features.get("weather_severity", 0) * 3,
        "transit_minutes": features.get("transit_time_minutes", 35),
    }
