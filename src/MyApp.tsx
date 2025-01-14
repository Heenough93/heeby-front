import React from "react";
import { BrowserRouter as Router, NavLink } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.tsx";
import {useLoading} from "./context/LoadingContext.tsx";
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
                <pre className="ascii-art">
                  {heeby}
                </pre>
            <nav className="nav">
              <NavLink to="/" className="nav-link" end>
                Home
              </NavLink>
              <NavLink to="/blog" className="nav-link">
                Blog
              </NavLink>
            </nav>
          </header>
          <main className="main">
            <AppRoutes />
          </main>
        </div>
      </Router>
  );
};

export default MyApp;
