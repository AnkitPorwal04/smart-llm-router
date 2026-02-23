import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import type { RouteResponse } from "../types";

interface Props {
  query: string;
  data: RouteResponse;
  timestamp?: Date;
}

export default function ResponseCard({ query, data, timestamp }: Props) {
  const [copied, setCopied] = useState(false);
  const isSystem1 = data.complexity === "system1";
  const label = isSystem1 ? "System 1" : "System 2";
  const confPercent = Math.round(data.classification_confidence * 100);
  const cost =
    data.estimated_cost_usd < 0.01
      ? `$${data.estimated_cost_usd.toFixed(6)}`
      : `$${data.estimated_cost_usd.toFixed(4)}`;

  const borderColor = isSystem1 ? "border-emerald-500/20" : "border-violet-500/20";
  const bgColor = isSystem1 ? "bg-emerald-500/5" : "bg-violet-500/5";
  const badgeClasses = isSystem1
    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
    : "bg-violet-500/15 text-violet-400 border-violet-500/30";
  const barColor = isSystem1
    ? "bg-gradient-to-r from-emerald-600 to-emerald-500"
    : "bg-gradient-to-r from-violet-600 to-violet-500";

  function handleCopy() {
    navigator.clipboard.writeText(data.answer).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const timeStr = timestamp
    ? timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className={`animate-slide-up rounded-xl border ${borderColor} ${bgColor} overflow-hidden`}>
      {/* Query */}
      <div className="px-4 py-2.5 border-b border-gray-700/20 bg-gray-800/30 flex items-center justify-between">
        <p className="text-xs text-gray-400 truncate">
          <span className="text-gray-600">You:</span> {query}
        </p>
        {timeStr && <span className="text-[10px] text-gray-600 flex-shrink-0 ml-2">{timeStr}</span>}
      </div>

      {/* Metadata bar */}
      <div className="px-4 py-2 flex items-center gap-2 flex-wrap border-b border-gray-700/20">
        <span className={`px-2 py-0.5 text-[11px] font-medium rounded-md border ${badgeClasses}`}>
          {label}
        </span>
        <span className="text-[11px] text-gray-400">{data.model_used}</span>
        <div className="flex-1" />
        <span className="text-[11px] text-gray-500">{data.classifier_used}</span>
      </div>

      {/* Confidence bar */}
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gray-500">Confidence</span>
          <span className="text-[10px] text-gray-400">{confPercent}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-700/50 overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor} transition-all duration-500`}
            style={{ width: `${confPercent}%` }}
          />
        </div>
      </div>

      {/* Answer with markdown */}
      <div className="px-4 py-3 relative group">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Copy response"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        </button>
        <div className="prose-response text-sm text-gray-200 leading-relaxed">
          <Markdown remarkPlugins={[remarkGfm]}>{data.answer}</Markdown>
        </div>
      </div>

      {/* Footer stats */}
      <div className="px-4 py-2 bg-gray-800/20 flex items-center gap-4 text-[11px] text-gray-500 border-t border-gray-700/20">
        <span title="Latency">{data.latency_ms.toFixed(0)}ms</span>
        <span title="Total tokens">{data.token_usage.total_tokens} tok</span>
        <span title="Prompt / Completion">
          {data.token_usage.prompt_tokens}p/{data.token_usage.completion_tokens}c
        </span>
        <span title="Estimated cost">{cost}</span>
      </div>
    </div>
  );
}
