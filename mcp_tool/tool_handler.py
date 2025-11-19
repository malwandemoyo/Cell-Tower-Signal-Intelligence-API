"""
Tool handlers for Cell Tower Signal Intelligence MCP Server
Implements the business logic for each MCP tool
"""

import json
import logging
from typing import Any

import mcp.types as types

from api_client import APIClient

logger = logging.getLogger(__name__)


class ToolHandler:
    """Handles execution of MCP tools for cell tower operations"""

    def __init__(self):
        self.api_client = APIClient()

    async def handle_tool(
        self, name: str, arguments: dict | None
    ) -> list[types.TextContent | types.ImageContent | types.EmbeddedResource]:
        """Route tool execution based on tool name"""
        try:
            if name == "get_all_towers":
                return await self.get_all_towers()
            elif name == "get_towers_paged":
                return await self.get_towers_paged(arguments or {})
            elif name == "get_tower_by_id":
                return await self.get_tower_by_id(arguments or {})
            elif name == "get_towers_by_radio":
                return await self.get_towers_by_radio(arguments or {})
            elif name == "get_towers_by_mcc":
                return await self.get_towers_by_mcc(arguments or {})
            elif name == "get_towers_by_location":
                return await self.get_towers_by_location(arguments or {})
            elif name == "get_towers_by_signal_range":
                return await self.get_towers_by_signal_range(arguments or {})
            elif name == "get_towers_by_min_samples":
                return await self.get_towers_by_min_samples(arguments or {})
            elif name == "create_tower":
                return await self.create_tower(arguments or {})
            elif name == "update_tower":
                return await self.update_tower(arguments or {})
            elif name == "delete_tower":
                return await self.delete_tower(arguments or {})
            elif name == "analyze_coverage":
                return await self.analyze_coverage(arguments or {})
            else:
                raise ValueError(f"Unknown tool: {name}")
        except Exception as e:
            return self._error_response(e)

    async def get_all_towers(self) -> list[types.TextContent]:
        """Retrieve all cell towers"""
        logger.info("Fetching all towers")
        data = await self.api_client.get("")
        return [types.TextContent(type="text", text=json.dumps(data, indent=2))]

    async def get_towers_paged(self, args: dict) -> list[types.TextContent]:
        """Get towers with pagination and sorting"""
        logger.info(f"Fetching towers with pagination: {args}")
        params = {
            "page": args.get("page", 0),
            "size": args.get("size", 50),
            "sortBy": args.get("sort_by", "id"),
            "sortDirection": args.get("sort_direction", "asc"),
        }
        data = await self.api_client.get("/paged", params=params)
        return [types.TextContent(type="text", text=json.dumps(data, indent=2))]

    async def get_tower_by_id(self, args: dict) -> list[types.TextContent]:
        """Retrieve a specific tower by ID"""
        tower_id = args.get("id")
        if tower_id is None:
            raise ValueError("id parameter is required")
        logger.info(f"Fetching tower {tower_id}")
        data = await self.api_client.get(f"/{tower_id}")
        return [types.TextContent(type="text", text=json.dumps(data, indent=2))]

    async def get_towers_by_radio(self, args: dict) -> list[types.TextContent]:
        """Filter towers by radio type"""
        radio = args.get("radio")
        if not radio:
            raise ValueError("radio parameter is required")
        logger.info(f"Fetching towers with radio type: {radio}")
        data = await self.api_client.get(f"/radio/{radio}")
        return [types.TextContent(type="text", text=json.dumps(data, indent=2))]

    async def get_towers_by_mcc(self, args: dict) -> list[types.TextContent]:
        """Filter towers by Mobile Country Code"""
        mcc = args.get("mcc")
        if mcc is None:
            raise ValueError("mcc parameter is required")
        logger.info(f"Fetching towers with MCC: {mcc}")
        data = await self.api_client.get(f"/mcc/{mcc}")
        return [types.TextContent(type="text", text=json.dumps(data, indent=2))]

    async def get_towers_by_location(self, args: dict) -> list[types.TextContent]:
        """Get towers within a geographic bounding box"""
        required_params = ["min_lon", "max_lon", "min_lat", "max_lat"]
        if not all(param in args for param in required_params):
            raise ValueError(f"All parameters required: {required_params}")
        
        logger.info(f"Fetching towers by location: {args}")
        params = {
            "minLon": args["min_lon"],
            "maxLon": args["max_lon"],
            "minLat": args["min_lat"],
            "maxLat": args["max_lat"],
        }
        data = await self.api_client.get("/location", params=params)
        return [types.TextContent(type="text", text=json.dumps(data, indent=2))]

    async def get_towers_by_signal_range(self, args: dict) -> list[types.TextContent]:
        """Filter towers by signal strength range"""
        required_params = ["min_signal", "max_signal"]
        if not all(param in args for param in required_params):
            raise ValueError(f"All parameters required: {required_params}")
        
        logger.info(f"Fetching towers by signal range: {args}")
        params = {
            "minSignal": args["min_signal"],
            "maxSignal": args["max_signal"],
        }
        data = await self.api_client.get("/signal", params=params)
        return [types.TextContent(type="text", text=json.dumps(data, indent=2))]

    async def get_towers_by_min_samples(self, args: dict) -> list[types.TextContent]:
        """Filter towers by minimum number of samples"""
        min_samples = args.get("min_samples")
        if min_samples is None:
            raise ValueError("min_samples parameter is required")
        logger.info(f"Fetching towers with min samples: {min_samples}")
        data = await self.api_client.get(f"/samples/{min_samples}")
        return [types.TextContent(type="text", text=json.dumps(data, indent=2))]

    async def create_tower(self, args: dict) -> list[types.TextContent]:
        """Create a new tower entry"""
        required_params = ["radio", "mcc", "net", "area", "cell", "lon", "lat"]
        if not all(param in args for param in required_params):
            raise ValueError(f"All parameters required: {required_params}")
        
        logger.info(f"Creating new tower: {args}")
        data = await self.api_client.post("", json_data=args)
        return [types.TextContent(
            type="text",
            text=f"Tower created successfully:\n{json.dumps(data, indent=2)}"
        )]

    async def update_tower(self, args: dict) -> list[types.TextContent]:
        """Update an existing tower"""
        tower_id = args.get("id")
        updates = args.get("updates")
        
        if tower_id is None or updates is None:
            raise ValueError("id and updates parameters are required")
        
        logger.info(f"Updating tower {tower_id}: {updates}")
        data = await self.api_client.patch(f"/{tower_id}", json_data=updates)
        return [types.TextContent(
            type="text",
            text=f"Tower updated successfully:\n{json.dumps(data, indent=2)}"
        )]

    async def delete_tower(self, args: dict) -> list[types.TextContent]:
        """Delete a tower"""
        tower_id = args.get("id")
        if tower_id is None:
            raise ValueError("id parameter is required")
        
        logger.info(f"Deleting tower {tower_id}")
        await self.api_client.delete(f"/{tower_id}")
        return [types.TextContent(type="text", text=f"Tower {tower_id} deleted successfully")]

    async def analyze_coverage(self, args: dict) -> list[types.TextContent]:
        """Analyze tower coverage statistics"""
        logger.info(f"Analyzing coverage with filters: {args}")
        
        # Determine which filter to apply
        if "radio" in args:
            towers = await self.api_client.get(f"/radio/{args['radio']}")
        elif all(k in args for k in ["min_lon", "max_lon", "min_lat", "max_lat"]):
            params = {
                "minLon": args["min_lon"],
                "maxLon": args["max_lon"],
                "minLat": args["min_lat"],
                "maxLat": args["max_lat"],
            }
            towers = await self.api_client.get("/location", params=params)
        else:
            towers = await self.api_client.get("")
        
        # Analyze the data
        if not towers:
            return [types.TextContent(type="text", text="No towers found matching the criteria")]
        
        analysis = self._compute_coverage_analysis(towers)
        return [types.TextContent(type="text", text=json.dumps(analysis, indent=2))]

    @staticmethod
    def _compute_coverage_analysis(towers: list[dict]) -> dict[str, Any]:
        """Compute coverage statistics from tower data"""
        if not towers:
            return {}
        
        signal_values = [t.get("averageSignal", 0) for t in towers]
        sample_values = [t.get("samples", 0) for t in towers]
        
        analysis = {
            "total_towers": len(towers),
            "radio_distribution": {},
            "signal_stats": {
                "average": sum(signal_values) / len(signal_values),
                "strongest": max(signal_values),
                "weakest": min(signal_values),
            },
            "sample_stats": {
                "total_samples": sum(sample_values),
                "avg_samples_per_tower": sum(sample_values) / len(towers),
            },
        }
        
        # Calculate radio distribution
        for tower in towers:
            radio = tower.get("radio", "Unknown")
            analysis["radio_distribution"][radio] = analysis["radio_distribution"].get(radio, 0) + 1
        
        return analysis

    @staticmethod
    def _error_response(error: Exception) -> list[types.TextContent]:
        """Format error response"""
        error_msg = str(error)
        logger.error(f"Tool execution error: {error_msg}")
        return [types.TextContent(type="text", text=f"Error: {error_msg}")]
