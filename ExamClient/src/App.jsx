import { useEffect, useRef, useState } from "react";

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [brightness, setBrightness] = useState(0);

  useEffect(() => {
    // Access the user's camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();
  }, []);

  useEffect(() => {
    const analyzeBrightness = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Set canvas size equal to video frame size
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Draw current video frame to canvas
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      let totalBrightness = 0;
      let totalPixels = pixels.length / 4; // 4 values per pixel (RGBA)

      for (let i = 0; i < pixels.length; i += 4) {
        // Brightness formula: (R + G + B) / 3
        const brightnessValue = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        totalBrightness += brightnessValue;
      }

      const avgBrightness = totalBrightness / totalPixels;
      setBrightness(Math.round(avgBrightness)); // Round to nearest integer
    };

    // Run brightness detection every 500ms
    const interval = setInterval(analyzeBrightness, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Real-Time Camera Brightness Detection</h1>
      <video ref={videoRef} autoPlay playsInline className="w-64 h-48 rounded-lg shadow-lg border-2 border-gray-300" />
      <canvas ref={canvasRef} className="hidden"></canvas>
      <p className="mt-4 text-lg font-semibold">
        Brightness Level: <span className="text-blue-500">{brightness}</span>
      </p>
    </div>
  );
};

export default App;
