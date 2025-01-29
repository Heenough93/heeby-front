import React from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import DisabledMarker from "./DisabledMarker.tsx";
import PostDetailMarker from "./PostDetailMarker.tsx";
import "leaflet/dist/leaflet.css";
import './MapView.css';

interface PostDetailMapViewProps {
  onLocationSelect: (lat: number, lng: number) => void;
  isAuthenticated: boolean;
  location: {lat: number, lng: number};
}

const PostDetailMapView: React.FC<PostDetailMapViewProps> = ({ onLocationSelect: handleLocationSelect, isAuthenticated, location }) => {
  return (
      <MapContainer
          center={location}
          zoom={15}
          style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {isAuthenticated
          ? <PostDetailMarker onLocationSelect={handleLocationSelect} location={location} />
          : <DisabledMarker location={location} />
        }
      </MapContainer>
  );
};

export default PostDetailMapView;
