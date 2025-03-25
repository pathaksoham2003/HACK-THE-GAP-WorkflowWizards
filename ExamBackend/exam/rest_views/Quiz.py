import os
import json
import uuid
from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from exam.models import Quiz, Result
from exam.serializers import QuizSerializer

class QuizRest(APIView):
    renderer_classes = [JSONRenderer]  # ✅ Force JSON response format

    @swagger_auto_schema(
        operation_summary="Retrieve a list of quizzes by topic",
        operation_description="Fetch up to 10 random quizzes related to a given topic.",
        manual_parameters=[
            openapi.Parameter("topic", openapi.IN_QUERY, description="Topic of the quiz", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter("result_id", openapi.IN_QUERY, description="Result ID to associate the quiz file", type=openapi.TYPE_INTEGER, required=True),
            openapi.Parameter("user_id", openapi.IN_QUERY, description="User ID to find the result", type=openapi.TYPE_INTEGER, required=True)
        ],
        responses={
            200: QuizSerializer(many=True),
            400: "Bad Request: Topic, Result ID, and User ID parameters are required",
            404: "Not Found: No quizzes found for this topic"
        }
    )
    def get(self, request):
        topic = request.GET.get("topic")  # Get topic from query parameter
        result_id = request.query_params.get('result_id')
        user_id = request.query_params.get('user_id')

        if not topic or not result_id or not user_id:
            return Response({"error": "Topic, result_id, and user_id parameters are required"}, status=status.HTTP_400_BAD_REQUEST)

        topic = topic.lower()  # ✅ Convert topic to lowercase to match DB
        quizzes = Quiz.objects.filter(topic=topic).order_by('?')[:10]  # ✅ Get random 10 quizzes

        if not quizzes.exists():
            return Response({"error": "No quizzes found for this topic"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize quiz data
        serializer = QuizSerializer(quizzes, many=True)
        quiz_data = serializer.data

        # Generate unique filename
        quiz_filename = f"quiz_{uuid.uuid4().hex}.json"
        quiz_file_path = os.path.join(settings.TEMP_QUIZ_DIR, quiz_filename)

        # Ensure directory exists
        os.makedirs(settings.TEMP_QUIZ_DIR, exist_ok=True)

        # Save quiz data to JSON file
        with open(quiz_file_path, "w") as file:
            json.dump(quiz_data, file, indent=4)

        # Update Result model
        try:
            result = Result.objects.get(id=result_id, userId=user_id)
            result.quizQuestions = quiz_filename  # Store filename in Result model
            result.save()
        except Result.DoesNotExist:
            return Response({"error": "Result not found for this user"}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @swagger_auto_schema(
        operation_summary="Update quiz result",
        operation_description="Receive the result from the frontend and update the Result table with marks.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["user_id", "result_id", "marks"],
            properties={
                "user_id": openapi.Schema(type=openapi.TYPE_INTEGER, description="User ID"),
                "result_id": openapi.Schema(type=openapi.TYPE_INTEGER, description="Result ID"),
                "marks": openapi.Schema(type=openapi.TYPE_NUMBER, description="Marks obtained"),
            },
        ),
        responses={
            200: "Success: Result updated",
            400: "Bad Request: Missing or invalid parameters",
            404: "Not Found: Result not found",
        }
    )
    def post(self, request):
        user_id = request.data.get("user_id")
        result_id = request.data.get("result_id")
        marks = request.data.get("marks")

        if user_id is None or result_id is None or marks is None:
            return Response({"error": "user_id, result_id, and marks are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = Result.objects.get(id=result_id, userId=user_id)
            result.marks = marks
            result.save()
            return Response({"message": "Result updated successfully"}, status=status.HTTP_200_OK)
        except Result.DoesNotExist:
            return Response({"error": "Result not found"}, status=status.HTTP_404_NOT_FOUND)