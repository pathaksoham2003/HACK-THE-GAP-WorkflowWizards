import React from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import examAIImage from "../../assets/exam.png"; // Background blur image

const ResultsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src={examAIImage}
        alt="Background"
        className="absolute w-full h-full object-cover blur-md"
      />
      
      {/* Back Button */}
      <button 
        className="absolute top-5 left-5 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 transition"
        onClick={() => navigate(-1)}
      >
        <IoArrowBack size={24} />
      </button>

      {/* Result Container */}
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-3/4 max-w-lg text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Exam Results</h2>
        
        <div className="grid grid-cols-2 gap-4 text-lg text-gray-700">
          <p className="font-semibold">Quiz Marks:</p>
          <p>85/100</p>
          <p className="font-semibold">Coding Marks:</p>
          <p>90/100</p>
          <p className="font-semibold">Behavioral Marks:</p>
          <p>75/100</p>
          <p className="font-semibold">Final Result:</p>
          <p className="text-green-600 font-semibold">Passed</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;