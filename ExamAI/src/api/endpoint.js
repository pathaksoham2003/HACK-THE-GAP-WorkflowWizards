const BASE_URL = "http://172.16.133.204:4320/api"; 
const API_ENDPOINTS = {
  GET_RANDOM_QUESTIONS: (topic,resultId,userId) => `${BASE_URL}/quiz/random/?topic=${topic}&result_id=${resultId}&user_id=${userId}`,
  REGISTER_USER: `${BASE_URL}/register/`, // Added register API
  LOGIN_USER: `${BASE_URL}/login/`, 
  CREATE_EXAM: `${BASE_URL}/exam/create`, 
  START_EXAM: `${BASE_URL}/exam/create`,
  GET_LATEST_CODING_QUESTION: `${BASE_URL}/coding/random/`, // New API to fetch the latest coding question
  EXECUTE_TEST_CASES: `${BASE_URL}/execute_test_cases/`,
  FACE_UPLOAD: `${BASE_URL}/generate-face-encoding/`,
 CHECK_FACE: `${BASE_URL}/check-face/`,
 SUBMIT_QUIZ: `${BASE_URL}/quiz/random/`,
 BEHAVIOUR: `${BASE_URL}/behaviour/`

};

export default API_ENDPOINTS;

