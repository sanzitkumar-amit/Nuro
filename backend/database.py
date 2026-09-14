import os
import uuid
import datetime
import math
import re
from typing import List, Dict, Any, Optional
import aiosqlite

DB_PATH = os.path.join(os.path.dirname(__file__), "neuro.db")

async def init_db():
    """Initialize SQLite database schema for memories and background tasks."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS memories (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                content TEXT NOT NULL,
                category TEXT DEFAULT 'general',
                created_at TEXT NOT NULL
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS task_queue (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                title TEXT NOT NULL,
                steps TEXT NOT NULL,
                current_step INTEGER DEFAULT 0,
                status TEXT DEFAULT 'pending',
                result TEXT DEFAULT '',
                created_at TEXT NOT NULL
            )
        """)
        await db.commit()

# --- Memory Functions ---

async def save_memory(user_id: str, content: str, category: str = "general") -> Dict[str, Any]:
    """Save a user preference or fact to long-term memory."""
    memory_id = f"mem_{uuid.uuid4().hex[:8]}"
    created_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO memories (id, user_id, content, category, created_at) VALUES (?, ?, ?, ?, ?)",
            (memory_id, user_id, content, category, created_at)
        )
        await db.commit()
        
    return {
        "id": memory_id,
        "user_id": user_id,
        "content": content,
        "category": category,
        "created_at": created_at
    }

async def get_memories(user_id: str) -> List[Dict[str, Any]]:
    """Retrieve all stored memories for a user."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT id, user_id, content, category, created_at FROM memories WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,)
        ) as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

async def delete_memory(memory_id: str) -> bool:
    """Delete a memory by ID."""
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute("DELETE FROM memories WHERE id = ?", (memory_id,))
        await db.commit()
        return cursor.rowcount > 0

async def recall_memories(user_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Retrieve top 3-5 relevant memories based on keyword similarity & recency.
    Uses TF-IDF style term frequency matching for high precision RAG without heavy external dependencies.
    """
    memories = await get_memories(user_id)
    if not memories:
        return []

    # Clean query tokens
    query_tokens = set(re.findall(r'\w+', query.lower()))
    if not query_tokens:
        return memories[:top_k]

    scored_memories = []
    for mem in memories:
        mem_tokens = re.findall(r'\w+', mem["content"].lower())
        if not mem_tokens:
            continue
        
        # Calculate overlap score
        matches = sum(1 for token in query_tokens if token in mem_tokens)
        score = matches / (math.log(len(mem_tokens) + 1.5))
        
        # Boost for exact word matches in category or content
        if any(qt in mem["category"].lower() for qt in query_tokens):
            score += 1.0
            
        scored_memories.append((score, mem))

    # Sort by relevance score descending
    scored_memories.sort(key=lambda x: x[0], reverse=True)
    
    # Take top_k with non-zero relevance, fallback to most recent if no score match
    results = [mem for score, mem in scored_memories if score > 0][:top_k]
    if not results:
        results = memories[:top_k]
        
    return results

# --- Task Queue Functions ---

async def create_task(user_id: str, title: str, steps: List[str]) -> Dict[str, Any]:
    """Create a new background multi-step task."""
    task_id = f"task_{uuid.uuid4().hex[:8]}"
    created_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
    steps_str = "|||".join(steps)
    
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO task_queue (id, user_id, title, steps, current_step, status, result, created_at) VALUES (?, ?, ?, ?, 0, 'queued', '', ?)",
            (task_id, user_id, title, steps_str, created_at)
        )
        await db.commit()
        
    return {
        "id": task_id,
        "user_id": user_id,
        "title": title,
        "steps": steps,
        "current_step": 0,
        "status": "queued",
        "result": "",
        "created_at": created_at
    }

async def get_task(task_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve task details by ID."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(
            "SELECT id, user_id, title, steps, current_step, status, result, created_at FROM task_queue WHERE id = ?",
            (task_id,)
        ) as cursor:
            row = await cursor.fetchone()
            if not row:
                return None
            res = dict(row)
            res["steps"] = res["steps"].split("|||") if res["steps"] else []
            return res

async def update_task(task_id: str, current_step: int, status: str, result: str = "") -> Optional[Dict[str, Any]]:
    """Update task progress and status."""
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "UPDATE task_queue SET current_step = ?, status = ?, result = ? WHERE id = ?",
            (current_step, status, result, task_id)
        )
        await db.commit()
    return await get_task(task_id)
