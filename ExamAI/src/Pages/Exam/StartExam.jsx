// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API_ENDPOINTS from "../../api/endpoint";
// import examAIImage from "../../assets/exam.png"; // Importing the background image

// const StartExam = () => {
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleStartExam = async () => {
//     const user_id = localStorage.getItem("userId"); // Get userId from localStorage
//     console.log(user_id);

//     if (!user_id) {
//       setMessage("User not logged in. Please log in first.");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     try {
//       const response = await fetch(API_ENDPOINTS.CREATE_EXAM, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id }), // Send only userId in the body
//       });

//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem("resultId", data.result_id); // Store resultId
//         setMessage("Exam started successfully! Redirecting...");
//         setTimeout(() => navigate("/quiz"), 1000);
//         // setTimeout(() => navigate("/code"), 1000);
//         // setTimeout(() => navigate("/personalres"), 1000);
        
        

//       } else {
//         setMessage(data.message || "Failed to start the exam. Please try again.");
//       }
//     } catch (error) {
//       setMessage("Error: Unable to start the exam.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div 
//       className="flex flex-col items-center justify-center h-screen bg-gray-100  bg-center" 
//       style={{ backgroundImage: `url(${examAIImage})` }} // Applying the background image
//     >
//       <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg text-center">
//         <h2 className="text-xl font-semibold text-gray-700 mb-4">Start Exam</h2>
//         <button
//           onClick={handleStartExam}
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//           disabled={loading}
//         >
//           {loading ? "Starting..." : "Start Exam"}
//         </button>
//         {message && <p className="mt-4 text-red-500">{message}</p>}
//       </div>
//     </div>
//   );
// };

// export default StartExam;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../../api/endpoint";
import examAIImage from "../../assets/exam.png"; // Background Image

const StartExam = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes countdown
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleStartExam = async () => {
    const user_id = localStorage.getItem("userId");
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
        body: JSON.stringify({ user_id }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("resultId", data.result_id);
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

  const handleSubmit = () => {
    setMessage("Time is up or submitted early. Redirecting...");
    setTimeout(() => navigate("/code"), 2000); // Move to the next section after 2 sec
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen bg-gray-100 bg-center bg-cover relative" 
      style={{ backgroundImage: `url(${examAIImage})` }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Start Exam</h2>

        {/* Timer Display */}
        <p className="text-lg font-bold text-red-600 mb-4">Time Left: {formatTime(timeLeft)}</p>

        {/* Start Exam Button */}
        <button
          onClick={handleStartExam}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Starting..." : "Start Exam"}
        </button>

        {/* Submit Early Button */}
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded ml-4 hover:bg-green-700"
        >
          Submit & Proceed
        </button>

        {message && <p className="mt-4 text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default StartExam;
