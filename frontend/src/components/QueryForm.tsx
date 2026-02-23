import { useState, useRef } from "react";
import type { FormEvent, KeyboardEvent } from "react";

interface Props {
  onSubmit: (query: string, systemPrompt?: string, forceModel?: string) => void;
  loading: boolean;
  queryValue: string;
  onQueryChange: (v: string) => void;
}

export default function QueryForm({ onSubmit, loading, queryValue, onQueryChange }: Props) {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [forceModel, setForceModel] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const q = queryValue.trim();
    if (!q || loading) return;
    onSubmit(q, systemPrompt.trim() || undefined, forceModel || undefined);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const q = queryValue.trim();
      if (q && !loading) {
        onSubmit(q, systemPrompt.trim() || undefined, forceModel || undefined);
      }
    }
  }

  return (
    <div className="flex-shrink-0 p-4 border-b border-gray-700/30">
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          ref={textareaRef}
          value={queryValue}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... Simple questions route to fast models, complex ones to powerful models."
          className="w-full px-4 py-3 bg-[#1e293b] rounded-xl border border-gray-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 resize-none text-sm min-h-[80px] max-h-[200px]"
          rows={2}
        />

        <details className="group">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 select-none list-none">
            <span className="group-open:hidden">&#9654;</span>
            <span className="hidden group-open:inline">&#9660;</span>
            {" "}Advanced Options
          </summary>
          <div className="mt-2 space-y-2">
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Custom system prompt (optional)"
              className="w-full px-3 py-2 bg-[#0f172a] rounded-lg border border-gray-700/50 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-gray-600 resize-none text-xs"
              rows={2}
            />
            <select
              value={forceModel}
              onChange={(e) => setForceModel(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f172a] rounded-lg border border-gray-700/50 text-gray-300 text-xs focus:outline-none focus:border-gray-600 cursor-pointer"
            >
              <option value="">Auto-route (recommended)</option>
              <option value="gemini-2.5-flash-lite">Force: gemini-2.5-flash-lite (System 1)</option>
              <option value="gemini-2.5-flash">Force: gemini-2.5-flash (System 2)</option>
            </select>
          </div>
        </details>

        <button
          type="submit"
          disabled={loading || !queryValue.trim()}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-violet-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span>Routing...</span>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </>
          ) : (
            "Send Query"
          )}
        </button>
      </form>
    </div>
  );
}
