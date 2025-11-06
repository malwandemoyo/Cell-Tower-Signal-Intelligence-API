# MCPHackathon
Our MCP hackathon repo
# 📡 Cell Tower Signal Intelligence API


#video


# 🎥 Project Demonstration

> Watch our live demo of the **Cell Tower Signal Intelligence API & Dashboard**

| Demo | Description |
|------|--------------|
| ▶️ [Demo 1 – API Overview](./06.11.2025_21.11.03_REC.mp4) | Introduction and system architecture |
| ▶️ [Demo 2 – Frontend UI Walkthrough](./06.11.2025_21.14.35_REC.mp4) | Dashboard and interactive map |
| ▶️ [Demo 3 – API + Map Integration](./06.11.2025_21.23.04_REC.mp4) | Real-time data and analytics demo |
| ▶️ [Demo 4 – Final Showcase](./06.11.2025_21.45.11_REC.mp4) | Complete workflow and results summary |

---

# MCPHackathon
Our MCP hackathon repo

















A comprehensive RESTful API for managing and analyzing cell tower data with advanced querying capabilities, geolocation filtering, and signal strength analytics.

## 🌟 Key Features

### 🎯 Core Capabilities
| Feature | Description |
|---------|-------------|
| 📊 **Comprehensive CRUD** | Full create, read, update, delete operations |
| 🗺️ **Geolocation Filtering** | Bounding box queries for location-based searches |
| 📡 **Signal Analytics** | Filter by signal strength ranges and sample counts |
| 🔍 **Advanced Querying** | Search by radio type, MCC, and combined filters |
| 📄 **Pagination Support** | Efficient data retrieval with customizable page sizes |

### 📱 Supported Radio Types
- **LTE** - Long-Term Evolution (4G)
- **GSM** - Global System for Mobile Communications (2G)
- **UMTS** - Universal Mobile Telecommunications System (3G)
- **CDMA** - Code Division Multiple Access

---

## 🛠️ Tech Stack

### Backend
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.5.7-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)
![Spring Data JPA](https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white)

