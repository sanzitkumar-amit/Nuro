import os
import dotenv
dotenv.load_config() if hasattr(dotenv, "load_config") else dotenv.load_dotenv()

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from database import init_db, get_memories, delete_memory, save_memory, create_task, get_task
from orchestrator import process_chat_stream
from tools import tool_transcribe_audio, tool_generate_speech
from task_worker import launch_task_in_background

app = FastAPI(
    title="Neuro API Core",
    description="One Brain, Many Hands — Central AI Orchestration API",
    version="1.0.0"
)

# CORS setup for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    await init_db()

# --- Schemas ---

class ChatRequest(BaseModel):
    user_id: str = "default_user"
    message: str

class MemoryCreate(BaseModel):
    user_id: str = "default_user"
    content: str
    category: str = "general"

class SpeakRequest(BaseModel):
    text: str
    voice: Optional[str] = "Neuro-Default"

class TaskCreate(BaseModel):
    user_id: str = "default_user"
    title: str
    steps: List[str]

# --- Endpoints ---

@app.get("/health")
async def health_check():
    """System health check endpoint."""
    return {"status": "ok", "app": "Neuro Central Orchestrator", "version": "1.0.0"}

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    """
    Main SSE streaming endpoint for chat interactions.
    Streams memory recall, tool status, self-thinking indicators, and tokens.
    """
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
    return StreamingResponse(
        process_chat_stream(user_id=req.user_id, message=req.message),
        media_type="text/event-stream"
    )

@app.post("/transcribe")
async def transcribe_endpoint(
    audio: Optional[UploadFile] = File(None),
    audio_b64: Optional[str] = Form(None)
):
    """
    Voice transcription endpoint (Whisper API or stub).
    Accepts uploaded audio file or base64 encoded audio string.
    """
    if audio:
        content = await audio.read()
        res = await tool_transcribe_audio("file_upload")
    elif audio_b64:
        res = await tool_transcribe_audio(audio_b64)
    else:
        # Default mock transcript for demonstration
        res = {"status": "success", "transcript": "Tell Neuro to research the latest trends in artificial intelligence."}
        
    return res

@app.post("/speak")
async def speak_endpoint(req: SpeakRequest):
    """
    Text-to-speech output endpoint (ElevenLabs API or stub).
    """
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    res = await tool_generate_speech(text=req.text, voice=req.voice)
    return res

# --- Memory Endpoints ---

@app.get("/memories/{user_id}")
async def list_memories_endpoint(user_id: str):
    """Retrieve all long-term memories for a specific user."""
    memories = await get_memories(user_id)
    return {"user_id": user_id, "memories": memories}

@app.post("/memories")
async def add_memory_endpoint(req: MemoryCreate):
    """Manually add a memory for testing or user edit."""
    res = await save_memory(user_id=req.user_id, content=req.content, category=req.category)
    return res

@app.delete("/memories/{memory_id}")
async def delete_memory_endpoint(memory_id: str):
    """Delete a memory by ID."""
    success = await delete_memory(memory_id)
    if not success:
        raise HTTPException(status_code=404, detail="Memory not found")
    return {"status": "success", "deleted_id": memory_id}

# --- Task Queue Endpoints ---

@app.post("/tasks")
async def create_task_endpoint(req: TaskCreate):
    """Create a new multi-step background task and launch worker."""
    if not req.steps:
        raise HTTPException(status_code=400, detail="Steps list cannot be empty")
        
    task = await create_task(user_id=req.user_id, title=req.title, steps=req.steps)
    launch_task_in_background(task["id"])
    return task

@app.get("/tasks/{task_id}")
async def get_task_endpoint(task_id: str):
    """Check status and step progress of a background task."""
    task = await get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
