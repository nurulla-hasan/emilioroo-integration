'use client';

import { useState, useEffect, memo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker({ onLocationChange, center }) {
  const [position, setPosition] = useState(center);

  const map = useMap();

  useEffect(() => {
    if (center) {
        setPosition(center);
        map.setView(center, map.getZoom());
    }
  }, [center, map]);

  const mapEvents = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onLocationChange) {
        onLocationChange(e.latlng);
      }
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

function MapPicker({ onLocationChange, center }) {
  return (
    <MapContainer
      center={center || [-34.6037, -58.3816]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onLocationChange={onLocationChange} center={center} />
    </MapContainer>
  );
}

export default memo(MapPicker);