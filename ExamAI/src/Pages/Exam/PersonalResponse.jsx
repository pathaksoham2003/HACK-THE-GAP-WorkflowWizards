import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PersonalResponse = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState("");

  const sampleQuestion = {
    title: "Describe Yourself",
    description: "Write a short paragraph about yourself, including your interests and goals."
  };

  return (
    <div className="w-screen h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-blue-700 text-white p-6 flex flex-col">
        <h2 className="text-lg font-semibold mb-6">Personal Response</h2>
        <button className="mb-4 bg-white text-blue-700 p-2 rounded" onClick={() => navigate("/dashboard")}>Back</button>
        <h3 className="text-md font-semibold">{sampleQuestion.title}</h3>
        <p className="text-sm mt-2">{sampleQuestion.description}</p>
      </div>

      {/* Response Editor */}
      <div className="flex-1 p-6 flex flex-col">
        <textarea
          className="w-full h-60 border p-4 rounded-md"
          placeholder="Write your response here..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        />
        <button className="mt-4 bg-green-600 text-white p-2 rounded">Submit Response</button>
      </div>
    </div>
  );
};

export default PersonalResponse;
