import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useFetchWithLoading } from "../hooks/useFetchWithLoading.tsx";
import PostDetailMapView from "../components/PostDetailMapView.tsx";
import "./PostDetail.css";

const PostDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { accessToken, isAuthenticated, user } = useAuth();
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

  const fetchPost = async () => {
    try {
      const response = await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/posts/" + id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = response.data;
      setIsPublic(data.isPublic);
      setTitle(data.title);
      setContent(data.content);
      setLocation({ lat: data.lat, lng: data.lng });
    } catch (error) {
      alert("Fail to fetch post.");
    }
  };

  const updatePost = async () => {
    try {
      const post = {
        id: Number(id),
        isPublic: isPublic,
        title: title,
        content: content,
        lat: location ? location.lat.toString() : "",
        lng: location ? location.lng.toString() : "",
        userId: user.id,
      };
      await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/posts/" + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': accessToken },
        body: JSON.stringify(post),
      });
      alert(`Post updated successfully!`);
      navigate(-1);
    } catch (error) {
      alert("Fail to update post");
    }
  };

  const deletePost = async () => {
    try {
      await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/posts/" + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': accessToken },
      });
      alert(`Post deleted successfully!`);
      navigate(-1);
    } catch (error) {
      alert("Fail to delete post");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 돌아감
  };

  const handleUpdate = async () => {
    const isConfirmed = window.confirm("Are you sure you want to update this post?");
    if (isConfirmed) {
      await updatePost();
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this post?");
    if (isConfirmed) {
      await deletePost();
    }
  };

  return (
      <div className="post-detail-container">
        <div className="header-with-back">
          <div className="title-with-toggle">
            <h1 className="post-detail-heading">#{id} Post</h1>
            {isAuthenticated && (
                <label className="toggle-switch">
                  <input type="checkbox" checked={isPublic} onChange={handleToggle} />
                  <span className="slider"></span>
                  <span className="toggle-label">{isPublic ? "Public" : "Private"}</span>
                </label>
            )}
          </div>

          <button className="back-button" onClick={handleGoBack}>
            &larr; Back
          </button>
        </div>
        <form className="post-detail-form" onSubmit={(e) => e.preventDefault()}>
          <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="post-detail-input"
              disabled={!isAuthenticated}
          />
          <textarea
              placeholder="Enter content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="post-detail-textarea"
              disabled={!isAuthenticated}
          />
          <h2>Location</h2>
          {location && <PostDetailMapView
              onLocationSelect={handleLocationSelect}
              isAuthenticated={isAuthenticated}
              location={location}
          />}
          {isAuthenticated && (
              <div className="action-buttons">
                <button type="button" onClick={handleUpdate} className="action-button update-button">
                  Update
                </button>
                <button type="button" onClick={handleDelete} className="action-button delete-button">
                  Delete
                </button>
              </div>
          )}
        </form>
      </div>
  );
};

export default PostDetail;
