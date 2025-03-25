import { useState, useRef } from "react";

const ImageUploadPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const userId = "123"; // Replace with dynamic user ID if needed

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
      
      // Convert canvas to Blob (File object)
      canvasRef.current.toBlob((blob) => {
        const file = new File([blob], "captured_image.png", { type: "image/png" });
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        stopCamera();
      }, "image/png");
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!selectedImage) {
      alert("Please select or capture an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("image", selectedImage);

    try {
      const response = await fetch("YOUR_UPLOAD_API_ENDPOINT", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Image uploaded successfully!");
      } else {
        alert(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      alert("Error uploading image.");
      console.error(error);
    }
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
