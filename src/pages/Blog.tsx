import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {useAuth} from "../context/AuthContext.tsx";
import {useFetchWithLoading} from "../hooks/useFetchWithLoading.tsx";
import "./Blog.css";

const Blog: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const fetchWithLoading = useFetchWithLoading();
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await fetchWithLoading(import.meta.env.VITE_BASE_URL + "/post/find-posts", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = response.data;
      if (isAuthenticated) {
        setPosts(data.reverse());
      } else {
        setPosts(data.reverse().filter((post: any) => post.isPublic === "true"));
      }
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
              <Link to="/blog/new-post" className="add-post-link">
                <article className="blog-post add-new-post">
                  <span className="add-post-icon">+</span>
                </article>
              </Link>
          )}
          {posts.length > 0 && (
              posts.map((post) => (
                  <article key={post.id} className="blog-post">
                    <Link to={`/blog/post/${post.id}`} className="post-link">
                      <h2 className="post-title">{post.title}</h2>
                      <p className="post-date">{
                        new Date(post.dateAndTime).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false,
                          timeZone: "America/Los_Angeles",
                          timeZoneName: "shortOffset",
                        })
                      }</p>
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
