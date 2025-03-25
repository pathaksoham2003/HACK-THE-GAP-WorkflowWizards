import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import examAIImage from "../../assets/exam.png";
import { IoNewspaperOutline } from "react-icons/io5";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="w-screen h-screen bg-blue-100 flex">
      {/* Sidebar */}
      <div className="w-1/5 bg-blue-700 text-white p-6 flex flex-col justify-between">
        <div>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <IoNewspaperOutline /> ExamAI
          </h2>
          <nav className="flex flex-col gap-4">
            <button onClick={() => navigate("/start-exam")} className="hover:underline">Start Quiz</button>
            <button onClick={() => navigate("/code")} className="hover:underline">Start Coding Question</button>
            <button onClick={() => navigate("/personalres")} className="hover:underline">Behavioural Interview</button>
            <button className="hover:underline">Result</button>
            <button onClick={() => navigate("/upload-face")} className="hover:underline">Upload Face</button>
          </nav>
        </div>
        
        {/* Footer */}
        <div className="text-sm text-gray-200 mt-6 border-t border-gray-400 pt-4">
          <p>Contact: 9860452210</p>
          <p>Email: demo@gmail.com</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-8 flex flex-col items-center justify-center">
        {/* PNG Image */}
        <img 
          src={examAIImage} 
          alt="Exam AI" 
          className="w-80 h-80 mb-4 animate-bounce motion-safe:animate-[bounce_2s_infinite]" 
        />

        {/* Welcome Text */}
        <h1 className="text-3xl font-bold text-blue-600">Welcome to ExamAI</h1>
        <p className="text-gray-700 mt-2">Your trusted platform for online examinations</p>
        
        {/* Start Test Button */}
        <button 
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowPopup(true)}
        >
          Start Test
        </button>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold text-blue-700">Start Test with ExamAI</h2>
            <p className="text-gray-600 mt-2">Get ready for your online exam.</p>
            <div className="mt-4 flex justify-center gap-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={() => navigate("/start-exam")}>Proceed</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;