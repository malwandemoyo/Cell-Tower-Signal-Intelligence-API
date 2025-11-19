# Module Dependency Diagram & Architecture

## Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                      main.py                                │
│              (Server Entry Point & Lifecycle)               │
│         - Initializes server                                │
│         - Sets up logging                                   │
│         - Registers tool handlers                           │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐   ┌──────────────┐   ┌──────────────┐
   │ config  │   │tool_handler  │   │tool_defs     │
   │ (const) │   │(business)    │   │(metadata)    │
   └─────────┘   └──────┬───────┘   └──────────────┘
                        │
                        ▼
                   ┌────────────┐
                   │api_client  │
                   │(singleton) │
                   └──────┬─────┘
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
          ┌─────────────┐    ┌──────────────┐
          │ config      │    │ exceptions   │
          │(base_url)   │    │(error types) │
          └─────────────┘    └──────────────┘
```

## Data Flow

### 1. Tool Request Flow
```
MCP Client
    │
    ▼
main.py (handle_call_tool)
    │
    ▼
tool_handler.handle_tool()
    │
    ├─→ Route to specific handler
    │   (e.g., get_all_towers)
    │
    ▼
API call via api_client
    │
    ├─→ Use config for URL/timeout
    ├─→ Make HTTP request
    ├─→ Handle errors
    │
    ▼
Return formatted response
    │
    ▼
MCP Client
```

### 2. Error Handling Flow
```
Tool Handler
    │
    ▼
API Client Request
    │
    ├─→ HTTPStatusError
    │       │
    │       ▼
    │   Log Error
    │   Raise HTTPStatusError
    │
    ├─→ Connection Error
    │       │
    │       ▼
    │   Log Error
    │   Raise APIConnectionError
    │
    └─→ Unexpected Error
            │
            ▼
        Log Error
        Format Error Response
    │
    ▼
Return Error to Client
```

## Module Responsibilities

### config.py
```
┌──────────────────────┐
│   Configuration      │
├──────────────────────┤
│ • API_BASE_URL       │
│ • DEFAULT_TIMEOUT    │
│ • SERVER_NAME        │
│ • SERVER_VERSION     │
│ • Pagination         │
│ • HTTP Headers       │
└──────────────────────┘
```

### exceptions.py
```
┌─────────────────────────────┐
│   Exception Hierarchy       │
├─────────────────────────────┤
│ • Exception (Python base)   │
│   ├─ CellTowerAPIError      │
│   │  ├─ APIConnectionError  │
│   │  └─ APIValidationError  │
│   └─ ToolExecutionError     │
└─────────────────────────────┘
```

### api_client.py
```
┌──────────────────────────────┐
│   APIClient (Singleton)      │
├──────────────────────────────┤
│ • _instance                  │
│ • _client                    │
│ • get_client()               │
│ • close()                    │
│ • get(endpoint, **kwargs)    │
│ • post(endpoint, json_data)  │
│ • patch(endpoint, json_data) │
│ • delete(endpoint, **kwargs) │
└──────────────────────────────┘
```

### tool_definitions.py
```
┌──────────────────────────────────┐
│   ToolDefinitions                │
├──────────────────────────────────┤
│ Static Methods:                  │
│ • get_all_towers()               │
│ • get_towers_paged()             │
│ • get_tower_by_id()              │
│ • get_towers_by_radio()          │
│ • get_towers_by_mcc()            │
│ • get_towers_by_location()       │
│ • get_towers_by_signal_range()   │
│ • get_towers_by_min_samples()    │
│ • create_tower()                 │
│ • update_tower()                 │
│ • delete_tower()                 │
│ • analyze_coverage()             │
│ • get_all_tools()                │
└──────────────────────────────────┘
```

### tool_handler.py
```
┌──────────────────────────────────┐
│   ToolHandler                    │
├──────────────────────────────────┤
│ Constructor:                     │
│ • __init__()                     │
│                                  │
│ Public Methods:                  │
│ • handle_tool(name, args)        │
│                                  │
│ Handler Methods:                 │
│ • get_all_towers()               │
│ • get_towers_paged(args)         │
│ • get_tower_by_id(args)          │
│ • get_towers_by_radio(args)      │
│ • get_towers_by_mcc(args)        │
│ • get_towers_by_location(args)   │
│ • get_towers_by_signal_range()   │
│ • get_towers_by_min_samples()    │
│ • create_tower(args)             │
│ • update_tower(args)             │
│ • delete_tower(args)             │
│ • analyze_coverage(args)         │
│                                  │
│ Private Methods:                 │
│ • _compute_coverage_analysis()   │
│ • _error_response()              │
└──────────────────────────────────┘
```

### main.py
```
┌────────────────────────────────┐
│   Server Entry Point           │
├────────────────────────────────┤
│ • Logging Configuration        │
│ • Server Initialization        │
│ • Tool Handler Registration    │
│ • Event Handlers:              │
│   - handle_list_tools()        │
│   - handle_call_tool()         │
│ • main() - Server Loop         │
│ • __main__ - Entry Point       │
└────────────────────────────────┘
```

## Class Instantiation & Usage

```
main.py
│
├─→ server = Server(SERVER_NAME)
│
├─→ tool_handler = ToolHandler()
│       │
│       └─→ self.api_client = APIClient()
│           (Singleton - gets existing instance)
│
└─→ async with mcp.server.stdio.stdio_server()
    └─→ await server.run(...)
```

## Request/Response Cycle

```
1. MCP Client sends request
   ↓
2. main.handle_call_tool(name, args)
   ↓
3. tool_handler.handle_tool(name, args)
   ↓
4. Route to specific handler method
   ↓
5. Handler validates arguments
   ↓
6. api_client.get/post/patch/delete()
   ├─→ Get client from singleton
   ├─→ Configure request
   ├─→ Execute HTTP request
   └─→ Handle errors/parse response
   ↓
7. Format response
   ↓
8. Return to MCP Client
```

## Configuration Flow

```
config.py (Constants)
    ↓
    ├─→ api_client.py (Uses: API_BASE_URL, DEFAULT_TIMEOUT, DEFAULT_HEADERS)
    │
    └─→ tool_handler.py (Uses: DEFAULT_PAGE, DEFAULT_PAGE_SIZE, etc.)
```

## Logging Flow

```
main.py
├─→ Configures logging level, format, stream
│
└─→ All modules use logging.getLogger(__name__)
    ├─→ api_client - Logs API calls and errors
    ├─→ tool_handler - Logs tool execution
    └─→ main - Logs server lifecycle
```

## Type Flow

```
MCP Types (mcp.types)
    ├─→ tool_definitions.py (Creates Tool objects)
    │
    └─→ tool_handler.py (Returns TextContent/ImageContent)
            │
            └─→ main.py (Passes to server)
```

---

**Summary**: Clean layered architecture with clear separation of concerns and single responsibilities per module.
