import cv2
import face_recognition
import pickle
import os
import numpy as np
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import uuid
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from exam.form import UploadFileForm

@api_view(['POST'])
def generate_face_encoding(request):
    user_id = request.query_params.get('user_id')
    image = request.FILES.get('file')
            
    print("Headers:", request.headers)
    print("User ID:", user_id)
    print("Image:", request.FILES)

    if not user_id or not image:
        return Response({"error": "user_id and image are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Extract the original file extension
    file_extension = os.path.splitext(image.name)[-1].lower()

    # Ensure the directory exists before saving
    image_directory = settings.PROFILE_PIC_FOLDER
    if not os.path.exists(image_directory):
        os.makedirs(image_directory)

    # Save uploaded image with the original extension
    image_path = os.path.join(image_directory, f"{user_id}{file_extension}")
    print(image_path)
    with open(image_path, "wb") as f:
        for chunk in image.chunks():
            f.write(chunk)

    # Read the saved image
    img = cv2.imread(image_path)
    if img is None:
        return Response({"error": "Invalid image"}, status=status.HTTP_400_BAD_REQUEST)

    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(img_rgb)

    if not face_locations:
        return Response({"error": "No face detected"}, status=status.HTTP_400_BAD_REQUEST)

    encoding = face_recognition.face_encodings(img_rgb, face_locations)[0]

    # Load existing encodings
    encodeListKnown, userIds = load_existing_encodings(user_id)

    if user_id not in userIds:
        encodeListKnown.append(encoding)
        userIds.append(user_id)
        save_encodings(user_id, [encodeListKnown, userIds])
        return Response({"message": f"Face encoding for {user_id} saved successfully."}, status=status.HTTP_201_CREATED)
    else:
        return Response({"message": f"User ID {user_id} already exists."}, status=status.HTTP_409_CONFLICT)


# Function to load existing encodings
def load_existing_encodings(user_id):
    file_path = os.path.join(settings.ENCODINGS_FOLDER,f"{user_id}.p")
    if os.path.exists(file_path):
        with open(file_path, 'rb') as file:
            return pickle.load(file)
    return [[], []]  # Empty lists for encodings and user IDs

# Function to save encodings
def save_encodings(user_id,encodings):
    file_path = os.path.join(settings.ENCODINGS_FOLDER,f"{user_id}.p")
    with open(file_path, 'wb') as file:
        pickle.dump(encodings, file)
# ✅ Route to check face recognition

@api_view(['POST'])
def check_face(request):
    user_id = request.query_params.get('USER_ID')
    if 'image' not in request.FILES:
        return Response({"error": "Image is required"}, status=status.HTTP_400_BAD_REQUEST)

    image = request.FILES['image']
    file_extension = os.path.splitext(image.name)[-1].lower()  # Get original file extension

    # Save uploaded image temporarily with the same extension
    myuuid = uuid.uuid4()
    temp_path = os.path.join(settings.TEMP_FOLDER, f"{myuuid}{file_extension}")
    with open(temp_path, "wb") as f:
        for chunk in image.chunks():
            f.write(chunk)

    # Load known encodings
    encodeListKnown, userIds = load_existing_encodings(user_id)

    # Read the uploaded image
    img = cv2.imread(temp_path)
    if img is None:
        return Response({"error": "Invalid image"}, status=status.HTTP_400_BAD_REQUEST)
    
    imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

    # Detect faces and get encodings
    faceCurFrame = face_recognition.face_locations(imgS)
    encodeCurFrame = face_recognition.face_encodings(imgS, faceCurFrame)

    if not encodeCurFrame:
        return Response({"error": "No face detected"}, status=status.HTTP_400_BAD_REQUEST)

    for encodeFace, faceLoc in zip(encodeCurFrame, faceCurFrame):
        matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)

        if len(faceDis) > 0:
            matchIndex = np.argmin(faceDis)
            if matches[matchIndex]:
                return Response({"message": f"Recognized User ID: {userIds[matchIndex]}"}, status=status.HTTP_200_OK)

    return Response({"error": "Face not recognized"}, status=status.HTTP_404_NOT_FOUND)
