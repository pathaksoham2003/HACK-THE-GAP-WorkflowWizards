from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
import os
from django.conf import settings
from exam.models import ResultGraph, Student

class TempRest(APIView):
    def get(self, request):
        try:
            json_file_path = os.path.join(settings.QUIZ_DIR, "result_graph_data.json")

            # Load JSON data
            with open(json_file_path, "r", encoding="utf-8") as file:
                data = json.load(file)

            # Insert data into ResultGraph model
            for item in data:
                student = Student.objects.filter(id=item["userId"]).first()
                if student:
                    ResultGraph.objects.create(
                        userId=student,
                        quizQuestions=item["quizQuestions"],
                        quizMarks=item["quizMarks"],
                        codingQuestion=item["codingQuestion"],
                        codingMarks=item["codingMarks"],
                        behaviourQuestion=item["behaviourQuestion"],
                        behaviourMarks=item["behaviourMarks"],
                        isCaught=item["isCaught"],
                        result=item["result"]
                    )

            return Response({"message": "ResultGraph data successfully inserted!"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
