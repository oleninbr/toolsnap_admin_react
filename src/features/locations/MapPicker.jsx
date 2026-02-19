import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Box, Typography } from "@mui/material";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MapClickHandler = ({ onCoordinateSelect }) => {
  useMapEvents({
    click(e) {
      onCoordinateSelect({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });
  return null;
};

const MapZoomHandler = ({ latitude, longitude }) => {
  const map = useMap();
  
  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 15);
    }
  }, [latitude, longitude, map]);
  
  return null;
};

export const MapPicker = ({ latitude, longitude, onCoordinateSelect }) => {
  const [markerPosition, setMarkerPosition] = useState(
    latitude && longitude ? [latitude, longitude] : [50.4501, 30.5234] // Київ по замовчуванню
  );

  const handleMapClick = (coords) => {
    setMarkerPosition([coords.latitude, coords.longitude]);
    onCoordinateSelect(coords);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
        Клікніть на карту, щоб обрати координати
      </Typography>
      <Box
        sx={{
          height: 400,
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: 1,
          overflow: "hidden",
          "& .leaflet-container": {
            height: "100%",
            width: "100%",
          },
        }}
      >
        <MapContainer
          center={markerPosition}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={markerPosition} />
          <MapClickHandler onCoordinateSelect={handleMapClick} />\n          <MapZoomHandler latitude={latitude} longitude={longitude} />\n        </MapContainer>
      </Box>
    </Box>
  );
};
