# Refactored Code Examples

## Example 1: Adding a New Tool

### Step 1: Define the Tool in `tool_definitions.py`

```python
@staticmethod
def get_signal_heatmap() -> types.Tool:
    """Get signal strength heatmap for geographic area"""
    return types.Tool(
        name="get_signal_heatmap",
        description="Generate signal strength heatmap for a geographic region",
        inputSchema={
            "type": "object",
            "properties": {
                "min_lon": {"type": "number", "description": "Minimum longitude"},
                "max_lon": {"type": "number", "description": "Maximum longitude"},
                "min_lat": {"type": "number", "description": "Minimum latitude"},
                "max_lat": {"type": "number", "description": "Maximum latitude"},
                "grid_size": {"type": "integer", "description": "Grid cell size in meters"},
            },
            "required": ["min_lon", "max_lon", "min_lat", "max_lat"],
        },
    )
```

Then add to `get_all_tools()`:
```python
@classmethod
def get_all_tools(cls) -> list[types.Tool]:
    """Get all tool definitions"""
    return [
        # ... existing tools ...
        cls.get_signal_heatmap(),  # Add new tool
    ]
```

### Step 2: Implement Handler in `tool_handler.py`

```python
async def get_signal_heatmap(self, args: dict) -> list[types.TextContent]:
    """Generate signal strength heatmap"""
    required_params = ["min_lon", "max_lon", "min_lat", "max_lat"]
    if not all(param in args for param in required_params):
        raise ValueError(f"All parameters required: {required_params}")
    
    logger.info(f"Generating heatmap for bounds: {args}")
    
    # Fetch towers in region
    params = {
        "minLon": args["min_lon"],
        "maxLon": args["max_lon"],
        "minLat": args["min_lat"],
        "maxLat": args["max_lat"],
    }
    towers = await self.api_client.get("/location", params=params)
    
    # Generate heatmap data
    heatmap = self._generate_heatmap(towers, args.get("grid_size", 1000))
    
    return [types.TextContent(type="text", text=json.dumps(heatmap, indent=2))]

@staticmethod
def _generate_heatmap(towers: list[dict], grid_size: int) -> dict:
    """Generate heatmap from tower data"""
    # Implementation here
    return {"cells": [], "metadata": {}}
```

Then add routing in `handle_tool()`:
```python
elif name == "get_signal_heatmap":
    return await self.get_signal_heatmap(arguments or {})
```

## Example 2: Custom Error Handling

### In `exceptions.py`
```python
class AreaNotFoundError(CellTowerAPIError):
    """Raised when geographic area has no tower data"""
    pass
```

### In `tool_handler.py`
```python
async def get_signal_heatmap(self, args: dict) -> list[types.TextContent]:
    """Generate signal strength heatmap"""
    try:
        towers = await self.api_client.get("/location", params=params)
        
        if not towers:
            raise AreaNotFoundError(
                f"No towers found in area ({args['min_lon']}, {args['max_lon']})"
            )
        
        heatmap = self._generate_heatmap(towers, args.get("grid_size"))
        return [types.TextContent(type="text", text=json.dumps(heatmap, indent=2))]
    
    except AreaNotFoundError as e:
        logger.warning(f"Area not found: {e}")
        return [types.TextContent(type="text", text=f"No data available: {e.message}")]
    
    except Exception as e:
        logger.error(f"Heatmap generation failed: {e}", exc_info=True)
        return self._error_response(e)
```

## Example 3: Using Configuration

### In `config.py`
```python
# Add new configuration
HEATMAP_DEFAULT_GRID_SIZE: Final[int] = 1000
HEATMAP_MAX_CELLS: Final[int] = 10000
```

### In `tool_handler.py`
```python
from config import HEATMAP_DEFAULT_GRID_SIZE, HEATMAP_MAX_CELLS

async def get_signal_heatmap(self, args: dict) -> list[types.TextContent]:
    grid_size = args.get("grid_size", HEATMAP_DEFAULT_GRID_SIZE)
    
    # Validate against config
    if grid_size < 100:
        raise ValueError("Grid size must be at least 100 meters")
    
    heatmap = self._generate_heatmap(towers, grid_size)
    
    if len(heatmap["cells"]) > HEATMAP_MAX_CELLS:
        logger.warning(f"Heatmap exceeded max cells: {len(heatmap['cells'])}")
```

## Example 4: Testing Individual Modules

### Test API Client
```python
import asyncio
from api_client import APIClient

async def test_api_client():
    client = APIClient()
    
    try:
        # Test GET request
        data = await client.get("")
        print(f"Got {len(data)} towers")
        
        # Test GET with params
        params = {"page": 0, "size": 10}
        paged_data = await client.get("/paged", params=params)
        print(f"Paged response: {paged_data}")
        
    finally:
        await client.close()

asyncio.run(test_api_client())
```

