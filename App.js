import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

function App() {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [floodData, setFloodData] = useState(null);

  // Fetch Geolocation from Address
  const getCoordinates = async () => {
    const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`
      );
      const location = response.data.results[0].geometry.location;
      setCoordinates([location.lat, location.lng]);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  // Fetch Flood Data using coordinates (This can be any API)
  const getFloodData = async () => {
    const FLOOD_API_URL = `https://api.example.com/flood?lat=${coordinates[0]}&lng=${coordinates[1]}`;
    try {
      const response = await axios.get(FLOOD_API_URL);
      setFloodData(response.data);
    } catch (error) {
      console.error("Error fetching flood data:", error);
    }
  };

  const handleSearch = async () => {
    await getCoordinates();
    if (coordinates) {
      getFloodData();
    }
  };

  return (
    <div className="App">
      <h1>Flood Risk Visualization</h1>
      <input
        type="text"
        placeholder="Enter home address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {coordinates && (
        <MapContainer
          center={coordinates}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={coordinates}>
            <Popup>
              <h2>Flood Prediction Data</h2>
              {floodData ? (
                <div>
                  <p>Risk Level: {floodData.risk_level}</p>
                  <p>Flood Depth: {floodData.depth}m</p>
                </div>
              ) : (
                <p>Loading flood data...</p>
              )}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default App;