import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ScreenExitLayout = ({ children }) => {
  const [warning, setWarning] = useState("");

  useEffect(() => {
    // Request fullscreen mode when component mounts
    const enterFullscreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    };

    // Show warning when user switches tabs
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarning("Warning: You switched tabs or minimized the window!");
        toast.warning("⚠ You switched tabs or minimized the window!");
        console.log("User switched tabs or minimized the window!");
      }
    };

    // Show warning when user changes windows
    const handleBlur = () => {
      setWarning("Warning: You switched windows!");
      toast.warning("⚠ You switched windows!");
      console.log("User switched windows!");
    };

    // Prevent user from closing the window
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave? Your exam will be submitted!";
    };

    // Show warning when user exits fullscreen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setWarning("Warning: You exited fullscreen mode!");
        toast.warning("⚠ You exited fullscreen mode!");
        console.log("User exited fullscreen mode!");
      }
    };

    // Attach event listeners
    enterFullscreen();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      // Cleanup event listeners when component unmounts
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Function to manually exit the exam
  const exitExam = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    toast.error("❌ You have exited the exam!");
    console.log("User exited the exam.");
    setWarning("You have exited the exam!");
  };

  return (
    <div className="w-full h-full">
      {children}
      {warning && (
        <div className="fixed bottom-5 left-5 bg-red-500 text-white p-3 rounded-lg shadow-lg">
          {warning}
        </div>
      )}
      {/* Button to manually exit the exam */}
      <button
        onClick={exitExam}
        className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow-lg"
      >
        Exit Exam
      </button>
    </div>
  );
};

export default ScreenExitLayout;
