# LinkedIn Post — Smart LLM Router

## Post Images (create these)

### Image 1: Hero/Cover
A screenshot of the website showing:
- The clean dark UI
- A System 1 response (green badge) and System 2 response (purple badge) side by side
- The metrics dashboard with pie charts visible on the right

### Image 2: Architecture Diagram
Create a clean diagram showing:
```
         ┌─────────────┐
         │  User Query  │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │  Classifier   │
         │  (Heuristic / │
         │  LLM / Hybrid)│
         └──────┬───────┘
           ┌────┴────┐
           ▼         ▼
     ┌──────────┐ ┌──────────┐
     │ System 1 │ │ System 2 │
     │   Fast   │ │   Deep   │
     │   $0.05  │ │   $0.15  │
     │ per 1M   │ │ per 1M   │
     └──────────┘ └──────────┘
```
Use the color scheme: Emerald (#10b981) for System 1, Violet (#8b5cf6) for System 2

### Image 3: Code Snapshot
A clean screenshot of the heuristic classifier code (app/classifier/heuristic.py) showing the scoring system

### Image 4: Metrics Dashboard
Close-up screenshot of the metrics panel showing:
- Stat cards (requests, latency, cost, tokens)
- Pie charts (by complexity, by model)
- Recent queries list

---

## Caption/Comment

```
I built an intelligent LLM Router that decides which AI model should answer your question.

The idea is simple but powerful:

"Hello!" → cheap, fast model (System 1)
"Write a merge sort with complexity analysis" → powerful model (System 2)

Inspired by Daniel Kahneman's System 1/System 2 thinking:
→ System 1: Fast, intuitive, automatic
→ System 2: Slow, deliberate, analytical

Why does this matter?

If you're building AI apps, you're probably sending every query to the same expensive model. But 60%+ of real-world queries are simple — greetings, translations, factual lookups. You don't need GPT-4 for "What's the capital of France?"

What I built:
◆ A heuristic classifier with 7 signal types (keywords, regex, query length, code detection, math symbols)
◆ Automatic routing to the optimal model based on complexity score
◆ Real-time metrics dashboard tracking cost, latency, and token usage
◆ Fallback mechanism — if the fast model fails, it auto-escalates
◆ Provider-agnostic — works with Gemini, OpenAI, or Groq

Tech stack:
• Backend: Python, FastAPI, Pydantic
• Frontend: React 19, TypeScript, Tailwind CSS, Recharts
• LLM: Google Gemini (OpenAI-compatible API)
• Tests: 29 tests with pytest

The result? Simple queries cost ~$0.00001 and respond in <300ms. Complex queries get the power they need.

Open source on GitHub → link in comments

#AI #LLM #MachineLearning #Python #FastAPI #React #TypeScript #OpenSource #BuildInPublic #SoftwareEngineering #ArtificialIntelligence #WebDevelopment #Gemini
```

---

## Comment to Pin (with GitHub link)

```
GitHub repo: https://github.com/YOUR_USERNAME/smart-llm-router

Getting started is simple:
1. Clone the repo
2. Add your free Gemini API key to .env
3. pip install -e ".[dev]" && cd frontend && npm install && npm run build
4. uvicorn app.main:app --reload
5. Open localhost:8000

Built with Claude Code as the AI pair programmer. Happy to answer any questions!
```
