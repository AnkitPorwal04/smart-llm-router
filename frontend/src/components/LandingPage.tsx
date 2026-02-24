import { useNavigate } from "react-router-dom";
import {
  Bot,
  Zap,
  Brain,
  ArrowRight,
  GitBranch,
  DollarSign,
  Gauge,
  Github,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-gray-700/50 bg-[#0f172a]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Smart LLM Router</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
              About
            </a>
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
              Features
            </a>
            <button
              onClick={() => navigate("/router")}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-violet-500 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center pt-16 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px] pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-700/50 bg-gray-800/50 text-sm text-gray-300 mb-8 landing-fade-in">
            <Zap size={14} className="text-emerald-400" />
            Inspired by Kahneman's Thinking, Fast and Slow
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 landing-fade-in landing-delay-1">
            <span className="text-white">Route Queries to the </span>
            <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
              Right Model
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed landing-fade-in landing-delay-2">
            An intelligent router that classifies query complexity and sends simple tasks to fast,
            cheap models and complex reasoning to powerful ones — saving cost without sacrificing quality.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 landing-fade-in landing-delay-3">
            <button
              onClick={() => navigate("/router")}
              className="group flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-violet-500 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer"
            >
              Try the Router
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 text-base font-medium text-gray-300 border border-gray-700 rounded-xl hover:bg-gray-800/50 hover:border-gray-600 transition-all"
            >
              <Github size={18} />
              View Source
            </a>
          </div>

          {/* Visual diagram */}
          <div className="mt-20 landing-fade-in landing-delay-4">
            <div className="relative max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 sm:gap-6">
                {/* Input */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gray-800 border border-gray-700/50 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">💬</span>
                  </div>
                  <span className="text-xs text-gray-500">Your Query</span>
                </div>

                <ArrowRight size={20} className="text-gray-600 flex-shrink-0" />

                {/* Router */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-violet-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <GitBranch size={24} className="text-emerald-400" />
                  </div>
                  <span className="text-xs text-gray-500">Smart Router</span>
                </div>

                <ArrowRight size={20} className="text-gray-600 flex-shrink-0" />

                {/* Models */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <Zap size={20} className="text-emerald-400" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-medium text-emerald-400">System 1</p>
                      <p className="text-[10px] text-gray-500">Fast & Cheap</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <Brain size={20} className="text-violet-400" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-medium text-violet-400">System 2</p>
                      <p className="text-[10px] text-gray-500">Deep Reasoning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Smart LLM Router uses a dual-brain approach inspired by Daniel Kahneman's research
              on human cognition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group p-8 rounded-2xl bg-gray-800/30 border border-gray-700/30 hover:border-emerald-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5">
                <Zap size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">System 1 — Fast Thinking</h3>
              <p className="text-gray-400 leading-relaxed">
                Simple queries like greetings, translations, and quick lookups are routed to
                lightweight, cost-efficient models. Responses arrive in milliseconds at a fraction
                of the cost.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Greetings", "Translations", "Lookups", "Simple math"].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="group p-8 rounded-2xl bg-gray-800/30 border border-gray-700/30 hover:border-violet-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-5">
                <Brain size={24} className="text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">System 2 — Deep Thinking</h3>
              <p className="text-gray-400 leading-relaxed">
                Complex reasoning, code generation, multi-step analysis, and nuanced questions
                are escalated to powerful models capable of deep, structured thinking.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Code generation", "Analysis", "Debugging", "Research"].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Smart Routing?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Not every question needs a supercomputer. Save money and time by matching the model to the task.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-gray-800/20 border border-gray-700/30 hover:border-gray-600/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                <DollarSign size={22} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cost Efficient</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Route simple queries to cheap models and only use expensive ones when needed.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-800/20 border border-gray-700/30 hover:border-gray-600/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                <Gauge size={22} className="text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lower Latency</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Lightweight models respond faster. Your users get answers in milliseconds.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-800/20 border border-gray-700/30 hover:border-gray-600/50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center mb-4">
                <GitBranch size={22} className="text-sky-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Transparent Routing</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                See exactly which model was chosen, why, and how confident the classifier was.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Try It?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Send a query and watch the router classify, route, and respond in real time.
          </p>
          <button
            onClick={() => navigate("/router")}
            className="group inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-emerald-500 to-violet-500 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all cursor-pointer"
          >
            Launch the Router
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">Smart LLM Router</span>
            </div>
            <p className="text-sm text-gray-500">
              Intelligent query routing with System 1 & System 2 thinking.
            </p>
            <div className="flex items-center gap-4 text-gray-500">
              <a
                href="https://github.com/AnkitPorwal04/smart-llm-router"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-600">
              Built with FastAPI, React, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
