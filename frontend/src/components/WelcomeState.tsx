import { MessageCircle, Zap, Brain } from "lucide-react";

interface Props {
  onExample: (query: string) => void;
}

const SYSTEM1_EXAMPLES = [
  { label: "Hello!", query: "Hello!" },
  { label: "Translate to Spanish", query: "Translate 'Good morning' to Spanish" },
  { label: "What is Python?", query: "What is Python?" },
];

const SYSTEM2_EXAMPLES = [
  { label: "Write code...", query: "Write a Python function to implement binary search with detailed complexity analysis" },
  { label: "Explain recursion", query: "Explain recursion vs iteration with examples, trade-offs, and when to use each" },
  { label: "Debug this code", query: "Debug this: function sum(arr) { for(let i=0; i<=arr.length; i++) total+=arr[i]; return total; }" },
];

export default function WelcomeState({ onExample }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-gray-700/30 flex items-center justify-center mb-4">
        <MessageCircle className="w-8 h-8 text-gray-500" />
      </div>
      <h2 className="text-gray-300 font-medium mb-1">Smart LLM Router</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-md">
        Send a query to see the intelligent routing in action. Simple questions go to fast models, complex ones to powerful models.
      </p>

      <div className="w-full max-w-lg space-y-3">
        {/* System 1 examples */}
        <div>
          <div className="flex items-center gap-1.5 mb-2 justify-center">
            <Zap size={12} className="text-emerald-400" />
            <span className="text-[11px] text-emerald-400 font-medium uppercase tracking-wider">System 1 — Fast</span>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {SYSTEM1_EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => onExample(ex.query)}
                className="px-3 py-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* System 2 examples */}
        <div>
          <div className="flex items-center gap-1.5 mb-2 justify-center">
            <Brain size={12} className="text-violet-400" />
            <span className="text-[11px] text-violet-400 font-medium uppercase tracking-wider">System 2 — Deep</span>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {SYSTEM2_EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => onExample(ex.query)}
                className="px-3 py-1.5 text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-lg hover:bg-violet-500/20 transition"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
