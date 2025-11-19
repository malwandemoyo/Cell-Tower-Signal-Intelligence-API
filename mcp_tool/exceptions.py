"""
Custom exceptions for Cell Tower Signal Intelligence MCP Server
"""


class CellTowerAPIError(Exception):
    """Base exception for API-related errors"""

    def __init__(self, message: str, status_code: int | None = None):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class APIConnectionError(CellTowerAPIError):
    """Raised when unable to connect to the API"""

    pass


class APIValidationError(CellTowerAPIError):
    """Raised when API returns validation errors"""

    pass


class ToolExecutionError(Exception):
    """Raised when tool execution fails"""

    pass
