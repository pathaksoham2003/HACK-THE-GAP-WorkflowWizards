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



class TempRest(APIView):
    renderer_classes = [JSONRenderer]

    def get(self, request):
        try:
            # Construct full path to static JSON file
            json_file_path = os.path.join(settings.QUIZ_DIR, "python.json")

            # Load JSON data from file
            with open(json_file_path, "r", encoding="utf-8") as file:
                data = json.load(file)

            # Insert data into the Quiz model
            for item in data:
                options = item["options"]

                if len(options) != 4:
                    print(f"Skipping question due to invalid options count: {item['question']}")
                    continue

                Quiz.objects.create(
                    question=item["question"],
                    optionA=options[0],
                    optionB=options[1],
                    optionC=options[2],
                    optionD=options[3],
                    correctAnswer=item["correctAnswer"],
                    difficulty=item["difficulty"].lower(),
                    topic=item["topic"].lower()
                )

            return Response({"message": "Data successfully inserted into the Quiz model!"}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

    
    
    
    def post(self, request):
            code = request.data.get("code")
            language = request.data.get("language")

            if not code or not language:
                return Response({"error": "Missing 'code' or 'language' field"}, status=status.HTTP_400_BAD_REQUEST)

            # Define supported languages and execution commands
            commands = {
                "python": ["python", "script.py"],
                "java": ["javac", "Main.java", "&&", "java", "Main"],
                "c": ["gcc", "program.c", "-o", "program", "&&", "./program"],
                "cpp": ["g++", "program.cpp", "-o", "program", "&&", "./program"],
                "javascript": ["node", "script.js"]
            }

            if language not in commands:
                return Response({"error": "Unsupported language"}, status=status.HTTP_400_BAD_REQUEST)

            # Create a temporary directory to store the code
            with tempfile.TemporaryDirectory() as temp_dir:
                file_extension = {
                    "python": "py",
                    "java": "java",
                    "c": "c",
                    "cpp": "cpp",
                    "javascript": "js"
                }[language]

                file_name = f"Main.{file_extension}" if language == "java" else f"script.{file_extension}"
                file_path = os.path.join(temp_dir, file_name)

                # Write code to the temporary file
                with open(file_path, "w") as code_file:
                    code_file.write(code)

                try:
                    # Change directory for Java execution
                    if language == "java":
                        compile_command = ["javac", file_path]
                        subprocess.run(compile_command, cwd=temp_dir, check=True, capture_output=True, text=True)
                        execute_command = ["java", "-cp", temp_dir, "Main"]
                    else:
                        execute_command = commands[language]
                    
                    # Run the code
                    result = subprocess.run(execute_command, cwd=temp_dir, check=True, capture_output=True, text=True)
                    output = result.stdout.strip()
                    error = result.stderr.strip()
                except subprocess.CalledProcessError as e:
                    output = e.stdout.strip()
                    error = e.stderr.strip()

                return Response({
                    "output": output,
                    "error": error if error else None
                }, status=status.HTTP_200_OK)