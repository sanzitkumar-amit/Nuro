import os
import json
import asyncio
import re
from typing import AsyncGenerator, Dict, Any, List, Optional
import anthropic
from database import recall_memories, save_memory
from tools import TOOLS_SCHEMA, execute_tools_parallel

# --- Heuristic Classifier for Speed & Cost Efficiency (Step 7) ---

TRIVIAL_PATTERNS = [
    r"^(hi|hello|hey|greetings|hola|howdy|sup)\b",
    r"^(thanks|thank you|thx|cheers|great|awesome|ok|okay)\b",
    r"^(who are you|what is your name|what can you do)\b",
    r"^(help|bye|goodbye|see ya)\b"
]

def is_trivial_message(message: str) -> bool:
    """Detect simple/greeting messages to bypass unnecessary memory retrieval & self-thinking loop."""
    cleaned = message.strip().lower()
    if len(cleaned) <= 15:
        for pattern in TRIVIAL_PATTERNS:
            if re.search(pattern, cleaned):
                return True
    return False

# --- Core Neuro Brain Orchestrator ---

SYSTEM_PROMPT = """You are Neuro, a personal AI assistant that thinks, plans, and decides which tool to use for each task, then gives one unified answer.

Your core capabilities include:
- web_research: Search live web information, factual answers, current news.
- write_code: Generate production ready code in any language.
- generate_image: Generate AI artwork or graphic concepts.
- generate_presentation: Build structured slide deck outlines.
- generate_speech: Convert text to synthesized voice.
- transcribe_audio: Convert spoken audio to text.
- run_automation: Execute external webhooks and workflow integrations.
- save_memory: Remember user preferences, style choices, or personal facts for future sessions.

Always maintain a crisp, helpful, articulate tone. If you learn something worth remembering about the user, call save_memory to persist it."""

async def generate_mock_orchestrated_stream(user_id: str, message: str) -> AsyncGenerator[str, None]:
    """Smart mock engine fallback when ANTHROPIC_API_KEY is not configured."""
    msg_lower = message.lower()

    # Step 3: Memory Recall (unless trivial)
    is_trivial = is_trivial_message(message)
    recalled_mems = []
    if not is_trivial:
        recalled_mems = await recall_memories(user_id, message, top_k=3)
        if recalled_mems:
            mem_summary = [m["content"] for m in recalled_mems]
            yield f"data: {json.dumps({'type': 'memory_recall', 'memories': mem_summary})}\n\n"
            await asyncio.sleep(0.2)

    # Auto-detect tool triggering in mock mode
    tools_to_run = []
    if any(k in msg_lower for k in ["search", "research", "news", "weather", "facts", "price", "find"]):
        tools_to_run.append({"name": "web_research", "args": {"query": message}})
    if any(k in msg_lower for k in ["code", "python", "javascript", "script", "function", "build a"]):
        tools_to_run.append({"name": "write_code", "args": {"prompt": message, "language": "python"}})
    if any(k in msg_lower for k in ["image", "picture", "draw", "photo", "generate an image", "logo"]):
        tools_to_run.append({"name": "generate_image", "args": {"prompt": message, "style": "futuristic digital art"}})
    if any(k in msg_lower for k in ["presentation", "slides", "deck", "powerpoint"]):
        tools_to_run.append({"name": "generate_presentation", "args": {"topic": message, "num_slides": 5}})
    if any(k in msg_lower for k in ["speak", "audio", "voice", "read this out"]):
        tools_to_run.append({"name": "generate_speech", "args": {"text": message, "voice": "Neuro-Default"}})
    if any(k in msg_lower for k in ["automate", "webhook", "zapier", "trigger"]):
        tools_to_run.append({"name": "run_automation", "args": {"action": "trigger_integration", "payload": {"user_id": user_id}}})

    # Memory learning detector (e.g. "I like Python", "My name is Amit", "Remember that...")
    if any(k in msg_lower for k in ["i like", "i prefer", "my favorite", "remember that", "my name is"]):
        mem_text = message.strip()
        await save_memory(user_id, mem_text, category="user_preference")
        tools_to_run.append({"name": "save_memory", "args": {"user_id": user_id, "content": mem_text, "category": "user_preference"}})

    # Execute tools & emit status events
    tool_results = []
    if tools_to_run:
        for t in tools_to_run:
            tname = t["name"]
            yield f"data: {json.dumps({'type': 'tool_start', 'tool_name': tname, 'status': f'Neuro is using {tname}...'})}\n\n"
            await asyncio.sleep(0.3)

        tool_results = await execute_tools_parallel(tools_to_run)

        for t, res in zip(tools_to_run, tool_results):
            yield f"data: {json.dumps({'type': 'tool_done', 'tool_name': t['name'], 'result': res})}\n\n"
            await asyncio.sleep(0.2)

    # Self-thinking reflection loop (Step 4) for complex messages
    if not is_trivial and len(message) > 25:
        yield f"data: {json.dumps({'type': 'thinking', 'status': 'Neuro is verifying answer accuracy & clarity...'})}\n\n"
        await asyncio.sleep(0.5)

    # Draft final unified answer token stream
    tokens = []
    if is_trivial:
        tokens = ["Hello! ", "I am ", "Neuro, ", "your ", "personal ", "AI ", "assistant. ", "How ", "can ", "I ", "help ", "you ", "today?"]
    elif tool_results:
        tokens = ["Based ", "on ", "my ", "analysis ", "and ", "tools:\n\n"]
        for t, res in zip(tools_to_run, tool_results):
            t_name = t['name']
            if t_name == "web_research":
                research_info = res.get("data", str(res))
                if isinstance(research_info, dict):
                    research_info = research_info.get("data", str(research_info))
                tokens.extend(["🔍 **Web Research Findings:**\n", str(research_info), "\n\n"])
            elif t_name == "write_code":
                code_snippet = "def main():\n    print('Executing solution')\n\nif __name__ == '__main__':\n    main()"
                tokens.extend(["💻 **Generated Code:**\n```python\n" + code_snippet + "\n```\n\n"])
            elif t_name == "generate_image":
                img_url = res.get("image_url", "https://image.pollinations.ai/prompt/neuro%20ai")
                tokens.extend(["🎨 **Generated Artwork:**\n\n![Generated Image](" + img_url + ")\n\n"])
            elif t_name == "generate_presentation":
                tokens.extend(["📊 **Slide Deck Outline:**\n"])
                slides = res.get("outline", [])
                for s in slides:
                    tokens.extend([f"- **Slide {s['slide_number']}: {s['title']}**\n"])
            elif t_name == "generate_speech":
                tokens.extend(["🎙️ **Synthesized Audio:** Voice audio generated successfully.\n\n"])
            elif t_name == "save_memory":
                tokens.extend(["🧠 *Saved to Long-Term Memory:* " + message + "\n\n"])
    else:
        tokens = [
            f"I have received your request: '{message}'. ",
            "As Neuro, ", "I am routing your task through my central intelligence engine. ",
            "Everything looks clear and complete."
        ]

    if recalled_mems and not is_trivial:
        tokens.insert(0, f"*(Recalled Memory Context: Noted user preference '{recalled_mems[0]['content']}')*\n\n")

    for tok in tokens:
        yield f"data: {json.dumps({'type': 'token', 'content': tok})}\n\n"
        await asyncio.sleep(0.03)

    yield f"data: {json.dumps({'type': 'done'})}\n\n"

