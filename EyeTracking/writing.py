import cv2
import numpy as np
from GazeTracking.gaze_tracking import GazeTracking

# Load Haar Cascade for face and eye detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye_tree_eyeglasses.xml')
gaze = GazeTracking()

# Read the image 
img = cv2.imread("./data/face/soham.jpg")

gaze.refresh(img)
anno_frame = gaze.annotated_frame()
    
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Create a black mask of the same size as the original image
mask = np.zeros_like(img)

# Detect faces
faces = face_cascade.detectMultiScale(gray, 1.1, 4)

valid_faces = []

for (x, y, w, h) in faces: 
    roi_gray = gray[y:y+h, x:x+w]
    
    # Detect eyes inside the face region
    eyes = eye_cascade.detectMultiScale(roi_gray)
    
    if len(eyes) > 0:  # Ensure at least one eye is detected
        # Copy the detected face onto the mask (preserving only this region)
        mask[y:y+h, x:x+w] = img[y:y+h, x:x+w]
        gaze.refresh(mask)
        frame = gaze.annotated_frame()
        text = ""
        if gaze.is_blinking():
            text = "Blinking"
        elif gaze.is_right():
            text = "Looking right"
        elif gaze.is_left():
            text = "Looking left"
        elif gaze.is_center():
            text = "Looking center"
        
        

# Resize the masked image to fit the screen
screen_width = 1280
screen_height = 720
mask_resized = cv2.resize(mask, (screen_width, screen_height), interpolation=cv2.INTER_AREA)



# Show the result
cv2.imshow("Face with Eyes (Background Blacked Out)", mask_resized)

# Wait for a key press and close windows
cv2.waitKey(0)
cv2.destroyAllWindows()
