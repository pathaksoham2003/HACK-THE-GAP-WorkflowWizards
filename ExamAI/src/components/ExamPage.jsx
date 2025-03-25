import ScreenExitLayout from "../components/ScreenExitLayout";
import { ToastContainer } from "react-toastify";

const ExamPage = () => {
  return (
    <ScreenExitLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Online Exam</h1>
        <p className="text-gray-600">Please do not switch tabs or exit fullscreen mode.</p>
        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
          Submit Exam
        </button>
        {/* Toastify Container for Notifications */}
        {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      </div>
    </ScreenExitLayout>
  );
};

export default ExamPage;
