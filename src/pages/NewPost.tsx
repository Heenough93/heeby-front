import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import {useFetchWithLoading} from "../hooks/useFetchWithLoading.tsx";
import NewPostMapView from "../components/NewPostMapView.tsx";
import "./NewPost.css";

const NewPost: React.FC = () => {
  const navigate = useNavigate();

  const fetchWithLoading = useFetchWithLoading();
  const [isPublic, setIsPublic] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleToggle = () => {
    setIsPublic((prev) => !prev);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const savePost = async () => {
    try {
      const post = {
        id: "0",
        dateAndTime: new Date().toISOString(),
        isPublic: isPublic,
        title: title,
        content: content,
        lat: location ? location.lat.toString() : "",
        lng: location ? location.lng.toString() : "",
      }
      const response = await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/post/register-post", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: post }),
      });
      const data = response.data;
      alert(`${data}, Post saved successfully!`);
      navigate(-1);
    } catch (error) {
      alert("Fail to save post");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    const isConfirmed = window.confirm("Are you sure you want to save this post?");
    if (isConfirmed) {
      await savePost();
    }
  };

  return (
      <div className="new-post-container">
        <div className="header-with-back">
          <div className="title-with-toggle">
            <h1 className="new-post-heading">New Post</h1>
            <label className="toggle-switch">
              <input type="checkbox" checked={isPublic} onChange={handleToggle} />
              <span className="slider"></span>
              <span className="toggle-label">{isPublic ? "Public" : "Private"}</span>
            </label>
          </div>

          <button className="back-button" onClick={handleGoBack}>
            &larr; Back
          </button>
        </div>
        <form className="new-post-form" onSubmit={(e) => e.preventDefault()}>
          <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="new-post-input"
          />
          <textarea
              placeholder="Enter content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="new-post-textarea"
          />
          <h2>Location</h2>
          <NewPostMapView onLocationSelect={handleLocationSelect} />
          <button type="button" onClick={handleSave} className="action-button save-button">
            Save
          </button>
        </form>
      </div>
  );
};

export default NewPost;
