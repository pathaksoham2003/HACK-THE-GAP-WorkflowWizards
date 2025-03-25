import cv2
import face_recognition
import pickle
import os
import numpy as np

def load_existing_encodings(file_path="EncodeFile.p"):
    if os.path.exists(file_path):
        with open(file_path, 'rb') as file:
            return pickle.load(file)
    return [[], []]  # Empty lists for encodings and student IDs

def save_encodings(encodings, file_path="EncodeFile.p"):
    with open(file_path, 'wb') as file:
        pickle.dump(encodings, file)

def generate_face_encoding(image_path, student_id):
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not read image {image_path}")
        return
    
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(img_rgb)
    
    if len(face_locations) == 0:
        print("No face detected in the image.")
        return
    
    encoding = face_recognition.face_encodings(img_rgb, face_locations)[0]
    
    # Load existing encodings
    encodeListKnown, studentIds = load_existing_encodings()
    
    # Append new encoding if student ID is not already stored
    if student_id not in studentIds:
        encodeListKnown.append(encoding)
        studentIds.append(student_id)
        save_encodings([encodeListKnown, studentIds])
        print(f"Face encoding for {student_id} added successfully.")
    else:
        print(f"Student ID {student_id} already exists in the dataset.")

if __name__ == "__main__":
    image_path = "./faceImage/soham.jpeg"
    student_id = "3114"
    generate_face_encoding(image_path, student_id)
