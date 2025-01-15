import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import {useFetchWithLoading} from "../hooks/useFetchWithLoading.tsx";
import "./NewPost.css";

const NewPost: React.FC = () => {
  const navigate = useNavigate();

  const fetchWithLoading = useFetchWithLoading();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const savePost = async () => {
    try {
      const post = {
        id: "0",
        dateAndTime: new Date().toISOString(),
        title: title,
        content: content,
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
    await savePost();
  };

  return (
      <div className="new-post-container">
        <div className="header-with-back">
          <h1 className="new-post-heading">New Post</h1>
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
          <button type="button" onClick={handleSave} className="action-button save-button">
            Save
          </button>
        </form>
      </div>
  );
};

export default NewPost;
