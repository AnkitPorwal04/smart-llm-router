# Smart LLM Router — YouTube Video Script (5 Minutes)

> **Format**: Talking-head + screen recording. Sections marked with [SCREEN] mean show the website/code. Sections with [CAMERA] mean face the camera.

---

## INTRO — The Hook (0:00 - 0:30)

[CAMERA]

"Every time you call ChatGPT or Gemini's API, you're paying for it. But here's the thing — if someone asks 'Hello, how are you?'... do you really need a $10-per-million-token model for that?

What if your app could automatically figure out: 'this is a simple question, use the cheap model' or 'this is a complex coding problem, use the powerful one'?

That's exactly what I built. It's called **Smart LLM Router**, and it's inspired by how our own brains work — Daniel Kahneman's System 1 and System 2 thinking."

---

## THE PROBLEM (0:30 - 1:15)

[CAMERA]

"So let me explain the problem first. When you're building any AI application — a chatbot, a coding assistant, a customer support tool — you have to pick a model. And usually, developers just hardcode one model for everything.

But that's wasteful. If 60% of your queries are simple — greetings, translations, factual lookups — you're burning money sending them to GPT-4 or Gemini Pro.

On the flip side, if you use only a cheap model, your complex queries — code generation, deep analysis, multi-step reasoning — get terrible answers.

[SCREEN — show a simple cost comparison table]

So the real question is: **how do you route each query to the RIGHT model, in real time, without the user even knowing?**"

---

## THE SOLUTION (1:15 - 2:00)

[CAMERA]

"The answer is **intelligent routing**. And I modeled it after how psychologist Daniel Kahneman describes human thinking:

**System 1** is fast, intuitive, automatic — like when someone says 'Hi' and you instantly respond. For this, I use `gemini-2.5-flash-lite` — it's fast and costs almost nothing.

**System 2** is slow, deliberate, analytical — like solving a math problem or writing code. For this, I route to `gemini-2.5-flash` — more powerful, but still cost-effective.

[SCREEN — show the architecture diagram from the README]

The flow is: your query comes in, a **classifier** analyzes its complexity, decides if it's System 1 or System 2, and routes it to the right model. Then it records metrics — latency, cost, tokens used — so you can see exactly what's happening."

---

## THE WEBSITE DEMO (2:00 - 3:15)

[SCREEN — show the website at localhost:8000]

"Let me show you how this works in practice.

Here's the frontend — built with React, TypeScript, and Tailwind CSS. You can see the clean interface with a query input and a metrics dashboard on the right.

[Type 'Hello!' and submit]

Watch this — I type 'Hello!' and it gets classified as **System 1**. See the green badge? It used `gemini-2.5-flash-lite`, responded in about 200 milliseconds, and cost... basically nothing. Fraction of a cent.

[Type 'Write a Python function to implement binary search with complexity analysis' and submit]

Now let's try something complex. 'Write a Python function to implement binary search with complexity analysis.'

This time — **System 2**, purple badge. It routed to `gemini-2.5-flash`. Took a bit longer, but gave a detailed response with actual code and Big-O analysis. And the response is rendered in full markdown with syntax highlighting.

[Point to the metrics dashboard]

Over here, the metrics dashboard updates in real time. You can see the pie charts — requests by complexity, requests by model. Total cost, average latency, token usage. Everything is tracked.

[Show the Advanced Options]

And if you ever want to override the router's decision — there's an advanced options panel where you can force a specific model or set a custom system prompt."

---

## THE CODEBASE (3:15 - 4:40)

[SCREEN — show VS Code with the project]

"Now let me walk you through the code because this is the interesting part.

[Show app/classifier/heuristic.py]

**The Classifier** — This is the brain of the system. The heuristic classifier uses a scoring system with 7 different signals. It looks at query length — short queries get a negative score, long ones get positive. It checks for System 1 patterns like greetings with regex. It scans for System 2 keywords like 'analyze', 'algorithm', 'debug'. It even detects code blocks and math symbols.

All these signals add up to a score. Above 0.3? System 2. Below negative 0.2? System 1. And it's instant — zero API calls.

There's also an LLM classifier and a hybrid mode that uses heuristic first and only calls the LLM if confidence is low. Best of both worlds.

[Show app/router/router.py]

**The Router** — This is the orchestrator. Six steps: classify the query, select the model, generate the response, calculate latency, record metrics, and return everything. It even has a fallback mechanism — if the cheap model fails, it automatically escalates to the powerful one.

[Show app/config.py]

**Configuration** — The whole system is provider-agnostic. Right now it's running on Google Gemini's free tier, but you can switch to OpenAI or Groq just by changing three environment variables. The pricing table is built in, so cost calculations work for any model.

[Show frontend/src/components/ResponseCard.tsx briefly]

**The Frontend** — React 19 with TypeScript. Every response card shows the full breakdown — which system was used, which model, confidence score, latency, tokens, and cost. Responses are rendered as markdown with copy-to-clipboard. Session history persists in localStorage."

---

## OUTRO — Wrap Up (4:40 - 5:00)

[CAMERA]

"So that's Smart LLM Router — automatic, cost-efficient query routing using System 1 and System 2 thinking. It's open source, link in the description.

If you're building AI applications and want to save money without sacrificing quality — this is one approach worth exploring.

If you found this useful, drop a like and let me know in the comments — would you use something like this in production? What features would you add?

Thanks for watching."

---

## VISUAL CHECKLIST

- [ ] Architecture diagram (from README)
- [ ] Website demo: System 1 query (green badge)
- [ ] Website demo: System 2 query (purple badge)
- [ ] Metrics dashboard with pie charts
- [ ] VS Code: heuristic.py scoring system
- [ ] VS Code: router.py 6-step flow
- [ ] VS Code: config.py multi-provider support
- [ ] Cost comparison slide (optional)
