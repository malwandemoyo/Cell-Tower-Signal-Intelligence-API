"""
Configuration management for Cell Tower Signal Intelligence MCP Server
"""

from typing import Final

# API Configuration
API_BASE_URL: Final[str] = "http://localhost:8080/api/cell-towers"
DEFAULT_TIMEOUT: Final[float] = 30.0

# Server Configuration
SERVER_NAME: Final[str] = "cell-tower-intelligence"
SERVER_VERSION: Final[str] = "1.0.0"

# Pagination Defaults
DEFAULT_PAGE: Final[int] = 0
DEFAULT_PAGE_SIZE: Final[int] = 50
DEFAULT_SORT_BY: Final[str] = "id"
DEFAULT_SORT_DIRECTION: Final[str] = "asc"

# HTTP Headers
DEFAULT_HEADERS: Final[dict[str, str]] = {
    "Content-Type": "application/json"
}
