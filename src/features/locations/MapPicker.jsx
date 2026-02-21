import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Box, Typography, CircularProgress } from "@mui/material";
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

// Функція для отримання адреси за координатами (Nominatim OpenStreetMap)
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "uk,en-US;q=0.9,en;q=0.8",
        },
      }
    );
    if (!response.ok) throw new Error("Geocoding failed");
    const data = await response.json();
    return data.address || null;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
};

export const MapPicker = ({ latitude, longitude, onCoordinateSelect, onAddressUpdate }) => {
  const [markerPosition, setMarkerPosition] = useState(
    latitude && longitude ? [latitude, longitude] : [50.4501, 30.5234] // Київ по замовчуванню
  );
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const handleMapClick = async (coords) => {
    setMarkerPosition([coords.latitude, coords.longitude]);
    onCoordinateSelect(coords);
    
    // Отримуємо адресу за координатами
    if (onAddressUpdate) {
      setIsLoadingAddress(true);
      const addressData = await reverseGeocode(coords.latitude, coords.longitude);
      if (addressData) {
        // Формуємо адресу з названою вулиці та номером будинку
        const streetName = addressData.road || addressData.street || "";
        const houseNumber = addressData.house_number || "";
       // const city = addressData.city || addressData.town || "";
        
        const fullAddress = [streetName, houseNumber]
          .filter(Boolean)
          .join(", ");
          
        onAddressUpdate(fullAddress);
      }
      setIsLoadingAddress(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="caption">
          Клікніть на карту, щоб обрати координати
        </Typography>
        {isLoadingAddress && <CircularProgress size={20} />}
      </Box>
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
          <MapClickHandler onCoordinateSelect={handleMapClick} />
          <MapZoomHandler latitude={latitude} longitude={longitude} />
        </MapContainer>
      </Box>
    </Box>
  );
};
