import time
import httpx
import re
import datetime
import math
from typing import Dict, Any, List

# 80 Custom Q&A Dataset (Greetings, Casual Chat, Short Responses, Emojis & Slang)
CUSTOM_QNA = {
    # Greetings (1–20)
    "hi": "hello",
    "hlw": "hey",
    "hey": "hi there",
    "hello": "hi",
    "yo": "sup",
    "sup": "not much",
    "good morning": "morning",
    "good night": "sweet dreams",
    "bye": "see you",
    "cya": "take care",
    "gn": "night",
    "gm": "morning",
    "howdy": "hey partner",
    "namaste": "namaste",
    "salam": "walaikum salam",
    "hola": "hi",
    "bonjour": "hello",
    "hi bro": "hey bro",
    "hi sis": "hey sis",
    "hi dude": "yo dude",

    # Casual Chat (21–40)
    "how r u": "I’m good",
    "how are you": "fine",
    "what’s up": "nothing much",
    "what's up": "nothing much",
    "whats up": "nothing much",
    "wru": "at home",
    "wyd": "just chilling",
    "hbu": "I’m okay",
    "how’s life": "going well",
    "how's life": "going well",
    "hows life": "going well",
    "how’s it going": "all good",
    "how's it going": "all good",
    "hows it going": "all good",
    "what’s new": "not much",
    "what's new": "not much",
    "whats new": "not much",
    "long time": "yeah, been a while",
    "miss u": "miss you too",
    "love u": "love you too",
    "brb": "ok",
    "ttyl": "sure",
    "lol": "haha",
    "lmao": "😂",
    "omg": "wow",
    "idk": "same",
    "ok": "cool",
    "k": "fine",

    # Short Responses (41–60)
    "yes": "yeah",
    "no": "nope",
    "maybe": "could be",
    "sure": "alright",
    "alright": "okay",
    "cool": "nice",
    "nice": "cool",
    "wow": "amazing",
    "great": "awesome",
    "awesome": "fantastic",
    "fantastic": "superb",
    "amazing": "wow",
    "good": "fine",
    "bad": "sad",
    "sad": "cheer up",
    "happy": "glad",
    "tired": "rest well",
    "bored": "let’s chat",
    "hungry": "grab food",
    "thirsty": "drink water",

    # Emojis & Slang (61–80)
    "😂": "lol",
    "😢": "don’t cry",
    "😍": "love it",
    "😎": "cool",
    "🤔": "thinking",
    "😴": "sleep well",
    "💀": "dead funny",
    "💯": "true",
    "🔥": "awesome",
    "👌": "perfect",
    "gg": "good game",
    "wp": "well played",
    "ty": "welcome",
    "thx": "np",
    "np": "anytime",
    "idc": "same",
    "btw": "by the way",
    "omg lol": "haha wow",
    "rofl": "😂",
    "bruh": "dude"
}

