import React, { useState, useContext } from "react";
import apiFetch from "../api/fetch";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiFetch("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", response.token);
      login(response.token, response.username);
      setMessageType("success");
      setMessage("User authenticated successfully!");
      navigate("/myrecipes");
    } catch (error) {
      setMessageType("error");
      setMessage("Error authenticating user: " + error.message);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const response = await apiFetch("/users/auth/google", {
        method: "POST",
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      localStorage.setItem("token", response.token);
      login(response.token, response.username);
      navigate("/matching");
    } catch (error) {
      setMessageType("error");
      setMessage("Google login failed: " + error.message);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    setMessageType("error");
    setMessage("Google login failed: " + error.error);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="input-field">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-2 border rounded bg-gray-800 text-gray-200 placeholder-gray-500 focus:border-yellow-500"
          />
        </div>
        <div className="input-field">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-2 border rounded bg-gray-800 text-gray-200 placeholder-gray-500 focus:border-yellow-500"
          />
        </div>
        <button
          type="submit"
          className="btn w-full py-2 rounded bg-yellow-500 text-gray-900 hover:bg-yellow-400"
        >
          Login
        </button>
      </form>
      {message && (
        <p
          className={
            messageType === "success" ? "green-text mt-4" : "red-text mt-4"
          }
        >
          {message}
        </p>
      )}
      <div className="mt-4">
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onFailure={handleGoogleLoginFailure}
        />
      </div>
    </div>
  );
};

export default Login;
