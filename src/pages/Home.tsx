import React, { useState } from "react";
import {useAuth} from "../context/AuthContext.tsx";
import LoginModal from "../components/LoginModal.tsx";
import './Home.css';

const Home = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  return (
      <div className="home-container">
        <h1 className="home-heading">Hello, World!</h1>
        <p className="home-intro">
          I'm Heebyeong Park, but you can just call me Heeby. <br />
          I'm a developer who loves traveling, and that's why I created this website to share my adventures.<br />
          Welcome to my place where I share my experiences!
        </p>
        <pre className="home-pre">
          {`const message = 'You'll never know until you try!';`}
        </pre>
        {isAuthenticated ? (
            <button className="floating-login-button" onClick={logout}>
              Logout
            </button>
        ) : (
            <button className="floating-login-button" onClick={openLoginModal}>
              Login
            </button>
        )}

        {/* 로그인 모달 */}
        {isLoginModalOpen && <LoginModal closeLoginModal={closeLoginModal} />}
      </div>
  );
};

export default Home;
