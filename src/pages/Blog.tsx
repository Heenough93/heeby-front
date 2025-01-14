import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";
import {useFetchWithLoading} from "../hooks/useFetchWithLoading.tsx";
import "./Blog.css";

const Blog = () => {
  const { isAuthenticated } = useAuth();
  const fetchWithLoading = useFetchWithLoading();
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      // const data = await fetchWithLoading("/api/posts");
      const data = [
        { id: 1, title: "First Blog", dateAndTime: "2024-12-29 17:29:30", content: "This is the first blog post." },
        { id: 2, title: "Second Blog", dateAndTime: "2024-12-31 17:29:30", content: "This is the second blog post." },
        { id: 3, title: "Third Blog", dateAndTime: "2025-01-03 17:29:30", content: "This is the third blog post." },
        { id: 4, title: "Fourth BlogFourth BlogFourth BlogFourth BlogFourth BlogFourth Blog", dateAndTime: "2025-01-09 17:29:30", content: "This is the fourth blog post." },
        { id: 5, title: "Fifth Blog", dateAndTime: "2025-01-12 17:29:30", content: "This is the fifth blog post.This is the fifth blog post.This is the fifth blog post.This is the fifth blog post.This is the fifth blog post." },
      ];
      setPosts(data.reverse());
    } catch (error) {
      alert("Fail to fetch blog posts.");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
      <div className="blog-container">
        <h1 className="blog-heading">My Blog</h1>
        <div className="blog-posts">
          {isAuthenticated && (
              <Link to="/new-post" className="add-post-link">
                <article className="blog-post add-new-post">
                  <span className="add-post-icon">+</span>
                </article>
              </Link>
          )}
          {posts.length > 0 && (
              posts.map((post) => (
                  <article key={post.id} className="blog-post">
                    <Link to={`/post/${post.id}`} className="post-link">
                      <h2 className="post-title">{post.title}</h2>
                      <p className="post-date">{post.dateAndTime}</p>
                      <p className="post-content">{post.content}</p>
                    </Link>
                  </article>
              ))
          )}
        </div>
      </div>
  );
};

export default Blog;
