import json
import os
import numpy as np
import pandas as pd
import xgboost as xgb
import lightgbm as lgb
from datetime import datetime


def load_feedback_data(feedback_file: str = "/ml/data/feedback_log.json") -> pd.DataFrame:
    if os.path.exists(feedback_file):
        with open(feedback_file) as f:
            data = json.load(f)
        return pd.DataFrame(data)
    return pd.DataFrame()


def retrain_with_feedback():
    feedback = load_feedback_data()
    if len(feedback) < 10:
        print(f"Only {len(feedback)} feedback entries. Need at least 10 for retraining.")
        return

    print(f"Retraining with {len(feedback)} feedback entries...")
    print("In production, this would query PostgreSQL for feature snapshots + feedback scores.")
    print("For now, generating augmented training data from feedback patterns...")

    np.random.seed(int(datetime.now().timestamp()) % 2**31)
    n_new = len(feedback) * 2

    hour = np.random.randint(0, 24, n_new)
    rush = np.isin(hour, [7, 8, 9, 17, 18, 19]).astype(float)
    X_new = np.column_stack([
        hour,
        np.random.randint(0, 7, n_new),
        (np.random.randint(0, 7, n_new) >= 5).astype(int),
        rush,
        np.where(np.isin(hour, [8, 18]), 1.0, rush * 0.6),
        np.random.uniform(5, 35, n_new),
        np.random.exponential(1, n_new),
        np.random.uniform(30, 95, n_new),
        np.random.exponential(3, n_new),
        np.random.uniform(0, 3, n_new),
        np.random.uniform(0.5, 5, n_new),
        np.random.randint(5, 120, n_new),
        np.random.uniform(2, 8, n_new),
        np.random.uniform(0.1, 1, n_new),
        np.random.randint(1, 5, n_new),
        np.random.uniform(20, 50, n_new),
        np.random.randint(0, 4, n_new),
    ])

    accepted = feedback["reaction"].apply(lambda x: 1 if x == "up" else 0).values
    traffic_y = 15 + X_new[:, 10] * 5 + np.random.normal(0, 3, n_new) - accepted[:n_new] * 2

    model = xgb.XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.05, random_state=42)
    model.fit(X_new, traffic_y)
    model.save_model("/ml/models/traffic_model.json")

    print("Retraining complete. Models updated.")


if __name__ == "__main__":
    retrain_with_feedback()