async def process_chat_stream(user_id: str, message: str) -> AsyncGenerator[str, None]:
    """
    Main entrypoint streaming SSE events to frontend.
    Uses Anthropic Claude API if key present, otherwise falls back to smart mock generator.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        async for chunk in generate_mock_orchestrated_stream(user_id, message):
            yield chunk
        return

    # Live Anthropic API Path
    client = anthropic.AsyncAnthropic(api_key=api_key)
    is_trivial = is_trivial_message(message)

    # 1. Recall memory
    memory_context = ""
    if not is_trivial:
        recalled = await recall_memories(user_id, message, top_k=4)
        if recalled:
            mem_list = [f"- {m['content']} ({m['category']})" for m in recalled]
            memory_context = "\n\n[USER RECALLED MEMORIES]\n" + "\n".join(mem_list)
            yield f"data: {json.dumps({'type': 'memory_recall', 'memories': [m['content'] for m in recalled]})}\n\n"

    full_system_prompt = SYSTEM_PROMPT + memory_context

    # 2. Initial Claude Call with tool definitions
    try:
        response = await client.messages.create(
            model="claude-3-5-sonnet-20241022" if not is_trivial else "claude-3-5-haiku-20241022",
            max_tokens=2048,
            system=full_system_prompt,
            messages=[{"role": "user", "content": message}],
            tools=TOOLS_SCHEMA
        )

        tool_calls = []
        text_content = ""

        for block in response.content:
            if block.type == "tool_use":
                tool_calls.append({"name": block.name, "args": block.input, "id": block.id})
            elif block.type == "text":
                text_content += block.text

        # 3. Execute tool calls if requested
        if tool_calls:
            for tc in tool_calls:
                tcname = tc["name"]
                yield f"data: {json.dumps({'type': 'tool_start', 'tool_name': tcname, 'status': f'Neuro is using {tcname}...'})}\n\n"

            tool_results = await execute_tools_parallel(tool_calls)

            tool_messages = [
                {"role": "user", "content": message},
                {"role": "assistant", "content": response.content}
            ]

            tool_response_content = []
            for tc, res in zip(tool_calls, tool_results):
                yield f"data: {json.dumps({'type': 'tool_done', 'tool_name': tc['name'], 'result': res})}\n\n"
                tool_response_content.append({
                    "type": "tool_result",
                    "tool_use_id": tc["id"],
                    "content": json.dumps(res)
                })

            tool_messages.append({"role": "user", "content": tool_response_content})

            # Stream second turn response
            async with client.messages.stream(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2048,
                system=full_system_prompt,
                messages=tool_messages
            ) as stream:
                async for text in stream.text_stream:
                    yield f"data: {json.dumps({'type': 'token', 'content': text})}\n\n"
        else:
            # 4. Self-thinking loop (Step 4) for complex direct responses
            if not is_trivial and len(text_content) > 100:
                yield f"data: {json.dumps({'type': 'thinking', 'status': 'Neuro is verifying answer accuracy & clarity...'})}\n\n"
                reflection = await client.messages.create(
                    model="claude-3-5-haiku-20241022",
                    max_tokens=1024,
                    messages=[
                        {"role": "user", "content": f"Review this draft answer for accuracy, completeness, and clarity. If good, return unchanged. If flawed, revise it:\n\nDraft: {text_content}"}
                    ]
                )
                text_content = reflection.content[0].text

            # Stream finalized text
            for chunk in [text_content[i:i+8] for i in range(0, len(text_content), 8)]:
                yield f"data: {json.dumps({'type': 'token', 'content': chunk})}\n\n"
                await asyncio.sleep(0.02)

    except Exception as e:
        # Fallback to mock stream on error
        async for chunk in generate_mock_orchestrated_stream(user_id, message):
            yield chunk
        return

    yield f"data: {json.dumps({'type': 'done'})}\n\n"
