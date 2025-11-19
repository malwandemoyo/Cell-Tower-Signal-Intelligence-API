"""
Tool definitions for Cell Tower Signal Intelligence MCP Server
Defines all available MCP tools and their schemas
"""

import mcp.types as types


class ToolDefinitions:
    """Tool definitions for cell tower analysis"""

    @staticmethod
    def get_all_towers() -> types.Tool:
        """Retrieve all cell towers in the database"""
        return types.Tool(
            name="get_all_towers",
            description="Retrieve all cell towers in the database. Use with caution for large datasets.",
            inputSchema={
                "type": "object",
                "properties": {},
            },
        )

    @staticmethod
    def get_towers_paged() -> types.Tool:
        """Get cell towers with pagination and sorting"""
        return types.Tool(
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
        )

    @staticmethod
    def get_tower_by_id() -> types.Tool:
        """Get a specific cell tower by its database ID"""
        return types.Tool(
            name="get_tower_by_id",
            description="Get a specific cell tower by its database ID",
            inputSchema={
                "type": "object",
                "properties": {
                    "id": {"type": "integer", "description": "Database ID of the tower"},
                },
                "required": ["id"],
            },
        )

    @staticmethod
    def get_towers_by_radio() -> types.Tool:
        """Filter cell towers by radio technology type"""
        return types.Tool(
            name="get_towers_by_radio",
            description="Filter cell towers by radio technology type (LTE, GSM, UMTS, CDMA)",
            inputSchema={
                "type": "object",
                "properties": {
                    "radio": {"type": "string", "description": "Radio type: LTE, GSM, UMTS, or CDMA"},
                },
                "required": ["radio"],
            },
        )

    @staticmethod
    def get_towers_by_mcc() -> types.Tool:
        """Filter cell towers by Mobile Country Code"""
        return types.Tool(
            name="get_towers_by_mcc",
            description="Filter cell towers by Mobile Country Code (MCC)",
            inputSchema={
                "type": "object",
                "properties": {
                    "mcc": {"type": "integer", "description": "Mobile Country Code (e.g., 655 for South Africa)"},
                },
                "required": ["mcc"],
            },
        )

    @staticmethod
    def get_towers_by_location() -> types.Tool:
        """Search towers within a geographic bounding box"""
        return types.Tool(
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
        )

    @staticmethod
    def get_towers_by_signal_range() -> types.Tool:
        """Filter towers by signal strength range"""
        return types.Tool(
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
        )

    @staticmethod
    def get_towers_by_min_samples() -> types.Tool:
        """Filter towers by minimum number of samples"""
        return types.Tool(
            name="get_towers_by_min_samples",
            description="Filter towers by minimum number of samples collected",
            inputSchema={
                "type": "object",
                "properties": {
                    "min_samples": {"type": "integer", "description": "Minimum number of samples"},
                },
                "required": ["min_samples"],
            },
        )

    @staticmethod
    def create_tower() -> types.Tool:
        """Create a new cell tower entry"""
        return types.Tool(
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
        )

    @staticmethod
    def update_tower() -> types.Tool:
        """Update specific fields of an existing cell tower"""
        return types.Tool(
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
        )

    @staticmethod
    def delete_tower() -> types.Tool:
        """Delete a cell tower by its database ID"""
        return types.Tool(
            name="delete_tower",
            description="Delete a cell tower by its database ID",
            inputSchema={
                "type": "object",
                "properties": {
                    "id": {"type": "integer", "description": "Database ID of the tower to delete"},
                },
                "required": ["id"],
            },
        )

    @staticmethod
    def analyze_coverage() -> types.Tool:
        """Analyze tower coverage statistics"""
        return types.Tool(
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
        )

    @classmethod
    def get_all_tools(cls) -> list[types.Tool]:
        """Get all tool definitions"""
        return [
            cls.get_all_towers(),
            cls.get_towers_paged(),
            cls.get_tower_by_id(),
            cls.get_towers_by_radio(),
            cls.get_towers_by_mcc(),
            cls.get_towers_by_location(),
            cls.get_towers_by_signal_range(),
            cls.get_towers_by_min_samples(),
            cls.create_tower(),
            cls.update_tower(),
            cls.delete_tower(),
            cls.analyze_coverage(),
        ]
