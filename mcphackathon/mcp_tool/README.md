# 📡 Cell Tower Signal Intelligence MCP Server

**Model Context Protocol (MCP) Server for Cell Tower Data**

This repository contains an MCP server (`main.py`) that acts as a bridge, allowing AI assistants and large language models to securely and efficiently access and analyze **Cell Tower Signal Intelligence API** data. By exposing API functionality through standard MCP tools, the server enables powerful, context-aware queries and analysis directly within the AI's operational context.

---

## 🌟 Features of the MCP Server

The MCP server translates the API's comprehensive capabilities into a set of structured, callable tools for AI assistants.

| MCP Tool Name | Description | Corresponding API Feature |
| :--- | :--- | :--- |
| `get_all_towers` | Retrieve all cell towers in the database. | `GET /api/cell-towers` |
| `get_towers_paged` | Efficiently retrieve cell towers with **pagination and sorting**. | `GET /api/cell-towers/paged` |
| `get_tower_by_id` | Get a specific cell tower by its **database ID**. | `GET /api/cell-towers/{id}` |
| `get_towers_by_radio` | Filter cell towers by **radio technology** (LTE, GSM, UMTS, CDMA). | `GET /api/cell-towers/radio/{radio}` |
| `get_towers_by_mcc` | Filter cell towers by **Mobile Country Code (MCC)**. | `GET /api/cell-towers/mcc/{mcc}` |
| `get_towers_by_location` | Search towers within a **geographic bounding box**. | `GET /api/cell-towers/location` |
| `get_towers_by_signal_range` | Filter towers by **average signal strength (dBm)** range. | `GET /api/cell-towers/signal` |
| `get_towers_by_min_samples` | Filter towers by minimum number of **samples collected**. | `GET /api/cell-towers/samples/{min}` |
| `create_tower` | Create a **new cell tower** entry. | `POST /api/cell-towers` |
| `update_tower` | Perform a **partial update** on an existing cell tower's fields. | `PATCH /api/cell-towers/{id}` |
| `delete_tower` | **Delete** a cell tower by its database ID. | `DELETE /api/cell-towers/{id}` |
| `analyze_coverage` | A composite tool to perform **coverage statistics analysis** (total towers, radio distribution, signal stats) based on optional radio or location filters. | Custom Analysis |

---

## 🛠️ Setup and Running

### Prerequisites

1.  **Python 3.8+**
2.  The **Cell Tower Signal Intelligence API** server must be running and accessible at the configured `API_BASE_URL` (default: `http://localhost:8080/api/cell-towers`).

### Dependencies (Requirements)

pip install -r requirements.txt
* `httpx`

You can install them directly using pip:

```bash
pip install mcp httpx
