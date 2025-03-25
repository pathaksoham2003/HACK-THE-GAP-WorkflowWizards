import { useState, useRef } from "react";
import API_ENDPOINTS from "../../api/endpoint";
import { useNavigate } from "react-router-dom";

const CheckFace = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Start Camera
  const startCamera = async () => {
    setCameraActive(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // Capture Image from Camera and Upload
  const captureAndUploadImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      // Convert canvas image to Blob
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;

        const userId = localStorage.getItem("userId");
        if (!userId) {
          alert("User ID not found.");
          return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", blob, "captured-image.png");

        try {
          // Upload the image for face check
          const response = await fetch(`${API_ENDPOINTS.CHECK_FACE}?user_id=${userId}`, {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          if (response.ok && data.matched) {
            alert("Candidate matched successfully!");
            console.log("Match Response:", data);
            navigate("/start-exam")
          } else {
            alert("Face match failed: " + data.error);
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Failed to process image.");
        } finally {
          setIsUploading(false);
          stopCamera();
        }
      }, "image/png");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h2 className="text-xl font-semibold mb-4">Capture and Check Face</h2>

      {/* Camera Capture Section */}
      {cameraActive ? (
        <div className="mt-4">
          <video ref={videoRef} autoPlay className="w-64 h-64 border shadow-md"></video>
          <button
            onClick={captureAndUploadImage}
            className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
            disabled={isUploading}
          >
            {isUploading ? "Processing..." : "Capture & Check Face"}
          </button>
        </div>
      ) : (
        <button
          onClick={startCamera}
          className="mt-2 px-6 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800"
        >
          Open Camera
        </button>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
};

export default CheckFace;
