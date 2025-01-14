import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Blog from "../pages/Blog";
import PostDetail from "../pages/PostDetail";
import NewPost from "../pages/NewPost";

const AppRoutes: React.FC = () => (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/new-post" element={<NewPost />} />
    </Routes>
);

export default AppRoutes;