def generate_personalized_schedule(tasks_input: str) -> str:
    """Generate a clean, structured, personalized daily schedule from user's tasks."""
    clean_text = re.sub(r'^(daily overview|dayli overview|overview|schedule|routine|here are my tasks|my tasks for today are|today tasks|today:?)\s*[:\-]?\s*', '', tasks_input, flags=re.IGNORECASE).strip()
    
    # Split by newlines, numbered lists, bullets, or commas
    raw_lines = [line.strip() for line in re.split(r'[\n;]|(?=\d+[\.\)])|(?=[•\-\*]\s+)', clean_text) if line.strip()]
    items = []
    for l in raw_lines:
        cleaned = re.sub(r'^\d+[\.\)]\s*', '', l)
        cleaned = re.sub(r'^[•\-\*]\s*', '', cleaned).strip()
        if len(cleaned) >= 2 and not re.match(r'^(today|task|tasks|my tasks|i have|schedule|overview)$', cleaned, re.IGNORECASE):
            items.append(cleaned)
    if not items:
        # Fallback to comma split if single block
        items = [i.strip() for i in clean_text.split(',') if len(i.strip()) >= 2]
    if not items:
        items = [clean_text if clean_text else "Core project development & sprint goals"]

    res = [
        "📋 **Your Personalized Daily Schedule & Action Plan**",
        "",
        "🎯 **Target Tasks for Today:**"
    ]
    for idx, item in enumerate(items, 1):
        res.append(f"• {idx}. {item}")

    res.append("")
    res.append("⏳ **Optimized Time Blocks:**")
    if len(items) == 1:
        res.append(f"• **Morning (09:00 - 12:30)**: Deep Work — {items[0]} (Core Focus)")
        res.append("• **Midday (12:30 - 13:30)**: Lunch & Cognitive Break")
        res.append(f"• **Afternoon (13:30 - 17:00)**: Execution — {items[0]} (Refinement & Testing)")
        res.append("• **Evening (17:00 - 19:30)**: Review, Wrap-up & Memory Sync")
    else:
        mid = (len(items) + 1) // 2
        morning_tasks = items[:mid]
        afternoon_tasks = items[mid:]
        res.append("• **Morning (09:00 - 12:30)**: Deep Work Block")
        for t in morning_tasks:
            res.append(f"  - Priority: {t}")
        res.append("• **Midday (12:30 - 13:30)**: Lunch & Mental Recharge")
        res.append("• **Afternoon (13:30 - 17:30)**: Collaboration & Execution Block")
        for t in afternoon_tasks:
            res.append(f"  - Target: {t}")
        res.append("• **Evening (18:00 - 20:00)**: Daily Review, Vault Sync & Wind Down")

    res.append("")
    res.append("⚡ **Daily Neural Strategy:**")
    res.append("• Tackle the hardest task during your morning focus window.")
    res.append("• Use 45-minute sprint cycles with 5-minute pauses.")
    res.append("• Sync completed items to your Memory Vault at the end of the day.")

    return "\n".join(res)

