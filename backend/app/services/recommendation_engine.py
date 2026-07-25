from typing import List
from app.models.schemas import Recommendation


def generate_recommendations(predictions: dict, user_id: int) -> List[Recommendation]:
    options = []
    traffic_min = predictions["traffic_minutes"]
    crowd = predictions["crowd_density"]
    parking = predictions["parking_available_pct"]
    weather_penalty = predictions["weather_penalty"]
    transit_min = predictions["transit_minutes"]

    drive_score = max(0, 100 - traffic_min * 1.5 - weather_penalty * 5 + parking * 0.3)
    options.append(Recommendation(
        option_id=1,
        label="Drive Now",
        description=f"Drive via fastest route. ~{int(traffic_min)} min drive, parking ~{int(parking)}% available.",
        score=round(drive_score, 1),
        travel_time_minutes=int(traffic_min),
        distance_km=round(traffic_min * 0.4, 1),
        mode="drive",
    ))

    leave_later_score = max(0, 100 - (traffic_min - 5) * 1.5 - weather_penalty * 3 + parking * 0.5)
    options.append(Recommendation(
        option_id=2,
        label="Leave in 30 min",
        description=f"Wait 30 min for traffic to ease. ~{int(traffic_min * 0.7)} min drive expected.",
        score=round(leave_later_score, 1),
        travel_time_minutes=int(traffic_min * 0.7) + 30,
        distance_km=round(traffic_min * 0.7 * 0.4, 1),
        mode="drive",
    ))

    transit_score = max(0, 90 - transit_min * 1.2 - weather_penalty * 2 + (100 - crowd) * 0.2)
    options.append(Recommendation(
        option_id=3,
        label="Take Transit",
        description=f"Public transit ~{int(transit_min)} min. Avoids traffic and parking hassle.",
        score=round(transit_score, 1),
        travel_time_minutes=int(transit_min),
        mode="transit",
    ))

    options.sort(key=lambda x: x.score, reverse=True)
    return options
