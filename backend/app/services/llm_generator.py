import httpx
import json
from app.core.config import get_settings

settings = get_settings()


async def generate_response(
    ranked_options: list,
    shap_explanations: list,
    rag_context: str,
    user_query: str,
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

    return _fallback_response(top, shap_explanations)


def _fallback_response(top, shap_explanations) -> str:
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
