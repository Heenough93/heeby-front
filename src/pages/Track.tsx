import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Polyline, Popup, CircleMarker, Marker } from 'react-leaflet';
import L, {LatLngExpression} from "leaflet";
import {useFetchWithLoading} from "../hooks/useFetchWithLoading.tsx";
import TrackControls from "./TrackControls.tsx";
import './Track.css';

const CustomIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41], // 핀 끝 설정
});

const Track: React.FC = () => {
  const fetchWithLoading = useFetchWithLoading();
  const [originalTracks, setOriginalTracks] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [isAllTrack, setIsAllTrack] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    const today = new Date();

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);

    const recentTracks = tracks.filter(track => {
      const trackDate = new Date(track.dateAndTime);
      return trackDate >= twoWeeksAgo;
    });

    setTracks(isAllTrack ? recentTracks : originalTracks);
    setIsAllTrack(!isAllTrack);
  };

  if (tracks.length === 0) return <p>Loading...</p>;

  const lastTrack = tracks[tracks.length - 1];
  const firstHalfTracks = tracks.filter(track => new Date(track.dateAndTime) < new Date("2025-01-29"));
  const secondHalfTracks = tracks.filter(track => new Date(track.dateAndTime) >= new Date("2025-01-29"));

  return (
      <div className="track-container">
        <header className="track-header">
          <h1>Track</h1>
        </header>

        <div className="track-map-wrapper">
          <div className="header-with-toggle">
            <div className="title-with-toggle">
              <h1 className="track-location">Current Location: {lastTrack.location}</h1>
            </div>

            <button className="track-toggle-button" onClick={toggleTrack}>
              {isAllTrack ? 'Show Recent Tracks' : 'Show All Tracks'}
            </button>
          </div>
          <div className="track-map">
            {tracks.length !== 0 && (
                <MapContainer center={[lastTrack.lat, lastTrack.lng] as LatLngExpression} zoom={8} style={{ height: "400px", width: "100%" }}>
                  <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  <Polyline positions={firstHalfTracks.map(track => [track.lat, track.lng])} color="red" weight={4} />
                  {firstHalfTracks.map((track, index) => (
                      <CircleMarker
                          key={index}
                          center={[track.lat, track.lng]}
                          radius={5}
                          color="black"
                          fillColor="red"
                          fillOpacity={1}
                          eventHandlers={{
                            click: () => {
                              setCurrentIndex(index)
                            },
                          }}
                      >
                        <Popup>{track.location}</Popup>
                      </CircleMarker>
                  ))}

                  <Polyline positions={secondHalfTracks.map(track => [track.lat, track.lng])} color="yellow" weight={4} />
                  {secondHalfTracks.map((track, index) => (
                      <React.Fragment key={index}>
                        {index === secondHalfTracks.length - 1 ? (
                            <>
                              <Marker position={[track.lat, track.lng]} icon={CustomIcon}>
                                <Popup>{track.location}</Popup>
                              </Marker>
                              <CircleMarker
                                  center={[track.lat, track.lng]}
                                  radius={5}
                                  color="black"
                                  fillColor="yellow"
                                  fillOpacity={1}
                                  eventHandlers={{
                                    click: () => {
                                      setCurrentIndex(firstHalfTracks.length + index)
                                    },
                                  }}
                              >
                                <Popup>{track.location}</Popup>
                              </CircleMarker>
                            </>
                        ) : (
                            <CircleMarker
                                center={[track.lat, track.lng]}
                                radius={5}
                                color="black"
                                fillColor="yellow"
                                fillOpacity={1}
                                eventHandlers={{
                                  click: () => {
                                    setCurrentIndex(firstHalfTracks.length + index)
                                  },
                                }}
                            >
                              <Popup>{track.location}</Popup>
                            </CircleMarker>
                        )}
                      </React.Fragment>
                  ))}
                  <TrackControls tracks={tracks} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
                </MapContainer>
            )}
          </div>
        </div>
      </div>
  );
};

export default Track;
