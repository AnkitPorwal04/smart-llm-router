import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { MetricsSummary, HistoryEntry } from "../types";

interface Props {
  metrics: MetricsSummary | null;
  history: HistoryEntry[];
  onHistoryClick: (query: string) => void;
}

const COLORS: Record<string, string> = {
  system1: "#10b981",
  system2: "#8b5cf6",
  "gpt-4o-mini": "#10b981",
  "gpt-4o": "#8b5cf6",
  "gemini-2.5-flash-lite": "#10b981",
  "gemini-2.5-flash": "#8b5cf6",
  "gemini-2.0-flash": "#10b981",
  "gemini-2.5-pro": "#6366f1",
};

const PALETTE = ["#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#06b6d4", "#6366f1"];

function fallbackColor(key: string, index?: number): string {
  return COLORS[key] || PALETTE[(index ?? 0) % PALETTE.length];
}

function fmt(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : n.toString();
}

function fmtCost(n: number) {
  return n < 0.01 ? `$${n.toFixed(6)}` : `$${n.toFixed(4)}`;
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-700/40 rounded ${className}`} />;
}

function MiniChart({
  title,
  data,
  labelMap,
}: {
  title: string;
  data: Record<string, number>;
  labelMap?: Record<string, string>;
}) {
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return (
      <div className="bg-[#1e293b] rounded-xl p-4 border border-gray-700/30">
        <h3 className="text-xs font-medium text-gray-400 mb-3">{title}</h3>
        <div className="flex items-center justify-center h-[180px] text-xs text-gray-600">
          No data yet
        </div>
      </div>
    );
  }

  const chartData = entries.map(([name, value], i) => ({
    name: labelMap?.[name] || name,
    value,
    color: fallbackColor(name, i),
  }));

  return (
    <div className="bg-[#1e293b] rounded-xl p-4 border border-gray-700/30">
      <h3 className="text-xs font-medium text-gray-400 mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={65}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #374151",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#e5e7eb",
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconSize={8}
            iconType="circle"
            formatter={(value: string) => (
              <span className="text-[11px] text-gray-400">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function MetricsDashboard({ metrics, history, onHistoryClick }: Props) {
  const isLoading = metrics === null;

  const m = metrics || {
    total_requests: 0,
    avg_latency_ms: 0,
    total_estimated_cost_usd: 0,
    total_tokens_used: 0,
    requests_by_complexity: {},
    requests_by_model: {},
  };

  return (
    <div className="w-80 xl:w-96 flex-shrink-0 overflow-y-auto p-4 space-y-4 hidden lg:block">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
        Metrics Dashboard
      </h2>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {isLoading ? (
          <>
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </>
        ) : (
          <>
            <StatCard label="Total Requests" value={fmt(m.total_requests)} />
            <StatCard label="Avg Latency" value={`${m.avg_latency_ms.toFixed(0)}`} unit="ms" />
            <StatCard label="Total Cost" value={fmtCost(m.total_estimated_cost_usd)} />
            <StatCard label="Total Tokens" value={fmt(m.total_tokens_used)} />
          </>
        )}
      </div>

      {/* Charts */}
      <MiniChart
        title="Requests by Complexity"
        data={m.requests_by_complexity}
        labelMap={{ system1: "System 1 (Fast)", system2: "System 2 (Deep)" }}
      />
      <MiniChart title="Requests by Model" data={m.requests_by_model} />

      {/* Recent history */}
      <div className="bg-[#1e293b] rounded-xl p-4 border border-gray-700/30">
        <h3 className="text-xs font-medium text-gray-400 mb-3">Recent Queries</h3>
        {history.length === 0 ? (
          <p className="text-xs text-gray-600">No queries yet</p>
        ) : (
          <div className="space-y-1">
            {history.slice(0, 10).map((h, i) => {
              const isS1 = h.response.complexity === "system1";
              return (
                <button
                  key={i}
                  onClick={() => onHistoryClick(h.query)}
                  className="w-full flex items-center gap-2 py-1.5 border-b border-gray-700/20 last:border-0 hover:bg-gray-800/30 -mx-1 px-1 rounded text-left transition-colors"
                >
                  <span
                    className={`text-[10px] font-mono font-bold w-5 flex-shrink-0 ${isS1 ? "text-emerald-400" : "text-violet-400"}`}
                  >
                    {isS1 ? "S1" : "S2"}
                  </span>
                  <span className="text-xs text-gray-400 truncate flex-1">
                    {h.query.length > 40 ? h.query.slice(0, 40) + "..." : h.query}
                  </span>
                  <span className="text-[10px] text-gray-600 flex-shrink-0">
                    {h.response.latency_ms.toFixed(0)}ms
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="bg-[#1e293b] rounded-xl p-3 border border-gray-700/30">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-white">
        {value}
        {unit && <span className="text-xs text-gray-500 font-normal">{unit}</span>}
      </p>
    </div>
  );
}

function SkeletonStatCard() {
  return (
    <div className="bg-[#1e293b] rounded-xl p-3 border border-gray-700/30">
      <Skeleton className="h-3 w-16 mb-2" />
      <Skeleton className="h-6 w-12" />
    </div>
  );
}
