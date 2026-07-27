import httpx
import json
from app.core.config import get_settings

settings = get_settings()


async def generate_response(
    ranked_options: list,
    shap_explanations: list,
    rag_context: str,
    user_query: str,
    nlu = None,
    city_data = None,
) -> str:
    top = ranked_options[0] if ranked_options else None
    explanations = "\n".join(
        f"- {e.feature}: {e.direction} by {e.contribution}% (value: {e.value})"
        for e in shap_explanations[:5]
    )

    options_text = "\n".join(
        f"  {i+1}. {opt.label} (Score: {opt.score}/100) - {opt.description}"
        for i, opt in enumerate(ranked_options)
    )

    prompt = f"""You are an urban travel advisor. Give a concise, friendly recommendation.

User query: "{user_query}"

Top recommendation: {top.label if top else "No recommendation"} - {top.description if top else ""}
Score: {top.score if top else 0}/100

Key factors:
{explanations}

Relevant city knowledge: {rag_context}

All options:
{options_text}

Instructions:
- Give a 1-2 sentence natural language recommendation
- Include the specific reason (e.g., "rain is slowing traffic")
- Mention the best time to leave
- Be conversational but precise
- Do NOT use markdown formatting

Response:"""

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{settings.LLM_API_URL}/api/generate",
                json={
                    "model": "llama3.1:8b",
                    "prompt": prompt,
                    "stream": False,
                },
            )
            resp.raise_for_status()
            output = resp.json().get("response", "")
            if output.strip():
                return output.strip()
    except Exception:
        pass

    return _fallback_response(top, shap_explanations, nlu, city_data)


def _fallback_response(top, shap_explanations, nlu=None, city_data=None) -> str:
    if not nlu:
        intent = "best_route"
    else:
        intent = getattr(nlu, "intent", "best_route")

    if not city_data:
        city_data = {}

    # 1. Weather Check
    if intent == "weather_check":
        w = city_data.get("weather", {})
        temp = w.get("temperature", 22)
        desc = w.get("description", "clear sky")
        wind = w.get("wind_speed", 3.5)
        hum = w.get("humidity", 60)
        return f"The current weather is {desc} at {temp}°C, with {hum}% humidity and wind speeds of {wind} m/s."

    # 2. Pollution / Air Quality Check
    elif intent == "pollution_check":
        p = city_data.get("pollution", {})
        aqi = p.get("aqi", 2)
        lbl = p.get("label", "Moderate")
        pm = p.get("pm25", 15.0)
        return f"The air quality index is {aqi} ({lbl}) with PM2.5 levels around {pm} µg/m³. Outdoor activities are safe."

    # 3. Find Parking
    elif intent == "find_parking":
        pk = city_data.get("parking", {})
        spots = pk.get("nearby_spots", 25)
        price = pk.get("avg_price_per_hour", 4.00)
        trend = pk.get("trend", "stable")
        return f"There are about {spots} parking spots available nearby, averaging ${price:.2f} per hour. Parking occupancy is {trend}."

    # 4. Traffic Check
    elif intent == "traffic_check":
        tf = city_data.get("traffic", {})
        cong = tf.get("congestion_level", "moderate")
        dur = tf.get("travel_time_seconds", 1800) // 60
        dist = tf.get("distance_meters", 8000) / 1000
        rush = "active" if tf.get("is_rush_hour") else "not active"
        return f"Road traffic congestion is {cong} right now with rush hour {rush}. A drive across the route is about {dist:.1f} km, taking around {dur} minutes."

    # 5. Public Transit Info
    elif intent == "transit_info":
        tr = city_data.get("transit", {})
        modes = ", ".join(tr.get("available_modes", ["bus"]))
        dur = tr.get("estimated_time_minutes", 40)
        dep = tr.get("next_departure", "8 min")
        trans = tr.get("transfers", 1)
        return f"Public transit options include {modes}. The next departure is in {dep}, and the trip takes about {dur} minutes with {trans} transfer(s)."

    # 6. Event Search
    elif intent == "event_search":
        return "Here are some popular events happening in the city: Summer Music Festival in Central Park (4 PM), Modern Art Gallery Exhibition (10 AM - 6 PM), and the Local Farmer's Market on 5th Ave."

    # 7. Should I leave now?
    elif intent == "should_i_leave_now":
        tf = city_data.get("traffic", {})
        is_rush = tf.get("is_rush_hour", False)
        if is_rush:
            return "No, traffic is currently heavy due to rush hour. I recommend waiting 30 to 45 minutes for congestion to ease."
        return "Yes! Traffic is light right now, and the weather is good. It's the perfect time to leave."

    # Fallback to route recommendation (best_route or default)
    if not top:
        return "I couldn't generate a specific recommendation right now. Please try again."

    reasons = []
    for e in shap_explanations[:3]:
        if e.direction == "increases" and abs(e.contribution) > 2:
            reasons.append(f"{e.feature.lower()} is {e.direction} travel difficulty")

    reason_text = " and ".join(reasons[:2]) if reasons else "current conditions look reasonable"

    if top.mode == "transit":
        return f"Take public transit — it's about {top.travel_time_minutes} minutes and avoids the hassle. {reason_text.title()}."
    else:
        return f"Recommendation: {top.label}. Estimated {top.travel_time_minutes} min travel time. {reason_text.title()}."
