import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import {useFetchWithLoading} from "../hooks/useFetchWithLoading.tsx";
import "./NewPost.css";

const NewPost = () => {
  const navigate = useNavigate();

  const fetchWithLoading = useFetchWithLoading();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const savePost = async ({ title, content }) => {
    try {
      // const data = await fetchWithLoading("/api/create-post", {
      //   method: 'POST',
      //   body: JSON.stringify({id: id}),
      // });
      const data = { id: 10 };
      alert(`Post saved successfully!: ${data.id}`);
    } catch (error) {
      alert("Fail to save post");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    await savePost({ title, content });
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
