#!/usr/bin/env python3
"""
Cell Tower Signal Intelligence MCP Server
Provides AI assistants access to cell tower data via Model Context Protocol

This module serves as the main entry point for the MCP server.
"""

import asyncio
import logging
import sys

import mcp.types as types
from mcp.server import NotificationOptions, Server
import mcp.server.stdio
from mcp.server.models import InitializationOptions

from config import SERVER_NAME, SERVER_VERSION
from tool_definitions import ToolDefinitions
from tool_handler import ToolHandler

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stderr,
)
logger = logging.getLogger(__name__)

# Initialize MCP server
server = Server(SERVER_NAME)

# Initialize tool handler
tool_handler = ToolHandler()


@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """List available cell tower analysis tools"""
    logger.info("Listing available tools")
    return ToolDefinitions.get_all_tools()


@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict | None
) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
    """Handle tool execution requests"""
    logger.info(f"Tool called: {name}")
    return await tool_handler.handle_tool(name, arguments)


async def main() -> None:
    """Run the MCP server"""
    logger.info(f"Starting {SERVER_NAME} v{SERVER_VERSION}")
    try:
        async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
            await server.run(
                read_stream,
                write_stream,
                InitializationOptions(
                    server_name=SERVER_NAME,
                    server_version=SERVER_VERSION,
                    capabilities=server.get_capabilities(
                        notification_options=NotificationOptions(),
                        experimental_capabilities={},
                    ),
                ),
            )
    except Exception as e:
        logger.error(f"Server error: {e}", exc_info=True)
        raise


if __name__ == "__main__":
    asyncio.run(main())
