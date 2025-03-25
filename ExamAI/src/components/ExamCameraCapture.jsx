import { useRef, useState, useEffect } from "react";

const ExamCameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Access the user's webcam
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied. Please allow camera permissions.");
        console.error("Error accessing camera:", err);
      }
    };

    startCamera();

    return () => {
      // Stop the camera when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture photo from video stream
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to image data URL
      const imageData = canvas.toDataURL("image/png");
      setCapturedImage(imageData);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h2 className="text-xl font-semibold mb-4">Candidate Photo Capture</h2>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Live Camera Feed */}
          <video ref={videoRef} autoPlay playsInline className="w-full max-w-md rounded-lg shadow-md" />

          {/* Capture Button */}
          <button onClick={capturePhoto} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
            Capture Photo
          </button>

          {/* Display Captured Image */}
          {capturedImage && (
            <div className="mt-4">
              <h3 className="text-lg font-medium">Captured Image:</h3>
              <img src={capturedImage} alt="Captured" className="mt-2 w-64 h-64 rounded-lg border" />
            </div>
          )}

          {/* Hidden Canvas to Process Image */}
          <canvas ref={canvasRef} className="hidden"></canvas>
        </>
      )}
    </div>
  );
};

export default ExamCameraCapture;
