import httpx
import json
import re
from app.models.schemas import QueryRequest, NLUResult
from app.core.config import get_settings

settings = get_settings()

INTENT_MAP = {
    "should_i_leave_now": ["leave now", "should i go", "when should i leave", "time to go"],
    "find_parking": ["parking", "park", "where to park", "parking spot"],
    "best_route": ["best route", "fastest way", "how to get", "directions"],
    "traffic_check": ["traffic", "congestion", "road conditions", "traffic status"],
    "weather_check": ["weather", "rain", "temperature", "forecast"],
    "transit_info": ["bus", "train", "subway", "transit", "public transport"],
    "event_search": ["events", "happening", "things to do", "nearby events"],
    "pollution_check": ["air quality", "pollution", "aqi", "air"],
}

TOOL_SCHEMA = {
    "name": "extract_travel_info",
    "description": "Extract intent and entities from a user travel query",
    "parameters": {
        "type": "object",
        "properties": {
            "intent": {
                "type": "string",
                "enum": list(INTENT_MAP.keys()),
                "description": "The user's primary intent",
            },
            "entities": {
                "type": "object",
                "properties": {
                    "origin": {"type": "object", "properties": {"lat": {"type": "number"}, "lng": {"type": "number"}}},
                    "destination": {"type": "object", "properties": {"lat": {"type": "number"}, "lng": {"type": "number"}}},
                    "time": {"type": "string", "description": "Desired departure or arrival time"},
                    "mode": {"type": "string", "description": "Preferred transport mode"},
                    "event_name": {"type": "string"},
                },
            },
            "confidence": {"type": "number"},
        },
    },
}


def _keyword_fallback(text: str) -> NLUResult:
    text_lower = text.lower()
    best_intent = "best_route"
    best_score = 0
    for intent, keywords in INTENT_MAP.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > best_score:
            best_score = score
            best_intent = intent
    return NLUResult(intent=best_intent, entities={}, confidence=max(0.3, min(best_score * 0.3, 0.9)))


async def parse_query(req: QueryRequest) -> NLUResult:
    if not req.text:
        return NLUResult(intent="best_route", entities={
            "origin": {"lat": req.gps_lat or 0, "lng": req.gps_lng or 0},
            "destination": {"lat": req.dest_lat or 0, "lng": req.dest_lng or 0},
        }, confidence=0.7)

    try:
        prompt = f"""Extract the intent and entities from this travel query.
Return a JSON object with "intent", "entities", and "confidence".

User query: "{req.text}"

Possible intents: {', '.join(INTENT_MAP.keys())}

Response (JSON only):"""

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{settings.LLM_API_URL}/api/generate",
                json={
                    "model": "llama3.1:8b",
                    "prompt": prompt,
                    "stream": False,
                    "format": "json",
                },
            )
            resp.raise_for_status()
            output = resp.json().get("response", "")
            parsed = json.loads(output)

            return NLUResult(
                intent=parsed.get("intent", "best_route"),
                entities=parsed.get("entities", {}),
                confidence=parsed.get("confidence", 0.5),
            )
    except Exception:
        return _keyword_fallback(req.text)
