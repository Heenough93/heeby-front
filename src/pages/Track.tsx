import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker } from 'react-leaflet';
import L, {LatLngExpression} from "leaflet";
import {useAuth} from "../context/AuthContext.tsx";
import {useFetchWithLoading} from "../hooks/useFetchWithLoading.tsx";
import TrackControls from "../components/TrackControls.tsx";
import TrackListModal from "../components/TrackListModal.tsx";
import './Track.css';

const CustomIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconAnchor: [12, 41], // 핀 끝 설정
});

const Track: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const fetchWithLoading = useFetchWithLoading();
  const [originalTracks, setOriginalTracks] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [isAllTrack, setIsAllTrack] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTracks = async () => {
    try {
      const response = await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/tracks", {
        method: 'GET',
        cache: 'no-store',
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

  useEffect(() => {
    if (!isModalOpen) {
      fetchTracks();
    }
  }, [isModalOpen]);

  const toggleTrack = () => {
    const today = new Date();

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(today.getDate() - 14);

    const recentTracks = tracks.filter(track => {
      const trackDate = new Date(track.date);
      return trackDate >= twoWeeksAgo;
    });

    setTracks(isAllTrack ? recentTracks : originalTracks);
    setIsAllTrack(!isAllTrack);
  };

  const handleShowList = () => {
    setIsModalOpen(true);
  }

  const lastTrack = tracks[tracks.length - 1];
  const firstHalfTracks = tracks.filter(track => new Date(track.date) < new Date("2025-01-29"));
  const secondHalfTracks = tracks.filter(track => new Date(track.date) >= new Date("2025-01-29"));

  return (
      <div className="track-container">
        <h1 className="track-heading">Track</h1>

        {tracks.length !== 0 && (
            <div className="track-map-wrapper">
              <div className="header-with-toggle">
                <div className="title-with-toggle">
                  <h1 className="track-location">Current Location: {lastTrack.city}</h1>
                </div>

                <button className="track-toggle-button" onClick={toggleTrack}>
                  {isAllTrack ? 'Show Recent Tracks' : 'Show All Tracks'}
                </button>
              </div>
              <div className="track-map">
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
                          />
                      ))}

                      <Polyline positions={secondHalfTracks.map(track => [track.lat, track.lng])} color="yellow" weight={4} />
                      {secondHalfTracks.map((track, index) => (
                          <React.Fragment key={index}>
                            {index === secondHalfTracks.length - 1 ? (
                                <>
                                  <Marker position={[track.lat, track.lng]} icon={CustomIcon} />
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
                                  />
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
                                />
                            )}
                          </React.Fragment>
                      ))}
                      <TrackControls tracks={tracks} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
                    </MapContainer>
                {isAuthenticated && (
                    <button type="button" onClick={handleShowList} className="action-button show-list-button">
                      Show List
                    </button>
                )}
                {isModalOpen && <TrackListModal tracks={tracks} onClose={() => setIsModalOpen(false)} />}
              </div>
            </div>
        )}
      </div>
  );
};

export default Track;
