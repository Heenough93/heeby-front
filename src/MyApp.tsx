import React from "react";
import { HashRouter as Router, NavLink } from "react-router-dom";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import AppRoutes from "./routes/AppRoutes.tsx";
import { useLoading } from "./context/LoadingContext.tsx";
import LoadingSpinner from "./components/LoadingSpinner.tsx";
import "./App.css";

const MyApp: React.FC = () => {
  const { isLoading } = useLoading();

  const heeby = `
    __              __
   / /_  ___  ___  / /_  __  __
  / __ \\/ _ \\/ _ \\/ __ \\/ / / /
 / / / /  __/  __/ /_/ / /_/ /
/_/ /_/\\___/\\___/_.___/\\__, /
                      /____/
  `;

  return (
      <Router>
        {isLoading && <LoadingSpinner />}
        <div className="app">
          <header className="header">
            <pre className="ascii-art">{heeby}</pre>
            <nav className="nav">
              <NavLink to="/" className="nav-link" end>
                Home
              </NavLink>
              <NavLink to="/blog" className="nav-link">
                Blog
              </NavLink>
              <NavLink to="/track" className="nav-link">
                Track
              </NavLink>
            </nav>
          </header>
          <main className="main">
            <AppRoutes />
          </main>
          <footer className="footer">
            <p>&copy; 2025 Heebyeong Park. All rights reserved.</p>
            <div className="social-icons">
              <a href="https://instagram.com/_heeby" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://github.com/Heenough93" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com/in/joeypark93" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
            </div>
          </footer>
        </div>
      </Router>
  );
};

export default MyApp;
