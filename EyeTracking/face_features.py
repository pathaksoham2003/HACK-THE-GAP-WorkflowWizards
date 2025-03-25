import cv2
import dlib
import os

# Load dlib's face detector
detector = dlib.get_frontal_face_detector()

# Load dlib's shape predictor model
cwd = os.path.abspath(os.path.dirname(__file__))
model_path = os.path.join(".","shape_predictor_68_face_landmarks.dat")
predictor = dlib.shape_predictor(model_path)

# Start webcam feed
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = detector(gray)

    for face in faces:
        landmarks = predictor(gray, face)

        # Draw facial landmarks
        for n in range(68):
            x, y = landmarks.part(n).x, landmarks.part(n).y
            cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

    cv2.imshow("Face Landmarks", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
