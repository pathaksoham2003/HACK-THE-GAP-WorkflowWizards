import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../../api/endpoint";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({
    user_type: "student",
    emailAddress: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      navigate("/upload-face");
      
    } catch (error) {
      alert("Camera & Microphone access is required to proceed.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN_USER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        // Store userId in localStorage
        localStorage.setItem("userId", data.user_id);
        setMessage("Login successful! Redirecting...");
        
        setTimeout(() => {
          requestPermissions();
        }, 1000);
      } else {
        setMessage(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setMessage("Error: Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-blue-600">
      <h1 className="text-white text-2xl font-semibold mb-6">
        Are you a Student or Teacher?
      </h1>
      <div className="flex gap-6">
        <button className="bg-white text-black font-medium px-6 py-2 rounded-full shadow-md hover:bg-gray-200 transition">
          Teacher
        </button>
        <button
          className="bg-white text-black font-medium px-6 py-2 rounded-full shadow-md hover:bg-gray-200 transition"
          onClick={() => setShowLogin(true)}
        >
          Student
        </button>
      </div>
      {showLogin && (
        <div className="absolute top-0 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-lg">
            <h2 className="text-lg font-semibold text-blue-600 mb-4">LOGIN</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-gray-600 text-sm">User Type</label>
                <select
                  name="user_type"
                  value={formData.user_type}
                  onChange={handleChange}
                  className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 p-1"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Email</label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 p-1"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="text-gray-600 text-sm">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 p-1"
                  placeholder="Enter your password"
                  required
                />
              </div>
              {message && <p className="text-green-500 text-sm">{message}</p>}
              <div className="mt-4 text-sm text-gray-600">
                * Don't have an account?{" "}
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Register
                </span>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  type="button"
                  className="bg-gray-400 text-white font-medium px-6 py-2 rounded-full shadow-md hover:bg-gray-500 transition"
                  onClick={() => setShowLogin(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white font-medium px-6 py-2 rounded-full shadow-md hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
