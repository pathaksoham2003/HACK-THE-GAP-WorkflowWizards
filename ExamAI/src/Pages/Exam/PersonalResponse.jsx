import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../../api/endpoint";
import ScreenExitLayout from "../../components/ScreenExitLayout";

const PersonalResponse = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const resultId = localStorage.getItem("resultId");
        const res = await fetch(
          API_ENDPOINTS.BEHAVIOUR + `?user_id=${userId}&result_id=${resultId}`
        );
        const data = await res.json();

        if (res.ok) {
          setQuestion(data.question_text);
        } else {
          setError("Failed to fetch question.");
        }
      } catch (err) {
        setError("Error fetching question.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = async () => {
    if (!response.trim()) {
      setMessage("Response cannot be empty.");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const resultId = localStorage.getItem("resultId");
      const res = await fetch(
        API_ENDPOINTS.BEHAVIOUR + `?user_id=${userId}&result_id=${resultId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: question, answer: response }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setMessage("Response submitted successfully!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setMessage(data.error || "Failed to submit response.");
      }
    } catch (err) {
      setMessage("Error submitting response.");
    }
  };

  return (
    <ScreenExitLayout>
      <div className="w-screen h-screen flex">
        {/* Sidebar */}
        <div className="w-1/4 bg-blue-700 text-white p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-6">Personal Response</h2>
          <button
            className="mb-4 bg-white text-blue-700 p-2 rounded"
            onClick={() => navigate("/dashboard")}
          >
            Back
          </button>

          {loading ? (
            <p>Loading question...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <>
              <h3 className="text-md font-semibold">{question}</h3>
              <p className="text-sm mt-2">
                Write a short response based on the question above.
              </p>
            </>
          )}

          <p className="mt-4 text-lg font-semibold">
            Time Left: {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        </div>

        {/* Response Editor */}
        <div className="flex-1 p-6 flex flex-col">
          <textarea
            className="w-full h-60 border p-4 rounded-md"
            placeholder="Write your response here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
          <button
            className="mt-4 bg-green-600 text-white p-2 rounded"
            onClick={handleSubmit}
          >
            Submit Response
          </button>
          {message && <p className="mt-2 text-blue-600">{message}</p>}
        </div>
      </div>
    </ScreenExitLayout>
  );
};

export default PersonalResponse;
