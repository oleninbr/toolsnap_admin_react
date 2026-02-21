import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useListContext } from "react-admin";
import L from "leaflet";
import { Box, Typography } from "@mui/material";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Component to auto-fit bounds based on markers
const FitBounds = ({ locations }) => {
  const map = useMap();

  React.useEffect(() => {
    if (locations && locations.length > 0) {
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.latitude, loc.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
};

export const LocationMap = () => {
  const { data } = useListContext();

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          p: 2,
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          На карті немає локацій для відображення
        </Typography>
      </Box>
    );
  }

  // Get default center from first location or use Kyiv
  const defaultCenter =
    data.length > 0
      ? [data[0].latitude, data[0].longitude]
      : [50.4501, 30.5234];

  return (
    <Box
      sx={{
        mb: 3,
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: 1,
      }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds locations={data} />
        {data.map((location, index) => (
          <Marker
            key={location.id || index}
            position={[location.latitude, location.longitude]}
          >
            <Popup>
              <div style={{ minWidth: "200px" }}>
                <strong>{location.name}</strong>
                <br />
                <small>{location.address}</small>
                <br />
                <small>
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};
