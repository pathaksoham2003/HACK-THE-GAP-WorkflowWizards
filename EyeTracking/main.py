import cv2

# Load Haarcascades using OpenCV's built-in paths
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye_tree_eyeglasses.xml')

# Open the webcam
cap = cv2.VideoCapture(0)

HANDLING_EYES = {
    'a':{
        'LEFT_EYE':[],
        'RIGHT_EYE':[],
        'FACE':[]
    }
}


while cap.isOpened():
    _, img = cap.read()
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    for (x, y, w, h) in faces: 
        cv2.rectangle(img, (x, y), (x + w, y + h), (255, 0, 0), 3)
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = img[y:y+h, x:x+w]
        
        eyes = eye_cascade.detectMultiScale(roi_gray)
        for (ex, ey, ew, eh) in eyes: 
            cv2.rectangle(roi_color, (ex, ey), (ex + ew, ey + eh), (0, 255, 0), 2)
    
    # Show the output frame
    cv2.imshow('Face and Eye Detection', img)
    
    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'): 
        break 

cap.release()
cv2.destroyAllWindows()
