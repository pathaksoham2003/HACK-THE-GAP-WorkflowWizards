from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import tempfile
import os 
import subprocess
import uuid
import json
from django.conf import settings
import random
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from exam.models import Result

@swagger_auto_schema(
    method='get',
    operation_description="Fetches a random coding question from the static directory.",
    responses={
        200: openapi.Response(
            description="Successfully retrieved a coding question",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "id": openapi.Schema(type=openapi.TYPE_INTEGER, description="Question ID"),
                    "title": openapi.Schema(type=openapi.TYPE_STRING, description="Title of the coding question"),
                    "description": openapi.Schema(type=openapi.TYPE_STRING, description="Question description"),
                    "examples": openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "input": openapi.Schema(type=openapi.TYPE_STRING, description="Example input"),
                                "output": openapi.Schema(type=openapi.TYPE_STRING, description="Expected output"),
                            },
                        ),
                        description="Example cases for the problem",
                    ),
                },
            ),
        ),
        404: openapi.Response(description="No coding questions available"),
        500: openapi.Response(description="Error reading coding questions directory or file"),
    }
)
@api_view(['GET'])
def question_get(request):
    coding_dir = settings.CODINGQ_DIR
    user_id = request.query_params.get('user_id')
    result_id = request.query_params.get('result_id')

    # Check if directory exists
    if not os.path.exists(coding_dir):
        return Response({"error": "Coding questions directory not found"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Get all JSON files from the directory
    question_files = [f for f in os.listdir(coding_dir) if f.startswith("question_") and f.endswith(".json")]

    if not question_files:
        return Response({"error": "No coding questions available"}, status=status.HTTP_404_NOT_FOUND)

    # Select a random question file
    random_file = random.choice(question_files)
    question_path = os.path.join(coding_dir, random_file)
    Result.objects.filter(id=result_id, userId=user_id).update(codingQuestion=random_file)
    # Read the JSON content
    try:
        with open(question_path, "r", encoding="utf-8") as file:
            question_data = json.load(file)
        return Response(question_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Error reading question: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def execute_code(request):
    code = request.data.get("code")
    language = request.data.get("language")

    if not code or not language:
        return Response({"error": "Missing 'code' or 'language' field"}, status=status.HTTP_400_BAD_REQUEST)

    docker_images = {
        "python": "python:3.9",
        "java": "openjdk:17",
        "c": "gcc:latest",
        "cpp": "gcc:latest",
        "javascript": "node:latest"
    }

    if language not in docker_images:
        return Response({"error": "Unsupported language"}, status=status.HTTP_400_BAD_REQUEST)

    with tempfile.TemporaryDirectory() as temp_dir:
        file_extension = {"python": "py", "java": "java", "c": "c", "cpp": "cpp", "javascript": "js"}[language]
        file_name = "Main." + file_extension if language == "java" else "script." + file_extension
        file_path = os.path.join(temp_dir, file_name)

        with open(file_path, "w") as code_file:
            code_file.write(code)

        # Create a Docker container and execute code
        try:
            container_name = f"code-exec-{uuid.uuid4()}"
            docker_run_command = [
                "docker", "run", "--rm",
                "-v", f"{temp_dir}:/app",
                "-w", "/app",
                docker_images[language]
            ]

            execute_command = {
                "python": ["python", file_name],
                "java": ["sh", "-c", f"javac {file_name} && java Main"],
                "c": ["sh", "-c", f"gcc {file_name} -o program && ./program"],
                "cpp": ["sh", "-c", f"g++ {file_name} -o program && ./program"],
                "javascript": ["node", file_name]
            }

            result = subprocess.run(
                docker_run_command + execute_command[language],
                capture_output=True,
                text=True,
                timeout=5  # Prevent infinite loops
            )

            output = result.stdout.strip()
            error = result.stderr.strip()
        except subprocess.CalledProcessError as e:
            output = e.stdout.strip()
            error = e.stderr.strip()
        except subprocess.TimeoutExpired:
            return Response({"error": "Execution timed out"}, status=status.HTTP_408_REQUEST_TIMEOUT)

        return Response({"output": output, "error": error if error else None}, status=status.HTTP_200_OK)


@api_view(['POST'])
def question_verify(request):
    code = request.data.get("code")
    language = request.data.get("language")
    question_id = request.data.get("question_id",1)

    if not code or not language or not question_id:
        return Response({"error": "Missing 'code', 'language', or 'question_id' field"}, status=status.HTTP_400_BAD_REQUEST)

    docker_images = {
        "python": "python:3.9",
        "java": "openjdk:17",
        "c": "gcc:latest",
        "cpp": "gcc:latest",
        "javascript": "node:latest"
    }

    if language not in docker_images:
        return Response({"error": "Unsupported language"}, status=status.HTTP_400_BAD_REQUEST)

    test_case_file = os.path.join(settings.TEST_CASES_DIR, f"{question_id}.json")
    if not os.path.exists(test_case_file):
        return Response({"error": "Test case file not found"}, status=status.HTTP_404_NOT_FOUND)

    with open(test_case_file, "r") as f:
        test_cases = json.load(f)

    with tempfile.TemporaryDirectory() as temp_dir:
        file_extension = {"python": "py", "java": "java", "c": "c", "cpp": "cpp", "javascript": "js"}[language]
        file_name = "Main." + file_extension if language == "java" else "script." + file_extension
        file_path = os.path.join(temp_dir, file_name)

        with open(file_path, "w") as code_file:
            code_file.write(code)

        container_name = f"code-exec-{uuid.uuid4()}"
        docker_run_command = [
            "docker", "run", "--rm", "-v", f"{temp_dir}:/app", "-w", "/app", docker_images[language]
        ]

        execute_command = {
            "python": ["python", file_name],
            "java": ["sh", "-c", f"javac {file_name} && java Main"],
            "c": ["sh", "-c", f"gcc {file_name} -o program && ./program"],
            "cpp": ["sh", "-c", f"g++ {file_name} -o program && ./program"],
            "javascript": ["node", file_name]
        }

        try:
            all_passed = True
            failed_cases = []
            for test in test_cases:
                input_data = json.dumps(test["input"])
                expected_output = test["output"]
                result = subprocess.run(
                    docker_run_command + execute_command[language] + [input_data],
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                output = result.stdout.strip()
                if output != str(expected_output):
                    all_passed = False
                    failed_cases.append({"input": test["input"], "expected": expected_output, "got": output})

            if all_passed:
                return Response({"message": "All test cases passed!"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Some test cases failed", "details": failed_cases}, status=status.HTTP_400_BAD_REQUEST)
        except subprocess.TimeoutExpired:
            return Response({"error": "Execution timed out"}, status=status.HTTP_408_REQUEST_TIMEOUT)
        except subprocess.CalledProcessError as e:
            return Response({"error": e.stderr.strip()}, status=status.HTTP_400_BAD_REQUEST)


from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
import json
import tempfile
import subprocess
from django.conf import settings

@api_view(['POST'])
def execute_test_cases(request):
    """
    Executes the uploaded Java file against test cases defined in the question JSON file.
    """
    uploaded_file = request.FILES.get("file")
    question_id = request.query_params.get("question_id")
    user_id = request.query_params.get('user_id')
    result_id = request.query_params.get('result_id')

    if not uploaded_file or not question_id:
        return Response({"error": "Missing 'file' or 'question_id' field"}, status=status.HTTP_400_BAD_REQUEST)

    question_file_path = os.path.join(settings.CODINGQ_DIR, f"question_{question_id}.json")
    if not os.path.exists(question_file_path):
        return Response({"error": "Test case file not found"}, status=status.HTTP_404_NOT_FOUND)

    with open(question_file_path, "r", encoding="utf-8") as f:
        question_data = json.load(f)

    test_cases = question_data.get("test_cases", [])
    total_cases = len(test_cases)  # 🔹 Get total test cases
    passed_cases = 0  # 🔹 Counter for passed test cases

    if total_cases == 0:
        return Response({"error": "No test cases found"}, status=status.HTTP_400_BAD_REQUEST)

    with tempfile.TemporaryDirectory() as temp_dir:
        file_name = "Main.java"
        file_path = os.path.join(temp_dir, file_name)

        with open(file_path, "wb") as dest_file:
            for chunk in uploaded_file.chunks():
                dest_file.write(chunk)

        try:
            compile_result = subprocess.run(
                ["javac", file_path], capture_output=True, text=True
            )
            if compile_result.returncode != 0:
                return Response({"error": "Compilation failed", "details": compile_result.stderr}, status=status.HTTP_400_BAD_REQUEST)

            all_passed = True
            failed_cases = []

            for test in test_cases:
                input_data = test["input"]
                expected_output = str(test["output"]).strip()
                execute_command = ["java", "-cp", temp_dir, "Main"]

                try:
                    result = subprocess.run(
                        execute_command,
                        input=input_data + "\n",
                        capture_output=True,
                        text=True,
                        timeout=5
                    )
                    output = result.stdout.strip()
                except subprocess.TimeoutExpired:
                    return Response({"error": "Execution timed out"}, status=status.HTTP_408_REQUEST_TIMEOUT)

                if output != expected_output:
                    all_passed = False
                    failed_cases.append({"input": input_data, "expected": expected_output, "got": output})
                
                if output == expected_output:
                    passed_cases += 1
                else:
                    failed_cases.append({"input": input_data, "expected": expected_output, "got": output})
                    
            
            if all_passed:
                percentage = 100
                Result.objects.filter(id=result_id, userId=user_id).update(codingMarks=percentage)
                return Response({"message": "All test cases passed!"}, status=status.HTTP_200_OK)
            else:
                percentage = 0
                Result.objects.filter(id=result_id, userId=user_id).update(codingMarks=percentage)
                return Response({"error": "Some test cases failed", "details": failed_cases}, status=status.HTTP_400_BAD_REQUEST)

        except subprocess.CalledProcessError as e:
            return Response({"error": e.stderr.strip()}, status=status.HTTP_400_BAD_REQUEST)