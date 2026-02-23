class SmartRouterError(Exception):
    """Base exception for the smart router."""
    pass


class ClassificationError(SmartRouterError):
    """Raised when query classification fails."""
    pass


class RoutingError(SmartRouterError):
    """Raised when routing/generation fails."""
    pass


class ConfigurationError(SmartRouterError):
    """Raised for configuration issues."""
    pass
