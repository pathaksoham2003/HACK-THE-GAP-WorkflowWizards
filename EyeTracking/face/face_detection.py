import cv2
import face_recognition
import pickle
import numpy as np

# Load the encoding file
print("Loading Encode File ...")
file = open('EncodeFile.p', 'rb')
encodeListKnownWithIds = pickle.load(file)
file.close()
encodeListKnown, studentIds = encodeListKnownWithIds
print("Encode File Loaded")

cap = cv2.VideoCapture(0)  # Open webcam
cap.set(3, 640)  # Set width
cap.set(4, 480)  # Set height

while True:
    success, img = cap.read()
    
    if not success:
        continue

    imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)  # Resize for faster processing
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

    faceCurFrame = face_recognition.face_locations(imgS)
    encodeCurFrame = face_recognition.face_encodings(imgS, faceCurFrame)

    for encodeFace, faceLoc in zip(encodeCurFrame, faceCurFrame):
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)

        matchIndex = np.argmin(faceDis)

        if matches[matchIndex]:
            print(f"Recognized ID: {studentIds[matchIndex]}")
            y1, x2, y2, x1 = faceLoc
            y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(img, studentIds[matchIndex], (x1, y1 - 10),
                        cv2.FONT_HERSHEY_COMPLEX, 0.6, (0, 255, 0), 2)

    cv2.imshow("Face Recognition", img)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
