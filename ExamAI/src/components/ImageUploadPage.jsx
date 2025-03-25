import { useState, useRef } from "react";

const ImageUploadPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedImage(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Start Camera
  const startCamera = async () => {
    setCameraActive(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // Capture Image from Camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageUrl = canvasRef.current.toDataURL("image/png");

      setPreviewUrl(imageUrl);
      setSelectedImage(imageUrl);
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

  // Handle image upload (Mock function)
  const handleUpload = () => {
    if (!selectedImage) {
      alert("Please select or capture an image first.");
      return;
    }

    // Simulate an upload process
    console.log("Uploading image:", selectedImage);
    alert("Image uploaded successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h2 className="text-xl font-semibold mb-4">Upload or Capture Candidate Image</h2>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4 border p-2 rounded-lg"
      />

      {/* Camera Capture Section */}
      {cameraActive ? (
        <div className="mt-4">
          <video ref={videoRef} autoPlay className="w-64 h-64 border shadow-md"></video>
          <button
            onClick={captureImage}
            className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
          >
            Capture Photo
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

      {/* Image Preview */}
      {previewUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Selected Image:</h3>
          <img
            src={previewUrl}
            alt="Selected"
            className="mt-2 w-64 h-64 rounded-lg border shadow-md"
          />
        </div>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Upload Image
      </button>
    </div>
  );
};

export default ImageUploadPage;
