import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "../src/Pages/Login/Index";
import Dashboard from "../src/Pages/Dashboard/Dashboard";
import Quiz from "../src/Pages/Exam/Quiz";
import Code from "./Pages/Exam/Code";
import PersonalResponse from "./Pages/Exam/PersonalResponse";
import ScreenExitLayout from "./components/ScreenExitLayout";
import ExamCameraCapture from "./components/ExamCameraCapture";
import ImageUploadPage from "./components/ImageUploadPage";
import LanguageSelection from "./Pages/Exam/LanguageSelection";
import Register from "./Pages/Login/Register";
// import CreateExam from "./Pages/Exam/CreateExam";
import StartExam from "./Pages/Exam/StartExam";
import UploadFace from "./Pages/Face/UploadFace";
import CheckFace from "./Pages/Face/CheckFace";
import ResultsPage from "./Pages/Results/ResultsPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route element={<ScreenExitLayout />}> */}
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/code" element={<Code />} />
          <Route path="/personalres" element={<PersonalResponse />} />
          <Route path="/exam-camera" element={<ExamCameraCapture />} />
          <Route path="/upload-image" element={<ImageUploadPage />} />
          <Route path="/upload-face" element={<UploadFace />} />
          <Route path="/select-lang" element={<LanguageSelection />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/start-exam" element={<StartExam/>} />
          <Route path="/check-face" element={<CheckFace/>} />
          <Route path="/result" element={<ResultsPage/>} />


        {/* </Route> */}
       
        
      </Routes>
    </Router>
  );
}

export default App;
