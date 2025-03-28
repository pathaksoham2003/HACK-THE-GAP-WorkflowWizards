// import React, { useState, useEffect } from "react";
// import API_ENDPOINTS from "../../api/endpoint";
// import examAIImage from "../../assets/exam.png"; // Background Image
// import {useNavigate} from 'react-router-dom'

// const Quiz = () => {
//   const [topic, setTopic] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const questionsPerPage = 5;
//   const topics = ["html", "css", "javascript", "java", "django"];
//   const navigate = useNavigate();

//   const userId = localStorage.getItem("userId");
//   const resultId = localStorage.getItem("resultId");

//   useEffect(() => {
//     if (!topic) return;
//     setLoading(true);
//     setError(null);

//     const fetchQuestions = async () => {
//       try {
//         const response = await fetch(API_ENDPOINTS.GET_RANDOM_QUESTIONS(topic, resultId , userId));
//         if (!response.ok) throw new Error("Failed to fetch questions");
//         const data = await response.json();
//         setQuestions(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [topic]);

//   const handleOptionClick = (questionId, selectedOption) => {
//     setSelectedAnswers({ ...selectedAnswers, [questionId]: selectedOption });
//   };

//   const handleNext = () => {
//     if ((currentPage + 1) * questionsPerPage < questions.length) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentPage > 0) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     const score = questions.filter(
//       (q) => selectedAnswers[q.id] === q.correctAnswer
//     ).length;

//     const user_id = localStorage.getItem("userId");
//     const result_id = localStorage.getItem("resultId");

//     if (!user_id || !result_id) {
//       alert("User ID or Result ID missing. Please restart the exam.");
//       return;
//     }

//     try {
//       const response = await fetch(API_ENDPOINTS.SUBMIT_QUIZ, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ user_id, result_id, marks: score }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert(`Your score: ${score}/${questions.length}`);
//         navigate("/code"); // Proceed to the coding section
//       } else {
//         alert(data.error || "Failed to submit score.");
//       }
//     } catch (error) {
//       alert("Error: Unable to submit score. Please try again.");
//     }
//   };

//   if (!topic) {
//     return (
//       <div className="flex h-screen justify-center items-center flex-col bg-cover bg-center" style={{ backgroundImage: `url(${examAIImage})` }}>
//         <h2 className="text-lg font-semibold mb-4 bg-white p-4 rounded">Select a Topic</h2>
//         <div className="flex gap-4">
//           {topics.map((t) => (
//             <button
//               key={t}
//               className="p-2 bg-white/80 text-blue-900 rounded"
//               onClick={() => setTopic(t)}
//             >
//               {t.toUpperCase()}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const attemptedCount = Object.keys(selectedAnswers).length;

//   return (
//     <div className="flex h-screen bg-cover bg-center" style={{ backgroundImage: `url(${examAIImage})` }}>
//       <div className="w-1/4 bg-blue-600 text-black p-6">
//         <h3 className="text-lg font-semibold mb-4">Quiz Summary</h3>
//         <p>Total Questions: {questions.length}</p>
//         <p>Attempted: {attemptedCount}</p>
//         <div className="mt-4">
//           <h4 className="text-md font-semibold">Questions</h4>
//           <div className="grid grid-cols-5 gap-2 mt-2">
//             {questions.map((q, index) => (
//               <button
//                 key={q.id}
//                 className={`p-2 border rounded ${selectedAnswers[q.id] ? "bg-green-500 text-white" : "bg-white"}`}
//                 onClick={() => setCurrentPage(Math.floor(index / questionsPerPage))}
//               >
//                 {index + 1}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="w-3/4 p-6 overflow-y-auto bg-white bg-opacity-90 rounded-lg">
//         {loading && <div className="text-center">Loading...</div>}
//         {error && <div className="text-center text-red-600">{error}</div>}
//         {!loading && !error && topic && (
//           <>
//             {questions.slice(
//               currentPage * questionsPerPage,
//               (currentPage + 1) * questionsPerPage
//             ).map((q) => (
//               <div key={q.id} className="mb-6">
//                 <h2 className="text-2xl font-semibold mb-2">{q.question}</h2>
//                 <div className="flex flex-col gap-2">
//                   {["optionA", "optionB", "optionC", "optionD"].map((key) => (
//                     <button
//                       key={key}
//                       className={`p-2 border rounded ${
//                         selectedAnswers[q.id] === q[key] ? "bg-blue-500 text-white" : "bg-white"
//                       }`}
//                       onClick={() => handleOptionClick(q.id, q[key])}
//                     >
//                       {q[key]}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             ))}
//             <div className="mt-4 flex justify-between">
//               <button onClick={handlePrevious} className="bg-gray-500 text-white px-4 py-2 rounded" disabled={currentPage === 0}>
//                 Previous
//               </button>
//               {((currentPage + 1) * questionsPerPage >= questions.length) ? (
//                 <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
//                   Submit
//                 </button>
//               ) : (
//                 <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">
//                   Next
//                 </button>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Quiz;

