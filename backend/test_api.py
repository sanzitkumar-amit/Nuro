import asyncio
import sys
import httpx
import json

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://127.0.0.1:8000"

async def test_backend():
    print("[TEST] Testing Neuro Backend APIs...")
    async with httpx.AsyncClient(timeout=15.0) as client:
        # 1. Health check
        h = await client.get(f"{BASE_URL}/health")
        print(f"[Health] Status: {h.status_code}, Body: {h.json()}")

        # 2. Add Memory
        m = await client.post(f"{BASE_URL}/memories", json={"user_id": "test_user", "content": "I prefer TypeScript over JavaScript", "category": "preference"})
        print(f"[Memory Add] Response: {m.json()}")

        # 3. List Memories
        m_list = await client.get(f"{BASE_URL}/memories/test_user")
        print(f"[Memory List] Count: {len(m_list.json()['memories'])}")

        # 4. Transcribe
        t = await client.post(f"{BASE_URL}/transcribe")
        print(f"[Transcribe] Response: {t.json()}")

        # 5. Speak
        s = await client.post(f"{BASE_URL}/speak", json={"text": "Hello, I am Neuro."})
        print(f"[Speak] Response: {s.json()}")

        # 6. Create Task
        tk = await client.post(f"{BASE_URL}/tasks", json={"user_id": "test_user", "title": "Market Analysis", "steps": ["Gather data", "Analyze competitors", "Draft report"]})
        task_id = tk.json()["id"]
        print(f"[Task Created] ID: {task_id}")

        # Wait a bit and check task status
        await asyncio.sleep(3.0)
        tk_status = await client.get(f"{BASE_URL}/tasks/{task_id}")
        print(f"[Task Progress] Status: {tk_status.json()['status']}, Current Step: {tk_status.json()['current_step']}")

        # 7. Chat SSE Stream
        print("[Chat SSE Stream Test]:")
        async with client.stream("POST", f"{BASE_URL}/chat", json={"user_id": "test_user", "message": "Research Python web frameworks and draw a diagram"}) as response:
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data_str = line[6:]
                    print("  STREAM EVENT:", data_str[:120])

    print("[SUCCESS] Backend Verification Complete!")

if __name__ == "__main__":
    asyncio.run(test_backend())
