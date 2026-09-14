import ChatInterface from "@/components/ChatInterface";
import { BrainCircuit, Settings, History } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-neuro-bg)]">
      
      {/* Sidebar - Memory & Tasks */}
      <aside className="w-80 glass border-r border-[var(--color-neuro-border)] flex flex-col">
        <div className="p-6 border-b border-[var(--color-neuro-border)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-neuro-accent)] flex items-center justify-center shadow-lg shadow-[var(--color-neuro-accent)]/30">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white">NEURO</h1>
            <p className="text-xs text-[var(--color-neuro-neon)] tracking-widest uppercase">One Brain, Many Hands</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3 flex items-center gap-2">
              <History className="w-3 h-3" />
              Active Context
            </h3>
            <div className="glass-neon rounded-xl p-4 text-sm text-gray-300">
              Neuro is ready. Memory loaded.
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-[var(--color-neuro-border)]">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm w-full p-2 rounded-lg hover:bg-white/5">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-neuro-accent)]/5 to-transparent pointer-events-none z-0" />
        <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
          <ChatInterface />
        </div>
      </main>
      
    </div>
  );
}
