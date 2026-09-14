import time
from typing import List, Dict, Any

class MemoryStore:
    def __init__(self):
        # In-memory vector store simulator / ChromaDB fallback
        self._store: List[Dict[str, Any]] = [
            {
                "id": "mem_1",
                "category": "Preference",
                "content": "Prefers dark cyberpunk glassmorphism UI with vibrant neon gradients.",
                "confidence": 0.98,
                "timestamp": "2026-08-13 18:00:00"
            },
            {
                "id": "mem_2",
                "category": "Tech Stack",
                "content": "Building Neuro platform using Vite, React, Python FastAPI backend, and ChromaDB vector store.",
                "confidence": 0.96,
                "timestamp": "2026-08-13 18:10:00"
            }
        ]

    def query_memories(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Performs vector similarity search against stored memories."""
        query_lower = query.lower()
        results = []
        for mem in self._store:
            score = 0.70
            if any(term in mem["content"].lower() for term in query_lower.split()):
                score = 0.94
            results.append({**mem, "similarity_score": round(score, 3)})
        
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:top_k]

    def add_memory(self, category: str, content: str) -> Dict[str, Any]:
        """Stores a new user preference or fact into vector memory."""
        mem = {
            "id": f"mem_{int(time.time())}",
            "category": category,
            "content": content,
            "confidence": 0.99,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self._store.append(mem)
        return mem

    def list_all(self) -> List[Dict[str, Any]]:
        return self._store
