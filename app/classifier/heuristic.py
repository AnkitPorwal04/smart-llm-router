import re

from app.classifier.base import BaseClassifier
from app.models import ClassificationResult, ComplexityLevel


class HeuristicClassifier(BaseClassifier):
    """Rule-based classifier using keyword matching, structural signals, and query characteristics."""

    def __init__(self):
        self.system2_keywords: set[str] = {
            # Reasoning / analysis
            "analyze", "analysis", "evaluate", "compare", "contrast",
            "explain why", "reason", "reasoning", "deduce", "infer",
            "critique", "assess", "synthesize", "hypothesis",
            # Math / logic
            "calculate", "compute", "solve", "equation", "integral",
            "derivative", "probability", "proof", "theorem", "algorithm",
            "optimize", "mathematical", "formula",
            # Coding
            "implement", "debug", "refactor", "architecture", "design pattern",
            "recursion", "complexity", "function", "class", "async",
            "database", "sql", "api", "deploy",
            # Deep knowledge
            "implications", "trade-offs", "tradeoffs", "nuances",
            "comprehensive", "in-depth", "detailed",
            "step by step", "step-by-step", "walk me through",
        }

        self.system2_phrases: list[str] = [
            r"write (?:a |an |the )?(?:code|program|script|function|class)",
            r"how (?:do|does|would|could|can) .{20,}",
            r"what (?:are the|is the) (?:difference|relationship|impact)",
            r"(?:pro|con)s? and (?:con|pro)s?",
            r"build (?:a |an |the )?",
            r"create (?:a |an |the )?(?:system|application|pipeline|framework)",
            r"design (?:a |an |the )?",
        ]

        self.system1_patterns: list[str] = [
            r"^(?:hi|hello|hey|greetings|good (?:morning|afternoon|evening))[\s!.?]*$",
            r"^(?:thanks?|thank you|thx)[\s!.?]*$",
            r"^what (?:is|are) (?:the )?\w+[\s?]*$",
            r"^who (?:is|was|are) ",
            r"^when (?:is|was|did) ",
            r"^where (?:is|was|are) ",
            r"^define ",
            r"^(?:what|what's) (?:the )?(?:capital|population|currency|language) of",
            r"^(?:translate|convert) .{1,50}$",
        ]

        self.code_indicators: list[str] = [
            r"```",
            r"def \w+\(",
            r"class \w+[:\(]",
            r"function \w+\(",
            r"import \w+",
            r"(?:SELECT|INSERT|UPDATE|DELETE) .+ (?:FROM|INTO|SET)",
        ]

    @property
    def name(self) -> str:
        return "heuristic"

    async def classify(self, query: str) -> ClassificationResult:
        query_lower = query.lower().strip()
        score = 0.0
        signals: list[str] = []

        # Signal 1: Query length
        word_count = len(query.split())
        if word_count <= 5:
            score -= 0.3
            signals.append(f"short_query({word_count}_words)")
        elif word_count >= 50:
            score += 0.3
            signals.append(f"long_query({word_count}_words)")
        elif word_count >= 25:
            score += 0.15
            signals.append(f"medium_query({word_count}_words)")

        # Signal 2: System 1 pattern match
        for pattern in self.system1_patterns:
            if re.search(pattern, query_lower):
                score -= 0.4
                signals.append(f"system1_pattern")
                break

        # Signal 3: System 2 keyword match
        keyword_hits = sum(1 for kw in self.system2_keywords if kw in query_lower)
        if keyword_hits >= 3:
            score += 0.5
            signals.append(f"system2_keywords({keyword_hits}_hits)")
        elif keyword_hits >= 1:
            score += 0.25
            signals.append(f"system2_keywords({keyword_hits}_hits)")

        # Signal 4: System 2 phrase match
        for pattern in self.system2_phrases:
            if re.search(pattern, query_lower):
                score += 0.35
                signals.append("system2_phrase")
                break

        # Signal 5: Code detection
        for pattern in self.code_indicators:
            if re.search(pattern, query, re.IGNORECASE):
                score += 0.4
                signals.append("code_detected")
                break

        # Signal 6: Question complexity
        question_marks = query.count("?")
        if question_marks >= 3:
            score += 0.2
            signals.append(f"multi_question({question_marks})")

        sentences = [s.strip() for s in re.split(r"[.!?]+", query) if s.strip()]
        if len(sentences) >= 4:
            score += 0.15
            signals.append(f"multi_sentence({len(sentences)})")

        # Signal 7: Math content
        math_symbols = len(re.findall(r"[+\-*/=<>^%]|\d{2,}", query))
        if math_symbols >= 3:
            score += 0.3
            signals.append(f"math_content({math_symbols}_symbols)")

        # Decision
        if score >= 0.3:
            complexity = ComplexityLevel.SYSTEM2
            confidence = min(0.95, 0.6 + abs(score) * 0.3)
        elif score <= -0.2:
            complexity = ComplexityLevel.SYSTEM1
            confidence = min(0.95, 0.6 + abs(score) * 0.3)
        else:
            complexity = ComplexityLevel.SYSTEM1
            confidence = 0.5

        return ClassificationResult(
            complexity=complexity,
            confidence=round(confidence, 3),
            reasoning=f"score={score:.2f}, signals=[{', '.join(signals)}]",
            classifier_used=self.name,
        )
