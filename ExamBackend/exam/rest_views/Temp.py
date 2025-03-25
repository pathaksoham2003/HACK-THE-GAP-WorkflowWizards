from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework import status
import json
import os
from django.conf import settings  # Import settings to get STATICFILES_DIRS
from exam.models import Quiz
from exam.serializers import QuizSerializer
import tempfile
import subprocess
from exam.models import BehavioralQuestion

class TempRest(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request):
        try:
            json_file_path = os.path.join(settings.QUIZ_DIR, "behaviourQuestion.json")

            # Load JSON data
            with open(json_file_path, "r", encoding="utf-8") as file:
                data = json.load(file)

            # Insert questions into BehavioralQuestion model
            for item in data:
                question_text = item["question"]
                BehavioralQuestion.objects.get_or_create(question_text=question_text)

            return Response({"message": "Behavioral questions successfully inserted!"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