### Test Tool Handler
```python
import asyncio
from tool_handler import ToolHandler

async def test_tool_handler():
    handler = ToolHandler()
    
    # Test get_all_towers
    result = await handler.get_all_towers()
    print(f"Result: {result[0].text[:100]}...")
    
    # Test get_tower_by_id
    result = await handler.get_tower_by_id({"id": 1})
    print(f"Tower result: {result[0].text[:100]}...")

asyncio.run(test_tool_handler())
```

### Test Tool Definitions
```python
from tool_definitions import ToolDefinitions

# Test tool definitions
tools = ToolDefinitions.get_all_tools()
print(f"Available tools: {len(tools)}")
for tool in tools:
    print(f"  - {tool.name}: {tool.description}")
```

## Example 5: Extending with Caching

### Create `cache.py` (new module)
```python
"""Simple caching layer for API responses"""
import json
from typing import Any, Optional
import hashlib

class ResponseCache:
    """In-memory cache for API responses"""
    
    def __init__(self, max_age: int = 300):
        self.cache: dict[str, tuple[Any, int]] = {}
        self.max_age = max_age
    
    def get(self, key: str) -> Optional[Any]:
        """Get cached response"""
        if key in self.cache:
            data, timestamp = self.cache[key]
            # Check if cache is still valid
            import time
            if time.time() - timestamp < self.max_age:
                return data
            else:
                del self.cache[key]
        return None
    
    def set(self, key: str, value: Any) -> None:
        """Cache response"""
        import time
        self.cache[key] = (value, time.time())
    
    @staticmethod
    def make_key(endpoint: str, params: dict) -> str:
        """Create cache key from endpoint and params"""
        key_str = f"{endpoint}:{json.dumps(params, sort_keys=True)}"
        return hashlib.md5(key_str.encode()).hexdigest()
```

### Update `api_client.py`
```python
from cache import ResponseCache

class APIClient:
    def __init__(self):
        self.cache = ResponseCache(max_age=300)
    
    async def get(self, endpoint: str, **kwargs) -> dict:
        """Make GET request with caching"""
        cache_key = ResponseCache.make_key(endpoint, kwargs.get("params", {}))
        
        # Check cache first
        cached = self.cache.get(cache_key)
        if cached:
            logger.info(f"Cache hit for {endpoint}")
            return cached
        
        # Fetch from API
        try:
            client = await self.get_client()
            response = await client.get(endpoint, **kwargs)
            response.raise_for_status()
            data = response.json()
            
            # Store in cache
            self.cache.set(cache_key, data)
            return data
        except Exception as e:
            logger.error(f"GET {endpoint} failed: {e}")
            raise
```

## Example 6: Adding Metrics

### Update `tool_handler.py`
```python
import time
from collections import defaultdict

class ToolHandler:
    def __init__(self):
        self.api_client = APIClient()
        self.metrics = {
            "tool_calls": defaultdict(int),
            "tool_times": defaultdict(list),
            "tool_errors": defaultdict(int),
        }
    
    async def handle_tool(self, name: str, arguments: dict) -> list:
        """Handle tool execution with metrics"""
        start_time = time.time()
        self.metrics["tool_calls"][name] += 1
        
        try:
            result = await getattr(self, name.replace("-", "_"))(arguments or {})
            duration = time.time() - start_time
            self.metrics["tool_times"][name].append(duration)
            logger.info(f"Tool {name} completed in {duration:.2f}s")
            return result
        
        except Exception as e:
            self.metrics["tool_errors"][name] += 1
            logger.error(f"Tool {name} failed: {e}")
            return self._error_response(e)
    
    def get_metrics(self) -> dict:
        """Get tool metrics"""
        return {
            "calls": dict(self.metrics["tool_calls"]),
            "errors": dict(self.metrics["tool_errors"]),
            "avg_times": {
                name: sum(times) / len(times)
                for name, times in self.metrics["tool_times"].items()
            }
        }
```

## Example 7: Configuration from Environment

### Update `config.py`
```python
import os
from typing import Final

# Load from environment with defaults
API_BASE_URL: Final[str] = os.getenv(
    "CELL_TOWER_API_URL",
    "http://localhost:8080/api/cell-towers"
)
DEFAULT_TIMEOUT: Final[float] = float(os.getenv(
    "CELL_TOWER_TIMEOUT",
    "30.0"
))
```

### Usage
```bash
# Run with environment variables
export CELL_TOWER_API_URL="http://api.example.com/towers"
export CELL_TOWER_TIMEOUT="60"
python main.py
```

---

These examples show how the refactored code makes it easy to:
- ✅ Add new features
- ✅ Extend functionality
- ✅ Handle errors gracefully
- ✅ Test components
- ✅ Maintain and debug
- ✅ Scale and optimize
