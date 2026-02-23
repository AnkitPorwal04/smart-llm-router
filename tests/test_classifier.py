import pytest

from app.classifier.heuristic import HeuristicClassifier
from app.models import ComplexityLevel


@pytest.fixture
def classifier():
    return HeuristicClassifier()


@pytest.mark.asyncio
async def test_greeting_classifies_as_system1(classifier):
    result = await classifier.classify("Hello!")
    assert result.complexity == ComplexityLevel.SYSTEM1
    assert result.confidence >= 0.6


@pytest.mark.asyncio
async def test_simple_question_classifies_as_system1(classifier):
    result = await classifier.classify("What is Python?")
    assert result.complexity == ComplexityLevel.SYSTEM1


@pytest.mark.asyncio
async def test_factual_lookup_classifies_as_system1(classifier):
    result = await classifier.classify("What's the capital of France?")
    assert result.complexity == ComplexityLevel.SYSTEM1


@pytest.mark.asyncio
async def test_code_request_classifies_as_system2(classifier):
    result = await classifier.classify(
        "Write a Python function to implement merge sort with detailed complexity analysis"
    )
    assert result.complexity == ComplexityLevel.SYSTEM2
    assert result.confidence >= 0.6


@pytest.mark.asyncio
async def test_math_classifies_as_system2(classifier):
    result = await classifier.classify(
        "Calculate the integral of x^2 from 0 to 5 and explain the process step by step"
    )
    assert result.complexity == ComplexityLevel.SYSTEM2


@pytest.mark.asyncio
async def test_analysis_classifies_as_system2(classifier):
    result = await classifier.classify(
        "Analyze the trade-offs between microservices and monolithic architecture. "
        "Compare their implications for scalability, deployment, and team organization."
    )
    assert result.complexity == ComplexityLevel.SYSTEM2


@pytest.mark.asyncio
async def test_code_block_classifies_as_system2(classifier):
    result = await classifier.classify(
        "Debug this code:\n```python\ndef foo(x):\n    return x + 1\n```"
    )
    assert result.complexity == ComplexityLevel.SYSTEM2


@pytest.mark.asyncio
async def test_thank_you_classifies_as_system1(classifier):
    result = await classifier.classify("Thank you!")
    assert result.complexity == ComplexityLevel.SYSTEM1


@pytest.mark.asyncio
async def test_classification_has_reasoning(classifier):
    result = await classifier.classify("Hello!")
    assert result.reasoning != ""
    assert result.classifier_used == "heuristic"


@pytest.mark.asyncio
async def test_confidence_is_bounded(classifier):
    result = await classifier.classify("Tell me everything about quantum physics")
    assert 0.0 <= result.confidence <= 1.0
