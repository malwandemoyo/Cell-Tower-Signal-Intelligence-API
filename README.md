# 📡 Cell Tower Signal Intelligence Full System Documentation

A complete ecosystem consisting of:

- **MCP Tool Server** - Bridges LLM assistants to the Cell Tower Intelligence API  
- **Backend API** - Spring Boot REST API for geospatial telecom tower data  
- **Frontend Dashboard** - React-based analytics dashboard for visualization & AI insights  

# 🎥 Project Demonstration

> Watch our live demo of the **Cell Tower Signal Intelligence API & Dashboard**

| Demo                                                         | Description                           |
| ------------------------------------------------------------ | ------------------------------------- |
| ▶️ [Demo 1 – API Overview](./demo_videos/06.11.2025_21.11.03_REC.mp4) | Introduction and system architecture  |
| ▶️ [Demo 2 – Frontend UI Walkthrough](./demo_videos/06.11.2025_21.14.35_REC.mp4) | Dashboard and interactive map         |
| ▶️ [Demo 3 – API + Map Integration](./demo_videos/06.11.2025_21.23.04_REC.mp4) | Real-time data and analytics demo     |
| ▶️ [Demo 4 – Final Showcase](./demo_videos/06.11.2025_21.45.11_REC.mp4) | Complete workflow and results summary |

--

---

# Architecture Overview

```
+-----------------------------+
|          Frontend           |
|  React + TS + Google Maps   |
|  AI Insights Dashboard      |
+---------------+-------------+
                |
                | REST API
                v
+-----------------------------+
|           Backend           |
|  Spring Boot API            |
|  PostgreSQL Database        |
|  Advanced Query & Analytics |
+---------------+-------------+
                |
                | MCP Tools
                v
+-----------------------------+
|          MCP Tool           |
|  Exposes API to LLMs        |
|  Tools: get_towers, search… |
+-----------------------------+
```

---

# 🎥 Project Demonstrations

The repository includes mp4 demonstration videos:

- API Overview  
- Frontend UI Walkthrough  
- API + Map Integration  
- Final Showcase  

---

# 1. MCP TOOL - Model Context Protocol Server

The MCP server exposes controlled API access for **AI assistants**, allowing them to query towers, perform coverage analysis, and update telecom data.

## ✨ MCP Features → API Features

| MCP Tool | Description | API Endpoint |
|----------|-------------|--------------|
| get_all_towers | Retrieve all towers | GET /api/cell-towers |
| get_towers_paged | Pagination + sorting | GET /api/cell-towers/paged |
| get_tower_by_id | Fetch tower by DB ID | GET /api/cell-towers/{id} |
| get_towers_by_radio | LTE/GSM/UMTS/CDMA | GET /api/cell-towers/radio/{radio} |
| get_towers_by_mcc | Filter by MCC | GET /api/cell-towers/mcc/{mcc} |
| get_towers_by_location | Bounding-box geo search | GET /api/cell-towers/location |
| get_towers_by_signal_range | Filter by dBm | GET /api/cell-towers/signal |
| get_towers_by_min_samples | Filter by sample count | GET /api/cell-towers/samples/{min} |
| create_tower | Create tower | POST /api/cell-towers |
| update_tower | Partial update | PATCH /api/cell-towers/{id} |
| delete_tower | Delete tower | DELETE /api/cell-towers/{id} |
| analyze_coverage | Composite statistics | Custom tool |

---

# 2. BACKEND - Cell Tower Signal Intelligence API

A robust **Spring Boot + PostgreSQL** backend providing telecom tower storage, filtering, analytics, and integration.

### Features
- Full CRUD operations  
- Geolocation-based filtering  
- Signal strength analytics  
- Pagination and sorting  
- Batch operations  

Example object:

```json
{
  "id": 1,
  "radio": "LTE",
  "mcc": 655,
  "net": 10,
  "area": 1234,
  "cell": 5678,
  "lon": 25.1234,
  "lat": -30.5678,
  "range": 1000,
  "samples": 50,
  "averageSignal": -85
}
```

---

# 3. FRONTEND - Network Analytics Dashboard

A **React + TypeScript + Vite** dashboard featuring:

- Interactive Google Maps  
- Tower filtering interface  
- AI signal insights  
- Mobile-responsive layout  
- Data export tools  

---

# 📂 Project Structure

```
/
├── demo_videos/
├── mcp_tool/
│   └── main.py
├── backend/
│   └── src/
├── frontend/
│   ├── public/demo-png/
│   └── src/
└── README.md
```