import React, { useState, useEffect } from "react";
import API_ENDPOINTS from "../../api/endpoint";
import examAIImage from "../../assets/exam.png";
import { useNavigate } from "react-router-dom";
import ScreenExitLayout from "../../components/ScreenExitLayout";

const Quiz = () => {
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const questionsPerPage = 5;
  const topics = ["html", "css", "javascript", "java", "django"];
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const resultId = localStorage.getItem("resultId");

  useEffect(() => {
    if (!topic) return;
    setLoading(true);
    setError(null);

    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          API_ENDPOINTS.GET_RANDOM_QUESTIONS(topic, resultId, userId)
        );
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topic]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOptionClick = (questionId, selectedOption) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: selectedOption });
  };

  const handleNext = () => {
    if ((currentPage + 1) * questionsPerPage < questions.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubmit = async () => {
    const score = questions.filter(
      (q) => selectedAnswers[q.id] === q.correctAnswer
    ).length;

    try {
      const response = await fetch(API_ENDPOINTS.SUBMIT_QUIZ, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          result_id: resultId,
          marks: score,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Your score: ${score}/${questions.length}`);
        navigate("/code");
      } else {
        alert(data.error || "Failed to submit score.");
      }
    } catch (error) {
      alert("Error: Unable to submit score. Please try again.");
    }
  };

  if (!topic) {
    return (
      <div
        className="flex h-screen justify-center items-center flex-col bg-cover bg-center"
        style={{ backgroundImage: `url(${examAIImage})` }}
      >
        <h2 className="text-lg font-semibold mb-4 bg-white p-4 rounded">
          Select a Topic
        </h2>
        <div className="flex gap-4">
          {topics.map((t) => (
            <button
              key={t}
              className="p-2 bg-white/80 text-blue-900 rounded"
              onClick={() => setTopic(t)}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ScreenExitLayout>
      <div
        className="flex h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${examAIImage})` }}
      >
        <div className="w-1/4 bg-blue-600 text-black p-6">
          <h3 className="text-lg font-semibold mb-4">Quiz Summary</h3>
          <p>Total Questions: {questions.length}</p>
          <p>Time Left: {formatTime(timeLeft)}</p>
          <p>Attempted: {Object.keys(selectedAnswers).length}</p>
          <div className="mt-4">
            <h4 className="text-md font-semibold">Questions</h4>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  className={`p-2 border rounded ${
                    selectedAnswers[q.id]
                      ? "bg-green-500 text-white"
                      : "bg-white"
                  }`}
                  onClick={() =>
                    setCurrentPage(Math.floor(index / questionsPerPage))
                  }
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-3/4 p-6 overflow-y-auto bg-white bg-opacity-90 rounded-lg">
          {loading && <div className="text-center">Loading...</div>}
          {error && <div className="text-center text-red-600">{error}</div>}
          {!loading && !error && topic && (
            <>
              {questions
                .slice(
                  currentPage * questionsPerPage,
                  (currentPage + 1) * questionsPerPage
                )
                .map((q) => (
                  <div key={q.id} className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">
                      {q.question}
                    </h2>
                    <div className="flex flex-col gap-2">
                      {["optionA", "optionB", "optionC", "optionD"].map(
                        (key) => (
                          <button
                            key={key}
                            className={`p-2 border rounded ${
                              selectedAnswers[q.id] === q[key]
                                ? "bg-blue-500 text-white"
                                : "bg-white"
                            }`}
                            onClick={() => handleOptionClick(q.id, q[key])}
                          >
                            {q[key]}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={handlePrevious}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  disabled={currentPage === 0}
                >
                  Previous
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
                <button
                  onClick={handleNext}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </ScreenExitLayout>
  );
};

export default Quiz;
