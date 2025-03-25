import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API_ENDPOINTS from "../../api/endpoint";
import ScreenExitLayout from "../../components/ScreenExitLayout";

const initialJavaCode = `import java.util.Scanner;

public class Main {
    public static String writeCodeBelow(String s) {
        // Write your code below
        return "";
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String input = scanner.nextLine();
        scanner.close();
        
        System.out.println(writeCodeBelow(input));
    }
}`;

const Code = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(initialJavaCode);
  const [output, setOutput] = useState("");
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds

  useEffect(() => {
    const fetchLatestQuestion = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const resultId = localStorage.getItem("resultId");
        const response = await fetch(
          API_ENDPOINTS.GET_LATEST_CODING_QUESTION +
            `?user_id=${userId}&result_id=${resultId}`
        );
        const data = await response.json();
        if (response.ok) {
          setQuestion(data);
        } else {
          setError(data.message || "Failed to load question.");
        }
      } catch (err) {
        setError("Error fetching question.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestQuestion();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleRunCode();
      return;
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

  const handleRunCode = async () => {
    if (!question) {
      setOutput("No question loaded.");
      return;
    }

    const formData = new FormData();
    const file = new Blob([code], { type: "text/plain" });
    formData.append("file", file, "Main.java");

    try {
      const response = await fetch(
        `${API_ENDPOINTS.EXECUTE_TEST_CASES}?language=java&question_id=${question.question_id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (response.ok) {
        setOutput(
          data.result || "Code executed successfully, but no output received."
        );

        // Show success message for 5 seconds before navigating
        setTimeout(() => {
          navigate("/personalres");
        }, 5000);
      } else {
        setOutput(data.message || "Execution failed.");
      }
    } catch (error) {
      setOutput("Error executing code.");
    }
  };

  return (
    <ScreenExitLayout>
      <div className="w-screen h-screen flex">
        {/* Sidebar */}
        <div className="w-1/4 bg-blue-700 text-white p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-6">Coding Environment</h2>
          <button
            className="mb-4 bg-white text-blue-700 p-2 rounded"
            onClick={() => navigate("/dashboard")}
          >
            Back
          </button>

          <h3 className="text-lg font-semibold">
            Time Left: {formatTime(timeLeft)}
          </h3>

          {loading ? (
            <p>Loading question...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <h3 className="text-lg font-semibold">
                {question.question_description}
              </h3>
              <p className="text-sm mt-2">
                <strong>Input:</strong> {question.input_description}{" "}
              </p>
              <p className="text-sm mt-2">
                <strong>Output:</strong> {question.output_description}
              </p>
              <p className="text-sm mt-2">
                <strong>Constraints:</strong> {question.constraints}
              </p>
            </>
          )}
        </div>

        {/* Code Editor */}
        <div className="flex-1 p-6 flex flex-col">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Java Code Editor
          </h2>

          <Editor
            height="60vh"
            language="java"
            value={code}
            theme="vs-dark"
            onChange={(value) => setCode(value)}
          />

          <button
            className="mt-4 bg-green-600 text-white p-2 rounded"
            onClick={handleRunCode}
          >
            Run Code
          </button>

          <div className="mt-4 bg-gray-100 p-4 rounded text-black">
            <h4 className="font-semibold">Test Output:</h4>
            <pre>{output}</pre>
          </div>
        </div>
      </div>
    </ScreenExitLayout>
  );
};

export default Code;
