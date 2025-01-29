import React, {useState} from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import NewPostMarker from "./NewPostMarker.tsx";
import "leaflet/dist/leaflet.css";
import './MapView.css';

interface NewPostMapViewProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const NewPostMapView: React.FC<NewPostMapViewProps> = ({ onLocationSelect: handleLocationSelect }) => {
  const [center ] = useState<[number, number]>([37.7749, -122.4194]); // 초기 사용자 위치

  return (
      <MapContainer
          center={center} // 초기 지도 중심
          zoom={15}
          style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <NewPostMarker onLocationSelect={handleLocationSelect} />
      </MapContainer>
  );
};

export default NewPostMapView;
