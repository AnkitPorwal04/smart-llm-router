export type ComplexityLevel = "system1" | "system2";

export interface RouteRequest {
  query: string;
  system_prompt?: string | null;
  force_model?: string | null;
}

export interface RouteResponse {
  answer: string;
  model_used: string;
  complexity: ComplexityLevel;
  classification_confidence: number;
  classifier_used: string;
  latency_ms: number;
  token_usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  estimated_cost_usd: number;
}

export interface MetricsSummary {
  total_requests: number;
  requests_by_complexity: Record<string, number>;
  requests_by_model: Record<string, number>;
  avg_latency_ms: number;
  total_tokens_used: number;
  total_estimated_cost_usd: number;
  avg_cost_per_request_usd: number;
  classifier_distribution: Record<string, number>;
}

export interface HealthResponse {
  status: string;
  version: string;
  classifier_mode: string;
  system1_model: string;
  system2_model: string;
}

export interface HistoryEntry {
  query: string;
  response: RouteResponse;
}
