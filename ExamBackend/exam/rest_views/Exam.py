from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from exam.models import Result,Student  # Ensure you import the correct model
from exam.serializers import ResultsSerializer  # Import the serializer for the Results model

class ExamRest(APIView):
    """
    API to create an exam result entry.
    """

    @swagger_auto_schema(
        operation_description="Creates a new exam result entry and returns its ID.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["user_id"],
            properties={
                "user_id": openapi.Schema(type=openapi.TYPE_INTEGER, description="User ID of the person taking the exam"),
            },
        ),
        responses={
            201: openapi.Response(
                description="Exam result entry created",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "result_id": openapi.Schema(type=openapi.TYPE_INTEGER, description="ID of the created result entry"),
                    },
                ),
            ),
            400: openapi.Response(
                description="Bad Request",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "error": openapi.Schema(type=openapi.TYPE_STRING, description="Error message"),
                    },
                ),
            ),
        },
    )
    def post(self, request):
        user_id = request.data.get("user_id")
        print(user_id)
        if not user_id:
            return Response({"error": "user_id is required in the request body"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the Student instance
        try:
            user = Student.objects.get(id=user_id)
        except Student.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create a new result entry
        result = Result.objects.create(userId=user)  # Assign Student instance, not ID

        return Response({"result_id": result.id}, status=status.HTTP_201_CREATED)