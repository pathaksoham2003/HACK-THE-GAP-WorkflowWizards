import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../../api/endpoint";
import examAIImage from "../../assets/exam.png"; // Importing the background image

const StartExam = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleStartExam = async () => {
    const user_id = localStorage.getItem("userId"); // Get userId from localStorage
    console.log(user_id);

    if (!user_id) {
      setMessage("User not logged in. Please log in first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(API_ENDPOINTS.CREATE_EXAM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }), // Send only userId in the body
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("resultId", data.result_id); // Store resultId
        setMessage("Exam started successfully! Redirecting...");
        setTimeout(() => navigate("/quiz"), 1000);
      } else {
        setMessage(data.message || "Failed to start the exam. Please try again.");
      }
    } catch (error) {
      setMessage("Error: Unable to start the exam.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen bg-gray-100  bg-center" 
      style={{ backgroundImage: `url(${examAIImage})` }} // Applying the background image
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Start Exam</h2>
        <button
          onClick={handleStartExam}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Starting..." : "Start Exam"}
        </button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default StartExam;