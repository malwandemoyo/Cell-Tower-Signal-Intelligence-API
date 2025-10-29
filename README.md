# MCPHackathon
Our MCP hackathon repo

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cell Tower Signal Intelligence API Documentation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3 {
            color: #2c3e50;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background-color: #f8f8f8;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border-left: 4px solid #3498db;
        }
        .endpoint {
            background-color: #e8f4f8;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .field-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        .field-table th, .field-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .field-table th {
            background-color: #f2f2f2;
        }
        .note {
            background-color: #fff9e6;
            padding: 10px;
            border-left: 4px solid #ffcc00;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <h1>Cell Tower Signal Intelligence API Documentation</h1>

    <div class="note">
        <strong>API Version:</strong> 1.0<br>
        <strong>Last Updated:</strong> October 2025<br>
        <strong>Support:</strong> For issues, contact your backend team
    </div>

    <h2>Base Information</h2>
    <ul>
        <li><strong>Base URL:</strong> <code>http://your-server:port/api/cell-towers</code></li>
        <li><strong>CORS:</strong> Enabled for all origins</li>
        <li><strong>Content-Type:</strong> <code>application/json</code></li>
    </ul>

    <h2>Data Model</h2>

    <h3>CellTower Object</h3>
    <pre><code>{
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
}</code></pre>

    <h3>Field Descriptions</h3>
    <table class="field-table">
        <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
        <tr>
            <td><code>id</code></td>
            <td>Long</td>
            <td>Database primary key</td>
        </tr>
        <tr>
            <td><code>radio</code></td>
            <td>String</td>
            <td>Radio type (e.g., "LTE", "GSM", "UMTS", "CDMA")</td>
        </tr>
        <tr>
            <td><code>mcc</code></td>
            <td>Integer</td>
            <td>Mobile Country Code</td>
        </tr>
        <tr>
            <td><code>net</code></td>
            <td>Integer</td>
            <td>Network code</td>
        </tr>
        <tr>
            <td><code>area</code></td>
            <td>Integer</td>
            <td>Location Area Code</td>
        </tr>
        <tr>
            <td><code>cell</code></td>
            <td>Integer</td>
            <td>Cell ID</td>
        </tr>
        <tr>
            <td><code>unit</code></td>
            <td>Integer</td>
            <td>Unit identifier</td>
        </tr>
        <tr>
            <td><code>lon</code></td>
            <td>Double</td>
            <td>Longitude coordinate</td>
        </tr>
        <tr>
            <td><code>lat</code></td>
            <td>Double</td>
            <td>Latitude coordinate</td>
        </tr>
        <tr>
            <td><code>range</code></td>
            <td>Integer</td>
            <td>Estimated range in meters</td>
        </tr>
        <tr>
            <td><code>samples</code></td>
            <td>Integer</td>
            <td>Number of samples collected</td>
        </tr>
        <tr>
            <td><code>changeable</code></td>
            <td>Integer</td>
            <td>Flag indicating if tower is changeable</td>
        </tr>
        <tr>
            <td><code>created</code></td>
            <td>String/DateTime</td>
            <td>Creation timestamp (ISO 8601 format)</td>
        </tr>
        <tr>
            <td><code>updated</code></td>
            <td>String/DateTime</td>
            <td>Last update timestamp (ISO 8601 format)</td>
        </tr>
        <tr>
            <td><code>averageSignal</code></td>
            <td>Integer</td>
            <td>Average signal strength in dBm</td>
        </tr>
    </table>

    <h2>API Endpoints</h2>

    <h3>1. CREATE Operations</h3>

    <h4>1.1 Create Single Cell Tower</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>POST /api/cell-towers</code><br>
        <strong>Request Body:</strong>
        <pre><code>{
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
}</code></pre>
        <strong>Response:</strong> <code>201 CREATED</code>
    </div>

    <h4>1.2 Create Multiple Cell Towers (Batch)</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>POST /api/cell-towers/batch</code><br>
        <strong>Request Body:</strong> Array of CellTower objects<br>
        <strong>Response:</strong> <code>201 CREATED</code>
    </div>

    <h3>2. READ Operations</h3>

    <h4>2.1 Get All Cell Towers</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>GET /api/cell-towers</code><br>
        <strong>Response:</strong> <code>200 OK</code> or <code>204 NO CONTENT</code>
    </div>

    <h4>2.2 Get Cell Towers with Pagination</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>GET /api/cell-towers/paged</code><br>
        <strong>Query Parameters:</strong>
        <ul>
            <li><code>page</code> (int, default=0): Page number (zero-indexed)</li>
            <li><code>size</code> (int, default=20): Number of items per page</li>
            <li><code>sortBy</code> (string, default="id"): Field to sort by</li>
            <li><code>sortDirection</code> (string, default="asc"): Sort direction ("asc" or "desc")</li>
        </ul>
        <strong>Example:</strong> <code>GET /api/cell-towers/paged?page=0&size=50&sortBy=mcc&sortDirection=desc</code><br>
        <strong>Response:</strong> <code>200 OK</code>
    </div>

    <h4>2.3 Get Cell Tower by ID</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>GET /api/cell-towers/{id}</code><br>
        <strong>Example:</strong> <code>GET /api/cell-towers/1</code><br>
        <strong>Response:</strong> <code>200 OK</code> or <code>404 NOT FOUND</code>
    </div>

    <h4>2.4 Get Cell Tower by Cell ID</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>GET /api/cell-towers/cell/{cellId}</code><br>
        <strong>Example:</strong> <code>GET /api/cell-towers/cell/5678</code><br>
        <strong>Response:</strong> <code>200 OK</code> or <code>404 NOT FOUND</code>
    </div>

    <h4>2.5 Get Cell Towers by Radio Type</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>GET /api/cell-towers/radio/{radio}</code><br>
        <strong>Example:</strong> <code>GET /api/cell-towers/radio/LTE</code><br>
        <strong>Response:</strong> <code>200 OK</code> or <code>204 NO CONTENT</code>
    </div>

    <h4>2.6 Get Cell Towers by Radio Type (Paginated)</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>GET /api/cell-towers/radio/{radio}/paged</code><br>
        <strong>Query Parameters:</strong>
        <ul>
            <li><code>page</code> (int, default=0)</li>
            <li><code>size</code> (int, default=20)</li>
        </ul>
        <strong>Example:</strong> <code>GET /api/cell-towers/radio/LTE/paged?page=0&size=100</code><br>
        <strong>Response:</strong> <code>200 OK</code>
    </div>

    <h4>2.7 Get Cell Towers by Mobile Country Code (MCC)</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>GET /api/cell-towers/mcc/{mcc}</code><br>
        <strong>Example:</strong> <code>GET /api/cell-towers/mcc/655</code><br>
        <strong>Response:</strong> <code>200 OK</code> or <code>204 NO CONTENT</code>
    </div>

    <h4>2.8 Get Cell Towers by Radio Type and MCC</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>GET /api/cell-towers/radio/{radio}/mcc/{mcc}</code><br>
        <strong>Example:</strong> <code>GET /api/cell-towers/radio/LTE/mcc/655</code><br>
        <strong>Response:</strong> <code>200 OK</code> or <code>204 NO CONTENT</code>
    </div>

    <h4>2.9 Get Cell Towers by Location (Bounding Box)</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>GET /api/cell-towers/location</code><br>
        <strong>Query Parameters:</strong>
        <ul>
            <li><code>minLon</code> (Double, required): Minimum longitude</li>
            <li><code>maxLon</code> (Double, required): Maximum longitude</li>
            <li><code>minLat</code> (Double, required): Minimum latitude</li>
            <li><code>maxLat</code> (Double, required): Maximum latitude</li>
        </ul>
        <strong>Example:</strong> <code>GET /api/cell-towers/location?minLon=25.0&maxLon=26.0&minLat=-31.0&maxLat=-30.0</code><br>
        <strong>Response:</strong> <code>200 OK</code> or <code>204 NO CONTENT</code>
    </div>

    <h4>2.10 Get Cell Towers with Minimum Samples</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>GET /api/cell-towers/samples/{minSamples}</code><br>
        <strong>Example:</strong> <code>GET /api/cell-towers/samples/100</code><br>
        <strong>Response:</strong> <code>200 OK</code> or <code>204 NO CONTENT</code>
    </div>

    <h4>2.11 Get Cell Towers by Signal Range</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>GET /api/cell-towers/signal</code><br>
        <strong>Query Parameters:</strong>
        <ul>
            <li><code>minSignal</code> (Integer, required): Minimum signal strength (dBm)</li>
            <li><code>maxSignal</code> (Integer, required): Maximum signal strength (dBm)</li>
        </ul>
        <strong>Example:</strong> <code>GET /api/cell-towers/signal?minSignal=-90&maxSignal=-70</code><br>
        <strong>Response:</strong> <code>200 OK</code> or <code>204 NO CONTENT</code>
    </div>

    <h4>2.12 Get Count by Radio Type</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>GET /api/cell-towers/radio/{radio}/count</code><br>
        <strong>Example:</strong> <code>GET /api/cell-towers/radio/LTE/count</code><br>
        <strong>Response:</strong> <code>200 OK</code>
    </div>

    <h3>3. UPDATE Operations</h3>

    <h4>3.1 Full Update (Replace)</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>PUT /api/cell-towers/{id}</code><br>
        <strong>Request Body:</strong> Complete CellTower object (all fields)<br>
        <strong>Response:</strong> <code>200 OK</code> or <code>404 NOT FOUND</code>
    </div>

    <h4>3.2 Partial Update (Patch)</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>PATCH /api/cell-towers/{id}</code><br>
        <strong>Request Body:</strong> Only fields to update<br>
        <strong>Response:</strong> <code>200 OK</code> or <code>404 NOT FOUND</code>
    </div>

    <h3>4. DELETE Operations</h3>

    <h4>4.1 Delete Single Cell Tower</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>DELETE /api/cell-towers/{id}</code><br>
        <strong>Example:</strong> <code>DELETE /api/cell-towers/1</code><br>
        <strong>Response:</strong> <code>204 NO CONTENT</code> or <code>404 NOT FOUND</code>
    </div>

    <h4>4.2 Delete All Cell Towers</h4>
    <div class="endpoint">
        <strong>Endpoint:</strong> <code>DELETE /api/cell-towers</code><br>
        <strong>Response:</strong> <code>204 NO CONTENT</code>
    </div>

    <h2>Python Helper Class</h2>
    <p>A complete Python client for the Cell Tower Signal Intelligence API:</p>
    <pre><code>import requests
from typing import List, Dict, Optional, Any

class CellTowerAPI:
    """Python client for Cell Tower Signal Intelligence API"""
    
    def __init__(self, base_url: str = "http://localhost:8080"):
        self.base_url = base_url.rstrip('/')
        self.api_url = f"{self.base_url}/api/cell-towers"
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
    
    # CREATE methods
    def create_tower(self, tower_data: Dict) -> Optional[Dict]:
        """Create a single cell tower"""
        response = self.session.post(self.api_url, json=tower_data)
        return response.json() if response.status_code == 201 else None
    
    def create_towers_batch(self, towers: List[Dict]) -> Optional[List[Dict]]:
        """Create multiple cell towers"""
        response = self.session.post(f"{self.api_url}/batch", json=towers)
        return response.json() if response.status_code == 201 else None
    
    # READ methods
    def get_all_towers(self) -> List[Dict]:
        """Get all cell towers"""
        response = self.session.get(self.api_url)
        return response.json() if response.status_code == 200 else []
    
    def get_towers_paged(self, page: int = 0, size: int = 20,
                        sort_by: str = "id", sort_direction: str = "asc") -> Dict:
        """Get paginated cell towers"""
        params = {
            "page": page,
            "size": size,
            "sortBy": sort_by,
            "sortDirection": sort_direction
        }
        response = self.session.get(f"{self.api_url}/paged", params=params)
        return response.json() if response.status_code == 200 else {}
    
    def get_tower_by_id(self, tower_id: int) -> Optional[Dict]:
        """Get cell tower by database ID"""
        response = self.session.get(f"{self.api_url}/{tower_id}")
        return response.json() if response.status_code == 200 else None
    
    def get_tower_by_cell_id(self, cell_id: int) -> Optional[Dict]:
        """Get cell tower by cell ID"""
        response = self.session.get(f"{self.api_url}/cell/{cell_id}")
        return response.json() if response.status_code == 200 else None
    
    def get_towers_by_radio(self, radio: str) -> List[Dict]:
        """Get towers by radio type (e.g., 'LTE', 'GSM')"""
        response = self.session.get(f"{self.api_url}/radio/{radio}")
        return response.json() if response.status_code == 200 else []
    
    def get_towers_by_radio_paged(self, radio: str, page: int = 0, size: int = 20) -> Dict:
        """Get paginated towers by radio type"""
        params = {"page": page, "size": size}
        response = self.session.get(f"{self.api_url}/radio/{radio}/paged", params=params)
        return response.json() if response.status_code == 200 else {}
    
    def get_towers_by_mcc(self, mcc: int) -> List[Dict]:
        """Get towers by Mobile Country Code"""
        response = self.session.get(f"{self.api_url}/mcc/{mcc}")
        return response.json() if response.status_code == 200 else []
    
    def get_towers_by_radio_and_mcc(self, radio: str, mcc: int) -> List[Dict]:
        """Get towers by radio type and country code"""
        response = self.session.get(f"{self.api_url}/radio/{radio}/mcc/{mcc}")
        return response.json() if response.status_code == 200 else []
    
    def get_towers_by_location(self, min_lon: float, max_lon: float, 
                              min_lat: float, max_lat: float) -> List[Dict]:
        """Get towers within bounding box"""
        params = {
            "minLon": min_lon, "maxLon": max_lon, 
            "minLat": min_lat, "maxLat": max_lat
        }
        response = self.session.get(f"{self.api_url}/location", params=params)
        return response.json() if response.status_code == 200 else []
    
    def get_towers_with_high_samples(self, min_samples: int) -> List[Dict]:
        """Get towers with minimum number of samples"""
        response = self.session.get(f"{self.api_url}/samples/{min_samples}")
        return response.json() if response.status_code == 200 else []
    
    def get_towers_by_signal_range(self, min_signal: int, max_signal: int) -> List[Dict]:
        """Get towers within signal strength range"""
        params = {"minSignal": min_signal, "maxSignal": max_signal}
        response = self.session.get(f"{self.api_url}/signal", params=params)
        return response.json() if response.status_code == 200 else []
    
    def get_count_by_radio(self, radio: str) -> int:
        """Get count of towers by radio type"""
        response = self.session.get(f"{self.api_url}/radio/{radio}/count")
        return response.json() if response.status_code == 200 else 0
    
    # UPDATE methods
    def update_tower(self, tower_id: int, tower_data: Dict) -> Optional[Dict]:
        """Full update of tower"""
        response = self.session.put(f"{self.api_url}/{tower_id}", json=tower_data)
        return response.json() if response.status_code == 200 else None
    
    def partial_update_tower(self, tower_id: int, tower_data: Dict) -> Optional[Dict]:
        """Partial update of tower"""
        response = self.session.patch(f"{self.api_url}/{tower_id}", json=tower_data)
        return response.json() if response.status_code == 200 else None
    
    # DELETE methods
    def delete_tower(self, tower_id: int) -> bool:
        """Delete a single tower"""
        response = self.session.delete(f"{self.api_url}/{tower_id}")
        return response.status_code == 204
    
    def delete_all_towers(self) -> bool:
        """Delete all towers (use with caution!)"""
        response = self.session.delete(self.api_url)
        return response.status_code == 204</code></pre>

    <h2>HTTP Status Codes</h2>
    <ul>
        <li><strong>200 OK</strong>: Request successful, data returned</li>
        <li><strong>201 CREATED</strong>: Resource created successfully</li>
        <li><strong>204 NO CONTENT</strong>: Success but no data to return (empty result or deletion)</li>
        <li><strong>404 NOT FOUND</strong>: Resource not found</li>
        <li><strong>500 INTERNAL SERVER ERROR</strong>: Server error occurred</li>
    </ul>

    <h2>Quick Start Checklist</h2>
    <ol>
        <li>Install requests library: <code>pip install requests</code></li>
        <li>Copy the <code>CellTowerAPI</code> class to your project</li>
        <li>Update base URL to your server address</li>
        <li>Test connection: <code>api.get_all_towers()</code></li>
        <li>Start integrating with your application</li>
    </ol>

    <div class="note">
        <strong>Note:</strong> The API is configured with CORS enabled for all origins, allowing requests from any domain without special handling.
    </div>
</body>
</html>
