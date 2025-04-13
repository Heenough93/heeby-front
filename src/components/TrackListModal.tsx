import React, {useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.tsx";
import {useFetchWithLoading} from "../hooks/useFetchWithLoading.tsx";
import './TrackListModal.css';

interface Track {
  id: string;
  date: string;
  city: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
}

const TrackListModal: React.FC<{ tracks: Track[], onClose: () => void }> = ({ tracks, onClose }) => {
  const {accessToken} = useAuth();
  const fetchWithLoading = useFetchWithLoading();
  const [trackData, setTrackData] = useState<Track[]>(tracks);
  const [editingCell, setEditingCell] = useState<{ row: number, column: string } | null>(null);

  const lastRowRef = useRef<HTMLTableRowElement | null>(null); // 마지막 행을 위한 ref

  useEffect(() => {
    if (trackData.length !== tracks.length && lastRowRef.current) {
      (lastRowRef.current as HTMLTableRowElement).scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [trackData]);

  const updateTrack = async (track: Track) => {
    try {
      await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/tracks/" + track.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': accessToken },
        body: JSON.stringify(track),
      });
      alert(`Track updated successfully!`);
      onClose();
    } catch (error) {
      alert("Fail to update track");
    }
  };

  const deleteTrack = async (id: string) => {
    try {
      await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/tracks/" + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': accessToken },
      });
      alert(`Track deleted successfully!`);
      onClose();
    } catch (error) {
      alert("Fail to delete track");
    }
  };

  const createTrack = async (track: Track) => {
    try {
      delete track.id;
      await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/tracks/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': accessToken },
        body: JSON.stringify(track),
      });
      alert(`Track saved successfully!`);
      onClose();
    } catch (error) {
      alert("Fail to save track");
    }
  };

  const handleCellClick = (rowIndex: number, column: string) => {
    setEditingCell({ row: rowIndex, column });
  };

  const handleCellChange = (rowIndex: number, column: keyof Track | "location", value: string) => {
    if (column !== "location") {
      const updatedTracks = [...trackData];
      updatedTracks[rowIndex] = { ...updatedTracks[rowIndex], [column]: value };
      setTrackData(updatedTracks);
    } else {
      const updatedTracks = [...trackData];
      updatedTracks[rowIndex] = { ...updatedTracks[rowIndex], "city": value.split(", ")[0], "country": value.split(", ")[1], "flag": value.split(", ")[2] };
      setTrackData(updatedTracks);
    }
  };

  const handleBlurOrEnter = (e: React.KeyboardEvent | React.FocusEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    setEditingCell(null);
  };

  const handleUpdateRow = async (index: number) => {
    const isConfirmed = window.confirm("Are you sure you want to update this track?");
    if (isConfirmed) {
      await updateTrack(trackData[index]);
    }
  };

  const handleDeleteRow = async (index: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this track?");
    if (isConfirmed) {
      await deleteTrack(trackData[index].id);
    }
  };

  const handleCreateRow = async (index: number) => {
    const isConfirmed = window.confirm("Are you sure you want to create this track?");
    if (isConfirmed) {
      await createTrack(trackData[index]);
    }
  };

  const handleAddRow = () => {
    const newTrack = {
      id: "",
      date: new Date().toISOString().slice(0, 10),
      city: "",
      country: "",
      flag: "",
      lat: 0,
      lng: 0,
    };
    setTrackData([...trackData, { ...newTrack }]);
  };

  return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose}>✖</button>
          <h2>Track List</h2>

          <div className="track-table-container">
            <table className="track-table">
              <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Location</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {trackData.map((track, rowIndex) => (
                  <tr key={track.id} ref={lastRowRef}>
                    <td>{track.id}</td>
                    {["date", "location", "lat", "lng"].map((column) => (
                        <td key={column} onClick={() => handleCellClick(rowIndex, column)}>
                          {editingCell?.row === rowIndex && editingCell.column === column ? (
                              column !== "location" ? (
                                  <input
                                      type="text"
                                      value={track[column as keyof Track]}
                                      onChange={(e) => handleCellChange(rowIndex, column as keyof Track | "location", e.target.value)}
                                      onBlur={(e) => handleBlurOrEnter(e)}
                                      onKeyDown={(e) => handleBlurOrEnter(e)}
                                      autoFocus
                                  />
                              ) : (
                                  <input
                                      type="text"
                                      value={`${track["city"]}, ${track["country"]}, ${track["flag"]}`}
                                      onChange={(e) => handleCellChange(rowIndex, column as keyof Track | "location", e.target.value)}
                                      onBlur={(e) => handleBlurOrEnter(e)}
                                      onKeyDown={(e) => handleBlurOrEnter(e)}
                                      autoFocus
                                  />
                              )
                          ) : (
                              column !== "location" ? track[column as keyof Track] : `${track["city"]}, ${track["country"]}, ${track["flag"]}`
                          )}
                        </td>
                    ))}
                    <td>
                      {track.id === "" ? (
                          <button className="create-button" onClick={() => handleCreateRow(rowIndex)}>Create</button>
                      ) : (
                          <div className="action-buttons-container">
                            <button className="delete-button" onClick={() => handleDeleteRow(rowIndex)}>Delete</button>
                            <button className="update-button" onClick={() => handleUpdateRow(rowIndex)}>Update</button>
                          </div>
                      )}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          <button className="add-row-button" onClick={handleAddRow}>+ Add Row</button>
        </div>
      </div>
  );
};

export default TrackListModal;
