#!/usr/bin/env python3
"""
Cell Tower Signal Intelligence MCP Server
Provides AI assistants access to cell tower data via Model Context Protocol
"""

import asyncio
import json
from typing import Any, Optional
import httpx
from mcp.server.models import InitializationOptions
import mcp.types as types
from mcp.server import NotificationOptions, Server
import mcp.server.stdio

# Configuration
API_BASE_URL = "http://localhost:8080/api/cell-towers"
DEFAULT_TIMEOUT = 30.0

# Initialize MCP server
server = Server("cell-tower-intelligence")

# HTTP client for API requests
http_client: Optional[httpx.AsyncClient] = None


def get_client() -> httpx.AsyncClient:
    """Get or create HTTP client"""
    global http_client
    if http_client is None:
        http_client = httpx.AsyncClient(
            timeout=DEFAULT_TIMEOUT,
            headers={"Content-Type": "application/json"}
        )
    return http_client


@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """List available cell tower analysis tools"""
    return [
        types.Tool(
            name="get_all_towers",
            description="Retrieve all cell towers in the database. Use with caution for large datasets.",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        ),
        types.Tool(
            name="get_towers_paged",
            description="Get cell towers with pagination and sorting. Efficient for large datasets.",
            inputSchema={
                "type": "object",
                "properties": {
                    "page": {"type": "integer", "description": "Page number (0-indexed)", "default": 0},
                    "size": {"type": "integer", "description": "Items per page", "default": 50},
                    "sort_by": {"type": "string", "description": "Field to sort by (e.g., averageSignal, mcc)", "default": "id"},
                    "sort_direction": {"type": "string", "enum": ["asc", "desc"], "default": "asc"},
                },
            },
        ),
        types.Tool(
            name="get_tower_by_id",
            description="Get a specific cell tower by its database ID",
            inputSchema={
                "type": "object",
                "properties": {
                    "id": {"type": "integer", "description": "Database ID of the tower"},
                },
                "required": ["id"],
            },
        ),
        types.Tool(
            name="get_towers_by_radio",
            description="Filter cell towers by radio technology type (LTE, GSM, UMTS, CDMA)",
            inputSchema={
                "type": "object",
                "properties": {
                    "radio": {"type": "string", "description": "Radio type: LTE, GSM, UMTS, or CDMA"},
                },
                "required": ["radio"],
            },
        ),
        types.Tool(
            name="get_towers_by_mcc",
            description="Filter cell towers by Mobile Country Code (MCC)",
            inputSchema={
                "type": "object",
                "properties": {
                    "mcc": {"type": "integer", "description": "Mobile Country Code (e.g., 655 for South Africa)"},
                },
                "required": ["mcc"],
            },
        ),
        types.Tool(
            name="get_towers_by_location",
            description="Search towers within a geographic bounding box (min/max longitude and latitude)",
            inputSchema={
                "type": "object",
                "properties": {
                    "min_lon": {"type": "number", "description": "Minimum longitude"},
                    "max_lon": {"type": "number", "description": "Maximum longitude"},
                    "min_lat": {"type": "number", "description": "Minimum latitude"},
                    "max_lat": {"type": "number", "description": "Maximum latitude"},
                },
                "required": ["min_lon", "max_lon", "min_lat", "max_lat"],
            },
        ),
        types.Tool(
            name="get_towers_by_signal_range",
            description="Filter towers by signal strength range in dBm (e.g., -90 to -70 for moderate signals)",
            inputSchema={
                "type": "object",
                "properties": {
                    "min_signal": {"type": "integer", "description": "Minimum signal strength in dBm"},
                    "max_signal": {"type": "integer", "description": "Maximum signal strength in dBm"},
                },
                "required": ["min_signal", "max_signal"],
            },
        ),
        types.Tool(
            name="get_towers_by_min_samples",
            description="Filter towers by minimum number of samples collected",
            inputSchema={
                "type": "object",
                "properties": {
                    "min_samples": {"type": "integer", "description": "Minimum number of samples"},
                },
                "required": ["min_samples"],
            },
        ),
        types.Tool(
            name="create_tower",
            description="Create a new cell tower entry in the database",
            inputSchema={
                "type": "object",
                "properties": {
                    "radio": {"type": "string", "description": "Radio type (LTE, GSM, UMTS, CDMA)"},
                    "mcc": {"type": "integer", "description": "Mobile Country Code"},
                    "net": {"type": "integer", "description": "Network code"},
                    "area": {"type": "integer", "description": "Location Area Code"},
                    "cell": {"type": "integer", "description": "Cell ID"},
                    "lon": {"type": "number", "description": "Longitude"},
                    "lat": {"type": "number", "description": "Latitude"},
                    "range": {"type": "integer", "description": "Range in meters"},
                    "samples": {"type": "integer", "description": "Number of samples"},
                    "averageSignal": {"type": "integer", "description": "Average signal strength in dBm"},
                },
                "required": ["radio", "mcc", "net", "area", "cell", "lon", "lat"],
            },
        ),
        types.Tool(
            name="update_tower",
            description="Update specific fields of an existing cell tower (partial update)",
            inputSchema={
                "type": "object",
                "properties": {
                    "id": {"type": "integer", "description": "Database ID of the tower"},
                    "updates": {"type": "object", "description": "Fields to update (e.g., {averageSignal: -80})"},
                },
                "required": ["id", "updates"],
            },
        ),
        types.Tool(
            name="delete_tower",
            description="Delete a cell tower by its database ID",
            inputSchema={
                "type": "object",
                "properties": {
                    "id": {"type": "integer", "description": "Database ID of the tower to delete"},
                },
                "required": ["id"],
            },
        ),
        types.Tool(
            name="analyze_coverage",
            description="Analyze tower coverage statistics by radio type and location",
            inputSchema={
                "type": "object",
                "properties": {
                    "radio": {"type": "string", "description": "Optional: Filter by radio type"},
                    "min_lon": {"type": "number", "description": "Optional: Minimum longitude"},
                    "max_lon": {"type": "number", "description": "Optional: Maximum longitude"},
                    "min_lat": {"type": "number", "description": "Optional: Minimum latitude"},
                    "max_lat": {"type": "number", "description": "Optional: Maximum latitude"},
                },
            },
        ),
    ]


