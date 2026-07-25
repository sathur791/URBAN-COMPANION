import json
import numpy as np

_documents = [
    "Use public transit during rush hours to avoid traffic congestion.",
    "Heavy rain increases travel time by 15-20% and reduces visibility.",
    "Parking fills up after 6 PM in downtown areas. Arrive before 5:30 PM.",
    "Air quality index above 150 is unhealthy for sensitive groups.",
    "Rush hour traffic peaks at 8 AM and 6 PM on weekdays.",
    "Subway is usually faster than driving during 7-9 AM and 5-7 PM.",
    "Weekend traffic is lighter but parking at events fills up early.",
    "Electric bikes are available at docking stations near transit hubs.",
    "Construction on Main St adds 10 minutes to commute times.",
    "Carpool lanes reduce drive time by 20% during peak hours.",
    "Avoid highways after 4 PM on Fridays — heavy congestion expected.",
    "Light rain combined with rush hour creates worst-case travel conditions.",
    "Walking is recommended for distances under 1 km to avoid parking hassle.",
    "Bike lanes are closed on weekdays 7-9 AM for maintenance.",
    "Airport shuttle runs every 15 minutes from Central Station.",
]

_keyword_map = {
    "leave now": [0, 4, 11],
    "should i leave": [0, 4, 11],
    "parking": [2, 7, 12],
    "find parking": [2, 7, 12],
    "best route": [0, 3, 5],
    "traffic": [0, 4, 8, 10],
    "congestion": [0, 4, 10],
    "weather": [1, 11, 3],
    "rain": [1, 11],
    "transit": [5, 0, 14],
    "bus": [5, 14],
    "train": [5, 14],
    "subway": [5],
    "air quality": [3],
    "pollution": [3],
    "event": [6, 7],
    "bike": [7, 13],
    "walk": [12],
    "rush hour": [4, 0, 10],
}

try:
    from sentence_transformers import SentenceTransformer
    import faiss

    _model = None
    _index = None

    def _get_model():
        global _model
        if _model is None:
            _model = SentenceTransformer("all-MiniLM-L6-v2")
        return _model

    def _init_index():
        global _index
        model = _get_model()
        embeddings = model.encode(_documents)
        dim = embeddings.shape[1]
        _index = faiss.IndexFlatL2(dim)
        _index.add(np.array(embeddings).astype("float32"))

    def retrieve_context(user_id: int, nlu, top_k: int = 3) -> str:
        global _index
        if _index is None:
            _init_index()

        model = _get_model()
        query_text = nlu.intent.replace("_", " ") + " " + json.dumps(nlu.entities)
        query_emb = model.encode([query_text]).astype("float32")
        distances, indices = _index.search(query_emb, top_k)
        chunks = [_documents[i] for i in indices[0] if i < len(_documents)]
        return " | ".join(chunks)

except ImportError:
    def retrieve_context(user_id: int, nlu, top_k: int = 3) -> str:
        query_text = (nlu.intent.replace("_", " ") + " " + json.dumps(nlu.entities)).lower()
        scored = []
        for idx, doc in enumerate(_documents):
            score = sum(1 for kw, doc_indices in _keyword_map.items() if kw in query_text and idx in doc_indices)
            if score == 0:
                score = sum(1 for kw in _keyword_map if kw in query_text and any(w in doc.lower() for w in kw.split()))
            scored.append((score, idx))
        scored.sort(key=lambda x: x[0], reverse=True)
        chunks = [_documents[i] for _, i in scored[:top_k] if scored[0][0] > 0]
        return " | ".join(chunks) if chunks else _documents[0]
