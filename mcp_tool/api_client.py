"""
HTTP client manager for Cell Tower Signal Intelligence MCP Server
"""

import logging
from typing import Optional

import httpx

from config import API_BASE_URL, DEFAULT_HEADERS, DEFAULT_TIMEOUT
from exceptions import APIConnectionError

logger = logging.getLogger(__name__)


class APIClient:
    """Manages HTTP client for API requests with error handling"""

    _instance: Optional["APIClient"] = None
    _client: Optional[httpx.AsyncClient] = None

    def __new__(cls) -> "APIClient":
        """Implement singleton pattern"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    async def get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client"""
        if self._client is None:
            try:
                self._client = httpx.AsyncClient(
                    timeout=DEFAULT_TIMEOUT,
                    headers=DEFAULT_HEADERS,
                    base_url=API_BASE_URL,
                )
                logger.info(f"HTTP client initialized with base URL: {API_BASE_URL}")
            except Exception as e:
                logger.error(f"Failed to initialize HTTP client: {e}")
                raise APIConnectionError(f"Failed to initialize HTTP client: {e}")
        return self._client

    async def close(self) -> None:
        """Close the HTTP client"""
        if self._client is not None:
            await self._client.aclose()
            self._client = None
            logger.info("HTTP client closed")

    async def get(self, endpoint: str, **kwargs) -> dict:
        """Make GET request to API"""
        try:
            client = await self.get_client()
            response = await client.get(endpoint, **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"GET {endpoint} failed with status {e.response.status_code}: {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"GET {endpoint} failed: {e}")
            raise

    async def post(self, endpoint: str, json_data: dict, **kwargs) -> dict:
        """Make POST request to API"""
        try:
            client = await self.get_client()
            response = await client.post(endpoint, json=json_data, **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"POST {endpoint} failed with status {e.response.status_code}: {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"POST {endpoint} failed: {e}")
            raise

    async def patch(self, endpoint: str, json_data: dict, **kwargs) -> dict:
        """Make PATCH request to API"""
        try:
            client = await self.get_client()
            response = await client.patch(endpoint, json=json_data, **kwargs)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            logger.error(f"PATCH {endpoint} failed with status {e.response.status_code}: {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"PATCH {endpoint} failed: {e}")
            raise

    async def delete(self, endpoint: str, **kwargs) -> None:
        """Make DELETE request to API"""
        try:
            client = await self.get_client()
            response = await client.delete(endpoint, **kwargs)
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            logger.error(f"DELETE {endpoint} failed with status {e.response.status_code}: {e.response.text}")
            raise
        except Exception as e:
            logger.error(f"DELETE {endpoint} failed: {e}")
            raise
