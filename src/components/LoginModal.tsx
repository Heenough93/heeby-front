import React, { useState } from "react";
import {useAuth} from "../context/AuthContext.tsx";
import {useFetchWithLoading} from "../hooks/useFetchWithLoading.tsx";
import "./LoginModal.css";

interface Props {
  closeLoginModal: () => void,
}

const LoginModal: React.FC<Props> = ({closeLoginModal: closeLoginModal}: Props) => {
  const { login } = useAuth();
  const fetchWithLoading = useFetchWithLoading();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const data = await fetchWithLoading("/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        mode: 'cors'
      });
      login(data);
      closeLoginModal();
    } catch (error) {
      alert("Fail to log in.");
    }
  }

  return (
      <div className="login-modal-overlay" onClick={closeLoginModal}>
        <div className="login-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="login-modal-heading">Login</h2>
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="email" className="login-label">Email</label>
            <input
                type="email"
                id="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
            />
            <label htmlFor="password" className="login-label">Password</label>
            <input
                type="password"
                id="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
            />
            <button type="submit" className="login-submit-button" onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
  );
};

export default LoginModal;
