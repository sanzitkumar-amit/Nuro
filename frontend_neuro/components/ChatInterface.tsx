"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, BrainCircuit } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ToolStatus {
  tool: string;
  status: "running" | "completed" | "error";
  details?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tools?: ToolStatus[];
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let assistantMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: assistantMessageId, role: "assistant", content: "", tools: [] }]);

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        
        // Keep the last part in the buffer as it might be incomplete
        buffer = lines.pop() || "";
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") continue;
            try {
              const data = JSON.parse(dataStr);
              
              setMessages(prev => prev.map(msg => {
                if (msg.id !== assistantMessageId) return msg;
                
                if (data.type === "token" || data.type === "content") {
                  return { ...msg, content: msg.content + data.content };
                } else if (data.type === "tool_start") {
                  const tools = [...(msg.tools || []), { tool: data.tool_name || data.tool, status: "running" as const }];
                  return { ...msg, tools };
                } else if (data.type === "tool_done" || data.type === "tool_result") {
                  const tools = (msg.tools || []).map(t => 
                    t.tool === (data.tool_name || data.tool) ? { ...t, status: "completed" as const, details: typeof data.result === 'string' ? data.result : JSON.stringify(data.result) } : t
                  );
                  return { ...msg, tools };
                }
                return msg;
              }));
            } catch (e) {
              console.error("Error parsing SSE JSON:", e, "Data string:", dataStr);
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <BrainCircuit className="w-16 h-16 text-[var(--color-neuro-neon)] opacity-50" />
            <p className="text-xl font-light">How can Neuro assist you today?</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col animate-slide-up ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === "user" 
                ? "bg-[var(--color-neuro-accent)] text-white" 
                : "glass text-gray-200"
            }`}>
              
              {/* Tool Status Badges */}
              {msg.role === "assistant" && msg.tools && msg.tools.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {msg.tools.map((tool, idx) => (
                    <div key={idx} className="flex items-center text-xs px-2 py-1 rounded-full bg-black/40 border border-[var(--color-neuro-border)] text-gray-400">
                      {tool.status === "running" ? (
                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin text-[var(--color-neuro-neon)]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                      )}
                      Neuro used {tool.tool}
                    </div>
                  ))}
                </div>
              )}

              {/* Message Content */}
              <div className="prose prose-invert prose-sm">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center text-gray-400 text-sm animate-pulse">
            <BrainCircuit className="w-4 h-4 mr-2 text-[var(--color-neuro-neon)] animate-pulse-neon" />
            Neuro is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[var(--color-neuro-border)] glass">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Neuro..."
            className="w-full bg-black/50 border border-[var(--color-neuro-border)] rounded-full py-3 px-5 text-gray-200 focus:outline-none focus:border-[var(--color-neuro-neon)] focus:ring-1 focus:ring-[var(--color-neuro-neon)] transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 rounded-full bg-[var(--color-neuro-accent)] text-white hover:bg-opacity-80 transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
