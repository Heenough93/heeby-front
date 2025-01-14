import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";
// import {useFetchWithLoading} from "../hooks/useFetchWithLoading.tsx";
import "./PostDetail.css";

const PostDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { isAuthenticated } = useAuth();
  // const fetchWithLoading = useFetchWithLoading();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchPost = async (id: string) => {
    try {
      // const data = await fetchWithLoading("/api/post", {
      //   method: 'POST',
      //   body: JSON.stringify({id: id}),
      // });
      const data = {title: `Blog Post #${id}`, content: `This is the detailed content of blog post #${id}.`};
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      alert("Fail to fetch post.");
    }
  };

  useEffect(() => {
    id && fetchPost(id);
  }, [id]);

  const handleGoBack = () => {
    navigate(-1); // 이전 페이지로 돌아감
  };

  const handleUpdate = () => {
    alert(`Updated:${id}\nHeading: ${title}\nContent: ${content}`);
  };

  const handleDelete = () => {
    alert(`Delete post #${id}`);
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
