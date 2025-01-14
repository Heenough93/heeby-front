import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";
import {useFetchWithLoading} from "../hooks/useFetchWithLoading.tsx";
import "./PostDetail.css";

const PostDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isAuthenticated } = useAuth();
  const fetchWithLoading = useFetchWithLoading();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchPost = async () => {
    try {
      const response = await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/post/find-post-by-id", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: id }),
      });
      const data = response.data;
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      alert("Fail to fetch post.");
    }
  };

  const updatePost = async () => {
    try {
      const post = {
        id: id,
        title: title,
        content: content,
      }
      const response = await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/post/modify-post", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: post }),
      });
      const data = response.data;
      alert(`${data}, Post updated successfully!`);
      navigate(-1);
    } catch (error) {
      alert("Fail to update post");
    }
  };

  const deletePost = async () => {
    try {
      const response = await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/post/remove-post", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: id }),
      });
      const data = response.data;
      alert(`${data}, Post deleted successfully!`);
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
    await updatePost();
  };

  const handleDelete = async () => {
    await deletePost();
  };

  return (
      <div className="post-detail-container">
        <div className="header-with-back">
          <h1 className="post-detail-heading">#{id} Post</h1>
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
              disabled={  !isAuthenticated}
          />
          <textarea
              placeholder="Enter content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="post-detail-textarea"
              disabled={  !isAuthenticated}
          />
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
