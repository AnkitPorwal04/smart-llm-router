import { useEffect, useState, useRef } from "react";
import { Bot } from "lucide-react";
import { fetchHealth } from "../api";
import type { HealthResponse } from "../types";

interface Props {
  onReset?: () => void;
}

export default function Header({ onReset }: Props) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    function poll() {
      fetchHealth()
        .then((h) => { setHealth(h); setError(false); })
        .catch(() => setError(true));
    }
    poll();
    intervalRef.current = setInterval(poll, 30_000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <header className="flex-shrink-0 border-b border-gray-700/50 bg-[#1e293b]/50 backdrop-blur px-6 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          title="Reset session"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-semibold text-white">Smart LLM Router</h1>
            <p className="text-xs text-gray-400">System 1 / System 2 Thinking</p>
          </div>
        </button>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {error ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-400/10 border border-red-400/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-red-400">Offline</span>
            </span>
          ) : health ? (
            <>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-400/10 border border-green-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot" />
                <span className="text-green-400">Healthy</span>
              </span>
              <span className="hidden sm:inline">
                v{health.version} | {health.classifier_mode} | {health.system1_model} / {health.system2_model}
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-700/50">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              <span>Connecting...</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