### Database
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### Additional Technologies
![REST API](https://img.shields.io/badge/REST_API-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-Enabled-brightgreen?style=for-the-badge)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)

---

## 📂 Data Model

### CellTower Object Structure

```json
{
  "id": 1,
  "radio": "LTE",
  "mcc": 655,
  "net": 10,
  "area": 1234,
  "cell": 5678,
  "unit": 0,
  "lon": 25.1234,
  "lat": -30.5678,
  "range": 1000,
  "samples": 50,
  "changeable": 1,
  "created": "2024-01-15T10:30:00",
  "updated": "2024-01-20T14:45:00",
  "averageSignal": -85
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `id` | Long | Database primary key |
| `radio` | String | Radio technology type |
| `mcc` | Integer | Mobile Country Code |
| `net` | Integer | Network code |
| `area` | Integer | Location Area Code |
| `cell` | Integer | Cell ID |
| `lon` | Double | Longitude coordinate |
| `lat` | Double | Latitude coordinate |
| `range` | Integer | Estimated range in meters |
| `samples` | Integer | Number of samples collected |
| `averageSignal` | Integer | Average signal strength (dBm) |

---

## 🚀 Quick Start

### Prerequisites

```bash
pip install requests
```

### Basic Usage

```python
from cell_tower_api import CellTowerAPI

# Initialize client
api = CellTowerAPI(base_url="http://localhost:8080")

# Get all LTE towers
lte_towers = api.get_towers_by_radio("LTE")

# Search by location (bounding box)
towers = api.get_towers_by_location(
    min_lon=25.0, max_lon=26.0,
    min_lat=-31.0, max_lat=-30.0
)

# Get towers with strong signals
strong_signal = api.get_towers_by_signal_range(-70, -50)
```

---

## 📡 API Endpoints

### Base URL
```
http://your-server:port/api/cell-towers
```

### CREATE Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/cell-towers` | Create single tower |
| `POST` | `/api/cell-towers/batch` | Create multiple towers |

### READ Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/cell-towers` | Get all towers |
| `GET` | `/api/cell-towers/paged` | Paginated results |
| `GET` | `/api/cell-towers/{id}` | Get by database ID |
| `GET` | `/api/cell-towers/cell/{cellId}` | Get by cell ID |
| `GET` | `/api/cell-towers/radio/{radio}` | Filter by radio type |
| `GET` | `/api/cell-towers/mcc/{mcc}` | Filter by country code |
| `GET` | `/api/cell-towers/location` | Bounding box search |
| `GET` | `/api/cell-towers/signal` | Signal strength range |
| `GET` | `/api/cell-towers/samples/{min}` | Minimum samples filter |

### UPDATE Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/api/cell-towers/{id}` | Full replacement |
| `PATCH` | `/api/cell-towers/{id}` | Partial update |

### DELETE Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `DELETE` | `/api/cell-towers/{id}` | Delete single tower |
| `DELETE` | `/api/cell-towers` | Delete all towers ⚠️ |

---

## 🔍 Query Examples

### Pagination with Sorting

```bash
GET /api/cell-towers/paged?page=0&size=50&sortBy=averageSignal&sortDirection=desc
```

### Location-Based Search

```bash
GET /api/cell-towers/location?minLon=25.0&maxLon=26.0&minLat=-31.0&maxLat=-30.0
```

### Combined Filters

```bash
GET /api/cell-towers/radio/LTE/mcc/655
```

### Signal Strength Analysis

```bash
GET /api/cell-towers/signal?minSignal=-90&maxSignal=-70
```

---

## 🐍 Python Client

### Installation

```python
import requests
from typing import List, Dict, Optional

class CellTowerAPI:
    def __init__(self, base_url: str = "http://localhost:8080"):
        self.base_url = base_url.rstrip('/')
        self.api_url = f"{self.base_url}/api/cell-towers"
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    def get_all_towers(self) -> List[Dict]:
        """Get all cell towers"""
        response = self.session.get(self.api_url)
        return response.json() if response.status_code == 200 else []
    
    # ... (see full implementation in documentation)
```

### Usage Example

```python
# Initialize API client
api = CellTowerAPI("http://your-server:8080")

# Create a new tower
new_tower = {
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
result = api.create_tower(new_tower)

# Batch create
towers = [tower1, tower2, tower3]
api.create_towers_batch(towers)

# Query with pagination
paged_result = api.get_towers_paged(page=0, size=100, sort_by="mcc")

# Location-based search
nearby_towers = api.get_towers_by_location(
    min_lon=24.5, max_lon=25.5,
    min_lat=-31.5, max_lat=-30.5
)

# Update tower
api.partial_update_tower(tower_id=1, tower_data={"averageSignal": -80})

# Delete tower
api.delete_tower(tower_id=1)
```

---

## 📊 HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200 OK` | Request successful, data returned |
| `201 CREATED` | Resource created successfully |
| `204 NO CONTENT` | Success but no data (empty/deleted) |
| `404 NOT FOUND` | Resource not found |
| `500 INTERNAL SERVER ERROR` | Server error occurred |

---

## 🎯 Use Cases

### 📱 Network Planning
- Analyze tower coverage by radio type
- Identify signal strength gaps
- Optimize tower placement

### 🗺️ Geospatial Analysis
- Map tower distribution by region
- Perform proximity searches
- Analyze coverage overlaps

### 📈 Performance Monitoring
- Track signal quality trends
- Identify low-performing towers
- Monitor sample collection rates

---

## ⚙️ Configuration

### CORS Settings
The API has CORS enabled for all origins by default. No special configuration needed for cross-origin requests.

### Base URL Configuration
Update the base URL when initializing the Python client:

```python
# Development
api = CellTowerAPI("http://localhost:8080")

# Production
api = CellTowerAPI("https://api.example.com")
```

---

## 🤝 Contributing

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)

This project is licensed under the MIT License - see the LICENSE file for details.

---
## 🎓 Best Practices

### Performance Tips
- Use pagination for large datasets (`/paged` endpoints)
- Cache frequently accessed data
- Use specific filters to reduce response size

### Security Considerations
- Validate all input data before submission
- Use HTTPS in production environments
- Implement rate limiting on client side

### Error Handling
```python
try:
    towers = api.get_all_towers()
except requests.exceptions.RequestException as e:
    print(f"API Error: {e}")
```

---

**Built for Network Engineers and Data Analysts**
