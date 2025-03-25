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
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer
from exam.models import Quiz
from exam.serializers import QuizSerializer

class QuizRest(APIView):
    renderer_classes = [JSONRenderer]  # ✅ Force JSON response format

    @swagger_auto_schema(
        operation_summary="Retrieve a list of quizzes by topic",
        operation_description="Fetch up to 10 random quizzes related to a given topic.",
        manual_parameters=[
            openapi.Parameter(
                "topic", openapi.IN_QUERY, description="Topic of the quiz", type=openapi.TYPE_STRING, required=True
            )
        ],
        responses={
            200: QuizSerializer(many=True),
            400: "Bad Request: Topic parameter is required",
            404: "Not Found: No quizzes found for this topic"
        }
    )
    def get(self, request):
        topic = request.GET.get("topic")  # Get topic from query parameter

        if not topic:
            return Response({"error": "Topic parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        topic = topic.lower()  # ✅ Convert topic to lowercase to match DB
        quizzes = Quiz.objects.filter(topic=topic).order_by('?')[:10]  # ✅ Case-sensitive match (DB already in lowercase)

        if not quizzes.exists():
            return Response({"error": "No quizzes found for this topic"}, status=status.HTTP_404_NOT_FOUND)

        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
