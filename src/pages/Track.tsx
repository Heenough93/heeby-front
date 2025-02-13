import React, {useEffect, useState} from 'react';
import {useFetchWithLoading} from "../hooks/useFetchWithLoading.tsx";
import { MapContainer, TileLayer, Polyline, Popup, CircleMarker, Marker } from 'react-leaflet';
import './Track.css';

const Track: React.FC = () => {
  const fetchWithLoading = useFetchWithLoading();

  const [originalTracks, setOriginalTracks] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [isAllTrack, setIsAllTrack] = useState(true);

  const fetchTracks = async () => {
    try {
      const response = await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/track/find-tracks", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = response.data;
      setOriginalTracks(data);
      setTracks(data);
    } catch (error) {
      alert("Fail to fetch tracks.");
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const toggleTrack = () => {
    setTracks(isAllTrack ? originalTracks.slice(-5) : originalTracks);
    setIsAllTrack(!isAllTrack);
  };

  return (
      <div className="track-container">
        <header className="track-header">
          <h1>Track</h1>
        </header>

        <div className="track-map-wrapper">
          <div className="header-with-toggle">
            <div className="title-with-toggle">
              <h1 className="track-location">Current Location: {tracks.length === 0 ? "No data" : tracks[tracks.length - 1].location}</h1>
            </div>

            <button className="track-toggle-button" onClick={toggleTrack}>
              {isAllTrack ? 'Show Recent Tracks' : 'Show All Tracks'}
            </button>
          </div>
          <div className="track-map">
            {tracks.length !== 0 && (
                <MapContainer center={tracks[tracks.length - 1]} zoom={4} style={{ height: "400px", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <Polyline positions={tracks.map(track => [track.lat, track.lng])} color="yellow" weight={4} />

                  {tracks.map((track, index) => {
                    if (index === tracks.length - 1) {
                      return (
                          <React.Fragment key={index}>
                            <Marker position={[track.lat, track.lng]}>
                              <Popup>{track.location}</Popup>
                            </Marker>
                            <CircleMarker center={[track.lat, track.lng]} radius={5} color="black" fillColor="yellow" fillOpacity={1}>
                              <Popup>{track.location}</Popup>
                            </CircleMarker>
                          </React.Fragment>
                      );
                    } else {
                      return (
                          <CircleMarker key={index} center={[track.lat, track.lng]} radius={5} color="black" fillColor="yellow" fillOpacity={1}>
                            <Popup>{track.location}</Popup>
                          </CircleMarker>
                      );
                    }
                  })}
                </MapContainer>
            )}
          </div>
        </div>
      </div>
  );
};

export default Track;
