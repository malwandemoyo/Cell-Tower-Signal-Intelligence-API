# MCP Tool - Refactored Module Quick Reference

## File Organization

```
mcp_tool/
├── main.py                 # Server entry point and lifecycle
├── config.py              # Configuration constants
├── exceptions.py          # Custom exception classes
├── api_client.py          # HTTP client management
├── tool_definitions.py    # Tool metadata and schemas
├── tool_handler.py        # Tool execution logic
└── REFACTORING.md         # Detailed architecture documentation
```

## Module Dependencies

```
main.py
  ├── imports: config, tool_definitions, tool_handler
  ├── ToolHandler (from tool_handler)
  └── ToolDefinitions (from tool_definitions)

tool_handler.py
  ├── imports: api_client
  └── APIClient (from api_client)

api_client.py
  ├── imports: config, exceptions
  ├── APIClient class (singleton)
  └── Uses: APIConnectionError (from exceptions)

tool_definitions.py
  └── imports: mcp.types only

exceptions.py
  └── Custom exception classes only

config.py
  └── Configuration constants only
```

## How to Add a New Tool

### 1. Update `tool_definitions.py`
Add a new static method to `ToolDefinitions` class:

```python
@staticmethod
def my_new_tool() -> types.Tool:
    """Description of your tool"""
    return types.Tool(
        name="my_new_tool",
        description="What this tool does",
        inputSchema={
            "type": "object",
            "properties": {
                "param1": {"type": "string", "description": "Parameter description"},
            },
            "required": ["param1"],
        },
    )
```

Then add it to `get_all_tools()` method.

### 2. Update `tool_handler.py`
Add a handler method to `ToolHandler` class:

```python
async def my_new_tool(self, args: dict) -> list[types.TextContent]:
    """Handle my_new_tool execution"""
    param1 = args.get("param1")
    if not param1:
        raise ValueError("param1 is required")
    
    logger.info(f"Processing my_new_tool with param1: {param1}")
    data = await self.api_client.get(f"/my-endpoint/{param1}")
    return [types.TextContent(type="text", text=json.dumps(data, indent=2))]
```

Then add the routing in `handle_tool()` method:

```python
elif name == "my_new_tool":
    return await self.my_new_tool(arguments or {})
```

## Common Tasks

### Modify API Configuration
Edit `config.py`:
```python
API_BASE_URL = "http://new-host:8080/api/cell-towers"
DEFAULT_TIMEOUT = 60.0
```

### Add Logging
Already configured in `main.py`. Use in any module:
```python
logger = logging.getLogger(__name__)
logger.info("Message here")
logger.error("Error here", exc_info=True)
```

### Handle API Errors
Use custom exceptions from `exceptions.py`:
```python
from exceptions import APIConnectionError, APIValidationError

try:
    data = await self.api_client.get("/endpoint")
except APIConnectionError as e:
    logger.error(f"Connection failed: {e}")
except Exception as e:
    logger.error(f"Unexpected error: {e}")
```

### Access HTTP Client
From `tool_handler.py`:
```python
from api_client import APIClient

client = APIClient()
data = await client.get("/endpoint")
data = await client.post("/endpoint", json_data={"key": "value"})
data = await client.patch("/endpoint/id", json_data=updates)
await client.delete("/endpoint/id")
```

## Testing

Each module can be tested independently:

```python
# Test API client
from api_client import APIClient
client = APIClient()

# Test tool handler
from tool_handler import ToolHandler
handler = ToolHandler()
result = await handler.get_all_towers()

# Test tool definitions
from tool_definitions import ToolDefinitions
tools = ToolDefinitions.get_all_tools()
```

## Logging Output

The server logs to stderr with format:
```
2024-11-19 10:30:45,123 - __main__ - INFO - Starting cell-tower-intelligence v1.0.0
2024-11-19 10:30:45,234 - tool_handler - INFO - Tool called: get_all_towers
2024-11-19 10:30:45,345 - api_client - INFO - Fetching all towers
```

## Performance Considerations

1. **HTTP Client Singleton**: Reuses connection pool
2. **Async/Await**: Non-blocking I/O operations
3. **Error Handling**: Fail fast with proper error messages
4. **Logging**: Structured logging for monitoring

## Security Considerations

1. Add authentication headers in `config.py`
2. Validate all inputs in handler methods
3. Log security-relevant events
4. Use HTTPS in production
5. Add rate limiting in `api_client.py` if needed
