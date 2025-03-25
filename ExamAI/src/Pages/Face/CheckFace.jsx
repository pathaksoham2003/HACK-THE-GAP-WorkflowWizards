import { useState, useRef } from "react";
import API_ENDPOINTS from "../../api/endpoint";

const UploadFace = () => {
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

        const formData = new FormData();
        formData.append("file", blob, "captured-image.png");

        try {
          const response = await fetch(`${API_ENDPOINTS.CHECK_FACE}?user_id=${userId}`, {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          if (response.ok) {
            alert("Image uploaded successfully!");
            console.log("Response:", data);
          } else {
            alert("Error: " + data.error);
          }
        } catch (error) {
          console.error("Upload error:", error);
          alert("Failed to upload image.");
        }
      }, "image/png");

      stopCamera();
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
      <h2 className="text-xl font-semibold mb-4">Capture and Upload Image</h2>

      {/* Camera Capture Section */}
      {cameraActive ? (
        <div className="mt-4">
          <video ref={videoRef} autoPlay className="w-64 h-64 border shadow-md"></video>
          <button
            onClick={captureAndUploadImage}
            className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
          >
            Capture & Upload
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

export default UploadFace;
