import { useState, useCallback, useRef, useEffect } from "react";
import Header from "./Header";
import QueryForm from "./QueryForm";
import WelcomeState from "./WelcomeState";
import ResponseCard from "./ResponseCard";
import MetricsDashboard from "./MetricsDashboard";
import { useToast } from "./Toast";
import { routeQuery, fetchMetrics } from "../api";
import { Trash2, RotateCcw } from "lucide-react";
import type { RouteResponse, MetricsSummary, HistoryEntry } from "../types";

interface ResponseEntry {
  query: string;
  data: RouteResponse;
  timestamp: string;
}

const STORAGE_KEY_RESPONSES = "slr_responses";
const STORAGE_KEY_HISTORY = "slr_history";

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export default function RouterPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<ResponseEntry[]>(() =>
    loadFromStorage(STORAGE_KEY_RESPONSES, []),
  );
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    loadFromStorage(STORAGE_KEY_HISTORY, []),
  );
  const responseEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { showToast } = useToast();

  useEffect(() => { saveToStorage(STORAGE_KEY_RESPONSES, responses); }, [responses]);
  useEffect(() => { saveToStorage(STORAGE_KEY_HISTORY, history); }, [history]);

  useEffect(() => {
    fetchMetrics().then(setMetrics).catch(() => {});
  }, []);

  useEffect(() => {
    if (responses.length > 0) {
      responseEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [responses]);

  const handleSubmit = useCallback(
    async (q: string, systemPrompt?: string, forceModel?: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const data = await routeQuery(
          {
            query: q,
            system_prompt: systemPrompt || null,
            force_model: forceModel || null,
          },
          controller.signal,
        );

        setResponses((prev) => [...prev, { query: q, data, timestamp: new Date().toISOString() }]);
        setHistory((prev) => [{ query: q, response: data }, ...prev].slice(0, 20));
        setQuery("");

        fetchMetrics().then(setMetrics).catch(() => {});
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        showToast(err instanceof Error ? err.message : "Request failed", "error");
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [showToast],
  );

  function handleClearHistory() {
    setResponses([]);
    setHistory([]);
  }

  function handleReset() {
    setResponses([]);
    setHistory([]);
    setQuery("");
    setMetrics(null);
    fetchMetrics().then(setMetrics).catch(() => {});
  }

  function handleRestoreSession() {
    const saved = loadFromStorage<ResponseEntry[]>(STORAGE_KEY_RESPONSES, []);
    const savedHistory = loadFromStorage<HistoryEntry[]>(STORAGE_KEY_HISTORY, []);
    if (saved.length > 0) {
      setResponses(saved);
      setHistory(savedHistory);
      showToast(`Restored ${saved.length} response(s) from previous session`, "success");
    } else {
      showToast("No previous session found", "info");
    }
  }

  const fmtCost = (n: number) => (n < 0.01 ? `$${n.toFixed(6)}` : `$${n.toFixed(4)}`);
  const fmt = (n: number) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toString());

  const hasStoredSession = responses.length === 0 && (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_RESPONSES);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0;
    } catch { return false; }
  })();

  return (
    <div className="h-full flex flex-col">
      <Header onReset={handleReset} />

      <main className="flex-1 flex overflow-hidden">
        {/* Left: Query panel */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-gray-700/50">
          <QueryForm
            onSubmit={handleSubmit}
            loading={loading}
            queryValue={query}
            onQueryChange={setQuery}
          />

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {responses.length === 0 && !loading && (
              <>
                <WelcomeState onExample={setQuery} />
                {hasStoredSession && (
                  <div className="flex justify-center mt-2">
                    <button
                      onClick={handleRestoreSession}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw size={12} />
                      Restore previous session
                    </button>
                  </div>
                )}
              </>
            )}

            {responses.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 rounded-md transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
              </div>
            )}

            {responses.map((r, i) => (
              <ResponseCard key={i} query={r.query} data={r.data} timestamp={new Date(r.timestamp)} />
            ))}

            {loading && (
              <div className="bg-[#1e293b] rounded-xl p-4 border border-gray-700/30 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                  <span className="text-sm text-gray-400">Routing your query...</span>
                </div>
              </div>
            )}

            <div ref={responseEndRef} />
          </div>
        </div>

        {/* Right: Metrics dashboard */}
        <MetricsDashboard metrics={metrics} history={history} onHistoryClick={setQuery} />
      </main>

      {/* Mobile stats bar */}
      <div className="lg:hidden flex-shrink-0 border-t border-gray-700/50 bg-[#1e293b]/80 backdrop-blur px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Requests: <strong className="text-white">{metrics?.total_requests ?? 0}</strong></span>
          <span>Latency: <strong className="text-white">{(metrics?.avg_latency_ms ?? 0).toFixed(0)}ms</strong></span>
          <span>Cost: <strong className="text-white">{fmtCost(metrics?.total_estimated_cost_usd ?? 0)}</strong></span>
          <span>Tokens: <strong className="text-white">{fmt(metrics?.total_tokens_used ?? 0)}</strong></span>
        </div>
      </div>
    </div>
  );
}
