import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Blog from "../pages/Blog";
import PostDetail from "../pages/PostDetail";
import NewPost from "../pages/NewPost";
import Track from "../pages/Track.tsx";

const AppRoutes: React.FC = () => (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/track" element={<Track />} />
      </Routes>
    </HashRouter>
);

export default AppRoutes;