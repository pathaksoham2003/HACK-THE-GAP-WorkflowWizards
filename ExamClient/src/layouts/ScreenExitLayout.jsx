import {useEffect, useState} from "react";

const ScreenExitLayout = ({children}) => {
  const [warning, setWarning] = useState("");

  useEffect(() => {
    // Enter fullscreen mode
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

    // Handle tab switch or minimize
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarning("Warning: You switched tabs or minimized the window!");
        console.log("User switched tabs or minimized the window!");
      }
    };

    // Handle window blur (user changing windows)
    const handleBlur = () => {
      setWarning("Warning: You switched windows!");
      console.log("User switched windows!");
    };

    // Handle window close attempt
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue =
        "Are you sure you want to leave? Your exam will be submitted!";
    };

    // Handle fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setWarning("Warning: You exited fullscreen mode!");
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
      // Remove event listeners when component unmounts
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Exit Exam - Remove fullscreen mode
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
    console.log("User exited the exam.");
    setWarning("You have exited the exam!");
  };

  return <div className="w-full h-full">{children}</div>;
};

export default ScreenExitLayout;