@server.call_tool()
async def handle_call_tool(
    name: str, arguments: dict | None
) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
    """Handle tool execution requests"""
    
    try:
        client = get_client()
        
        if name == "get_all_towers":
            response = await client.get(API_BASE_URL)
            response.raise_for_status()
            data = response.json()
            return [types.TextContent(type="text", text=json.dumps(data, indent=2))]
        
        elif name == "get_towers_paged":
            params = {
                "page": arguments.get("page", 0),
                "size": arguments.get("size", 50),
                "sortBy": arguments.get("sort_by", "id"),
                "sortDirection": arguments.get("sort_direction", "asc"),
            }
            response = await client.get(f"{API_BASE_URL}/paged", params=params)
            response.raise_for_status()
            data = response.json()
            return [types.TextContent(type="text", text=json.dumps(data, indent=2))]
        
        elif name == "get_tower_by_id":
            tower_id = arguments["id"]
            response = await client.get(f"{API_BASE_URL}/{tower_id}")
            response.raise_for_status()
            data = response.json()
            return [types.TextContent(type="text", text=json.dumps(data, indent=2))]
        
        elif name == "get_towers_by_radio":
            radio = arguments["radio"]
            response = await client.get(f"{API_BASE_URL}/radio/{radio}")
            response.raise_for_status()
            data = response.json()
            return [types.TextContent(type="text", text=json.dumps(data, indent=2))]
        
        elif name == "get_towers_by_mcc":
            mcc = arguments["mcc"]
            response = await client.get(f"{API_BASE_URL}/mcc/{mcc}")
            response.raise_for_status()
            data = response.json()
            return [types.TextContent(type="text", text=json.dumps(data, indent=2))]
        
        elif name == "get_towers_by_location":
            params = {
                "minLon": arguments["min_lon"],
                "maxLon": arguments["max_lon"],
                "minLat": arguments["min_lat"],
                "maxLat": arguments["max_lat"],
            }
            response = await client.get(f"{API_BASE_URL}/location", params=params)
            response.raise_for_status()
            data = response.json()
            return [types.TextContent(type="text", text=json.dumps(data, indent=2))]
        
        elif name == "get_towers_by_signal_range":
            params = {
                "minSignal": arguments["min_signal"],
                "maxSignal": arguments["max_signal"],
            }
            response = await client.get(f"{API_BASE_URL}/signal", params=params)
            response.raise_for_status()
            data = response.json()
            return [types.TextContent(type="text", text=json.dumps(data, indent=2))]
        
        elif name == "get_towers_by_min_samples":
            min_samples = arguments["min_samples"]
            response = await client.get(f"{API_BASE_URL}/samples/{min_samples}")
            response.raise_for_status()
            data = response.json()
            return [types.TextContent(type="text", text=json.dumps(data, indent=2))]
        
        elif name == "create_tower":
            response = await client.post(API_BASE_URL, json=arguments)
            response.raise_for_status()
            data = response.json()
            return [types.TextContent(type="text", text=f"Tower created successfully:\n{json.dumps(data, indent=2)}")]
        
        elif name == "update_tower":
            tower_id = arguments["id"]
            updates = arguments["updates"]
            response = await client.patch(f"{API_BASE_URL}/{tower_id}", json=updates)
            response.raise_for_status()
            data = response.json()
            return [types.TextContent(type="text", text=f"Tower updated successfully:\n{json.dumps(data, indent=2)}")]
        
        elif name == "delete_tower":
            tower_id = arguments["id"]
            response = await client.delete(f"{API_BASE_URL}/{tower_id}")
            response.raise_for_status()
            return [types.TextContent(type="text", text=f"Tower {tower_id} deleted successfully")]
        
        elif name == "analyze_coverage":
            # Custom analysis combining multiple queries
            filters = []
            
            # Get towers based on filters
            if "radio" in arguments:
                response = await client.get(f"{API_BASE_URL}/radio/{arguments['radio']}")
            elif all(k in arguments for k in ["min_lon", "max_lon", "min_lat", "max_lat"]):
                params = {
                    "minLon": arguments["min_lon"],
                    "maxLon": arguments["max_lon"],
                    "minLat": arguments["min_lat"],
                    "maxLat": arguments["max_lat"],
                }
                response = await client.get(f"{API_BASE_URL}/location", params=params)
            else:
                response = await client.get(API_BASE_URL)
            
            response.raise_for_status()
            towers = response.json()
            
            # Analyze the data
            if not towers:
                return [types.TextContent(type="text", text="No towers found matching the criteria")]
            
            analysis = {
                "total_towers": len(towers),
                "radio_distribution": {},
                "signal_stats": {
                    "average": sum(t.get("averageSignal", 0) for t in towers) / len(towers),
                    "strongest": max((t.get("averageSignal", -999) for t in towers), default=0),
                    "weakest": min((t.get("averageSignal", 0) for t in towers), default=0),
                },
                "sample_stats": {
                    "total_samples": sum(t.get("samples", 0) for t in towers),
                    "avg_samples_per_tower": sum(t.get("samples", 0) for t in towers) / len(towers),
                },
            }
            
            # Radio distribution
            for tower in towers:
                radio = tower.get("radio", "Unknown")
                analysis["radio_distribution"][radio] = analysis["radio_distribution"].get(radio, 0) + 1
            
            return [types.TextContent(type="text", text=json.dumps(analysis, indent=2))]
        
        else:
            raise ValueError(f"Unknown tool: {name}")
    
    except httpx.HTTPStatusError as e:
        return [types.TextContent(type="text", text=f"API Error: {e.response.status_code} - {e.response.text}")]
    except Exception as e:
        return [types.TextContent(type="text", text=f"Error: {str(e)}")]


async def main():
    """Run the MCP server"""
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="cell-tower-intelligence",
                server_version="1.0.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )


if __name__ == "__main__":
    asyncio.run(main())