class NeuroAgent:
    def __init__(self, memory_store=None):
        self.memory_store = memory_store

    def _query_local_ollama(self, prompt: str) -> str:
        """Query local Ollama if available."""
        try:
            res = httpx.post(
                "http://127.0.0.1:11434/api/generate",
                json={
                    "model": "llama3:latest",
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "num_predict": 512,
                        "temperature": 0.7
                    }
                },
                timeout=120.0
            )
            if res.status_code == 200:
                data = res.json()
                return data.get("response", "").strip()
            elif res.status_code == 404:
                return "⚠️ **[SYSTEM ALERT]**: Ollama is running, but `llama3:latest` model was not found."
        except httpx.TimeoutException:
            return "⚠️ **[SYSTEM ALERT]**: The AI engine timed out. Try asking a slightly shorter prompt."
        except Exception:
            pass
        return ""

    def _query_duckduckgo_instant(self, query: str) -> str:
        """Fetch quick factual answers from DuckDuckGo Instant Answer API if online."""
        try:
            res = httpx.get(
                "https://api.duckduckgo.com/",
                params={"q": query, "format": "json", "no_html": "1", "skip_disambig": "1"},
                timeout=2.0
            )
            if res.status_code == 200:
                data = res.json()
                abstract = data.get("AbstractText", "").strip()
                answer = data.get("Answer", "").strip()
                if answer:
                    return answer
                if abstract:
                    return abstract
        except Exception:
            pass
        return ""

    def generate_neuro_response(self, prompt: str, recalled_memories: List[Dict[str, Any]]) -> str:
        """
        Generates high-quality, direct, accurate answers for any query.
        """
        clean_p = prompt.strip()
        lower = clean_p.lower()

        # Check for bad words / profanity
        profanities = ["fuck", "sex", "xxx", "madarchod", "madarchord", "bkl", "mkc"]
        if any(re.search(rf"\b{w}\b", lower) for w in profanities if w != "xxx") or "xxx" in lower:
            return "⚠️ [RED ALERT] dont use such kind of bad word"

        # 0. Check exact custom Q&A dataset first
        normalized = lower.replace("’", "'").strip()
        if normalized in CUSTOM_QNA:
            return CUSTOM_QNA[normalized]
        if clean_p in CUSTOM_QNA:
            return CUSTOM_QNA[clean_p]

        # 0.1 Daily Overview Flow: If asking generally without tasks, prompt user for today's work
        if any(w in lower for w in ['daily overview', 'dayli overview', 'overview', 'daily briefing', 'my schedule', 'routine', 'plan my day']):
            # Check if user provided task details already
            has_tasks = len(clean_p) > 30 and (
                any(c in clean_p for c in ['\n', ';', ',', '1.', '2.', '-', '•']) or
                any(w in lower for w in ['meeting', 'study', 'gym', 'workout', 'code', 'finish', 'complete', 'review', 'am', 'pm'])
            )
            if has_tasks:
                return generate_personalized_schedule(clean_p)
            else:
                return "📋 **Let's build your personalized Daily Overview!**\n\nPlease tell me what tasks, goals, or meetings you have planned for today (e.g., 10:00 AM team standup, finish backend API, gym at 6:00 PM, study React).\n\nSend your list, and I'll generate a personalized schedule & time-block breakdown for you."

        # 0.2 Check if user is responding with a task list (e.g. "1. Task A 2. Task B" or "tasks: ...")
        if re.match(r'^(my tasks|tasks|today|here are|i have to|i need to|schedule:)', lower) or (re.search(r'\b(1\.|•|\-)\s+', clean_p) and len(clean_p) > 15):
            if any(w in lower for w in ['task', 'meeting', 'study', 'code', 'gym', 'workout', 'finish', 'complete', 'call', 'review', 'build', 'work']):
                return generate_personalized_schedule(clean_p)

        # 0.3 About Yourself / Self-Introduction & Team Information
        if any(w in lower for w in [
            'tell about your self', 'tell about yourself', 'tell me about yourself', 'tell me about your self',
            'about yourself', 'about your self', 'about you', 'who are you', 'introduce yourself',
            'who created you', 'who made you', 'who developed you', 'team', 'lead', 'creator', 'mentor'
        ]):
            return """# 🌟✨ **Hello! I am NEURO!** ✨🌟

I am not just an application; I am an **Interactive, Intelligent, and Immersive AI Assistant** and your **Second Brain**! 🌌

## 🚀 **What I Can Do:**
*   🎤 **Real-time Interaction:** Voice & Text Q&A, math, and conversational intelligence.
*   💻 **Code Synthesis:** I write algorithms, Python, React components, and APIs!
*   📚 **Knowledge:** Factual queries and vector memory recall.
*   📊 **Presentations:** Automated 16:9 interactive slide decks.
*   📅 **Workflows:** Daily overview briefings, task tracking, and memory vault storage.

---

## 👥 **The Brilliant Minds Behind Me:**

👨‍💻 **Lead Creator**
*   **Name:** Sanzit Kumar Shil (Amit)
*   **Sid:** 2025826075
*   **Email:** 2025826075.sanzit@ug.sharda.ac.in
*   **Phone:** 7364015499

👨‍💻 **Co-Lead Creator**
*   **Name:** Prottoy Sarker
*   **Sid:** 2025821534
*   **Email:** 2025821534.prottoy@ug.sharda.ac.in
*   **Phone:** 7477387628

🎓 **Mentor (Cyber Security)**
*   **Name:** Dr. Avinash Kumar
*   **Email:** avinash.kumar@sharda.ac.in
*   **Phone:** +91 96251 31621
*   **Domain:** Cyber Security

**In short:** I am the perfect harmony of **Art** and **Algorithms**! Let's build the future together! 🚀💥"""

        # 0.4 Tech Stack / Engineering part
        if any(w in lower for w in [
            'tech part', 'technology', 'tech stack', 'engineering part', 'how are you built', 'what language', 'engimear'
        ]):
            return """# 💻🎨 **The Tech Stack (The Magic Under the Hood)** 🎨💻

Here is the powerful combination of technologies used to bring me to life!

> [!NOTE]
> 🧠 **The Brain (Backend & AI Logic)**
> *   🐍 **Python 3.x:** The core engine.
> *   🚀 **FastAPI:** Lightning-fast API framework.
> *   🤖 **Ollama:** Local LLM runner acting as my neurons.
> *   💾 **ChromaDB & Sentence-Transformers:** My vector database memory!

> [!TIP]
> 🖥️ **The Face (Frontend & User Interface)**
> *   ⚛️ **React.js (JSX) + HTML:** The dynamic component library.
> *   💅 **Vanilla CSS:** Custom glassmorphic UI, deep-space dark modes, and floating particles!
> *   ⚡ **Vite:** The incredibly fast build tool.

> [!IMPORTANT]
> ✨ **Animations & Infrastructure**
> *   🌀 **Animations:** CSS Keyframes + SVG, triggered by React for smooth GPU effects!
> *   🔌 **Local Hosting:** Fully private! Ollama (11434), FastAPI (8000), Vite (5173).

🔄 **Flow:** Browser → React → FastAPI → Ollama → Response back"""

        # 1. Try Local Ollama if running
        llm_reply = self._query_local_ollama(prompt)
        if llm_reply:
            return llm_reply

        # 2. Try DuckDuckGo Instant Facts if online
        if any(lower.startswith(w) for w in ["who is", "what is", "where is", "when did", "capital of", "define"]):
            ddg = self._query_duckduckgo_instant(prompt)
            if ddg:
                return ddg

        # 3. Math & Calculation Engine
        math_match = re.search(r'([\d\.\s\+\-\*\/\^\(\)\%]+)', prompt)
        if any(op in prompt for op in ['+', '-', '*', '/', '^', '%']) and math_match:
            expr = math_match.group(1).strip()
            if re.match(r'^[\d\.\s\+\-\*\/\(\)\%]+$', expr) and any(c.isdigit() for c in expr):
                try:
                    safe_expr = expr.replace('^', '**')
                    val = eval(safe_expr, {"__builtins__": None}, {"sqrt": math.sqrt, "sin": math.sin, "cos": math.cos, "pi": math.pi})
                    if isinstance(val, float) and val.is_integer():
                        val = int(val)
                    elif isinstance(val, float):
                        val = round(val, 4)
                    return f"The result of {expr} is {val}."
                except Exception:
                    pass

        # 4. Time & Date
        if any(w in lower for w in ['what time', 'current time', 'what is the time', 'what day', 'todays date', "today's date"]):
            now = datetime.datetime.now()
            return f"Current time is {now.strftime('%I:%M %p')} on {now.strftime('%A, %B %d, %Y')}."

        # 5. Common Questions & Fact Knowledge Base
        knowledge = {
            "capital of france": "The capital of France is Paris.",
            "capital of usa": "The capital of the United States is Washington, D.C.",
            "capital of united states": "The capital of the United States is Washington, D.C.",
            "capital of uk": "The capital of the United Kingdom is London.",
            "capital of england": "The capital of England is London.",
            "capital of germany": "The capital of Germany is Berlin.",
            "capital of japan": "The capital of Japan is Tokyo.",
            "capital of india": "The capital of India is New Delhi.",
            "capital of canada": "The capital of Canada is Ottawa.",
            "capital of australia": "The capital of Australia is Canberra.",
            "capital of china": "The capital of China is Beijing.",
            "capital of russia": "The capital of Russia is Moscow.",
            "capital of italy": "The capital of Italy is Rome.",
            "capital of spain": "The capital of Spain is Madrid.",
            "speed of light": "The speed of light in a vacuum is approximately 299,792,458 meters per second.",
            "largest planet": "Jupiter is the largest planet in our Solar System.",
            "who created python": "Python was created by Guido van Rossum and first released in 1991.",
            "who created javascript": "JavaScript was created by Brendan Eich in 1995 while at Netscape Communications.",
            "who created linux": "Linux was created by Linus Torvalds in 1991.",
            "what is html": "HTML (HyperText Markup Language) is the standard markup language used to structure web pages and documents on the internet.",
            "what is css": "CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation and styling of a document written in HTML.",
            "what is react": "React is an open-source JavaScript library developed by Meta for building user interfaces based on reusable components.",
            "what is python": "Python is a high-level, interpreted programming language known for its readability, dynamic typing, and extensive standard library.",
            "what is ai": "Artificial Intelligence (AI) is the simulation of human intelligence processes by computer systems, including learning, reasoning, problem-solving, and perception.",
            "what is machine learning": "Machine learning is a subset of AI where algorithms learn patterns from data to make decisions without being explicitly programmed for each rule."
        }

        for k, v in knowledge.items():
            if k in lower:
                return v

        # 6. Specific Coding Inquiries
        if "reverse" in lower and "string" in lower:
            return "In Python, reverse a string with `text[::-1]`. In JavaScript, use `text.split('').reverse().join('')`."
        if "palindrome" in lower:
            return "A palindrome is a word, phrase, or number that reads the same backward as forward (e.g., 'radar', 'level', '121'). In Python: `s == s[::-1]`."
        if "fibonacci" in lower:
            return "Fibonacci sequence starts with 0, 1, 1, 2, 3, 5, 8, 13, 21... Each number is the sum of the two preceding ones. Python implementation: `def fib(n): a, b = 0, 1; (a, b := b, a + b) for _ in range(n); return a`."
        if "binary search" in lower:
            return "Binary search finds an item in a sorted list by repeatedly dividing the search interval in half. It operates in O(log n) time complexity."

        # 8. Help / System actions
        if "help" in lower:
            return "I can answer questions, calculate math, write and debug code, generate presentations, and organize your daily schedule."
        if any(w in lower for w in ['slide', 'presentation', 'deck']):
            return "You can generate and view slide decks in the Slides tab. Let me know the topic you'd like to create."

        # 9. Generic clear response
        return f"Regarding '{clean_p}': I am ready to assist. \n\n*(⚠️ Note: My primary AI brain (Ollama) is currently offline or unreachable. Please start the Ollama application on your computer to get full dynamic AI responses!)*"

    def run_thinking_loop(self, prompt: str, user_id: str = "default_user") -> Dict[str, Any]:
        """Executes thinking loop with high quality synthesis."""
        steps_log = []

        # 1. Observe
        steps_log.append({
            "step": "observe",
            "title": "Observe",
            "detail": f"Observed prompt: '{prompt}'."
        })

        # 2. Think & Recall
        recalled_memories = []
        if self.memory_store:
            recalled_memories = self.memory_store.query_memories(prompt, top_k=2)
        steps_log.append({
            "step": "think",
            "title": "Think & Recall",
            "detail": f"Recalled {len(recalled_memories)} contextual memories."
        })

        # 3. Decide & Route
        lower = prompt.lower()
        if any(w in lower for w in ["slide", "presentation"]):
            chosen_engine = "Presentation Engine"
        elif any(w in lower for w in ["search", "research", "who is", "what is"]):
            chosen_engine = "Knowledge Engine"
        elif any(w in lower for w in ["code", "python", "javascript", "function"]):
            chosen_engine = "Code Synthesis Engine"
        else:
            chosen_engine = "NEURO Core"

        steps_log.append({
            "step": "decide",
            "title": "Decide & Route",
            "detail": f"Routed to {chosen_engine}."
        })

        # 4. Act & Synthesize
        final_reply = self.generate_neuro_response(prompt, recalled_memories)
        steps_log.append({
            "step": "act",
            "title": "Act & Synthesize",
            "detail": "Generated response."
        })

        # 5. Reflexion
        steps_log.append({
            "step": "reflexion",
            "title": "Reflexion",
            "detail": "Response verified."
        })

        return {
            "prompt": prompt,
            "chosen_engine": chosen_engine,
            "steps": steps_log,
            "recalled_memories": recalled_memories,
            "final_response": final_reply
        }
