from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from exam.models import Teacher, Student
from exam.serializers import TeacherSerializer, StudentSerializer
import hashlib


class RegisterView(APIView):
    """
    API endpoint for user registration.
    Supports both students and teachers.
    """

    @swagger_auto_schema(
        operation_description="Register a new student or teacher and send a verification email.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["user_type", "firstName", "lastName", "emailAddress", "password"],
            properties={
                "user_type": openapi.Schema(type=openapi.TYPE_STRING, enum=["teacher", "student"]),
                "firstName": openapi.Schema(type=openapi.TYPE_STRING),
                "lastName": openapi.Schema(type=openapi.TYPE_STRING),
                "emailAddress": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL),
                "password": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_PASSWORD),
            },
        ),
        responses={
            201: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "message": openapi.Schema(type=openapi.TYPE_STRING),
                    "user_id": openapi.Schema(type=openapi.TYPE_INTEGER),
                }
            ),
            400: "All fields are required or Email already registered",
        },
    )
    def post(self, request):
        user_type = request.data.get("user_type")  # "teacher" or "student"
        first_name = request.data.get("firstName")
        last_name = request.data.get("lastName")
        email = request.data.get("emailAddress")
        password = request.data.get("password")

        if not all([user_type, first_name, last_name, email, password]):
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        ModelClass = Teacher if user_type == "teacher" else Student
        if ModelClass.objects.filter(emailAddress=email).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        # Create user but not verified yet
        user = ModelClass.objects.create(
            firstName=first_name, lastName=last_name, emailAddress=email, password=hashlib.sha256(password.encode()).hexdigest()
        )

        # Generate verification link dynamically using request.get_host()
        server_url = request.build_absolute_uri('/')[:-1]  # Removes trailing slash
        verification_link = f"{server_url}/api/verify/{user_type}/{user.id}/"
        send_mail(
            "Verify Your Account",
            f"Click the link to verify your account: {verification_link}",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )

        return Response(
            {"message": "User registered. Check your email for verification.", "user_id": user.id},
            status=status.HTTP_201_CREATED,
        )


class VerifyView(APIView):
    """
    API endpoint to verify a user's account using the verification link.
    """

    @swagger_auto_schema(
        operation_description="Verify a user's email using the verification link sent via email.",
        manual_parameters=[
            openapi.Parameter("user_type", openapi.IN_PATH, type=openapi.TYPE_STRING, enum=["teacher", "student"], description="User type"),
            openapi.Parameter("user_id", openapi.IN_PATH, type=openapi.TYPE_INTEGER, description="User ID"),
        ],
        responses={
            200: "User verified successfully!",
            404: "User not found",
        },
    )
    def get(self, request, user_type, user_id):
        ModelClass = Teacher if user_type == "teacher" else Student
        user = get_object_or_404(ModelClass, id=user_id)

        if user.isVerified:
            return Response({"message": "User already verified."}, status=status.HTTP_200_OK)

        user.isVerified = True
        user.save()

        return Response({"message": "User verified successfully!"}, status=status.HTTP_200_OK)


class LoginView(APIView):
    """
    API endpoint for user login.
    """

    @swagger_auto_schema(
        operation_description="Login a student or teacher by verifying email and password.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=["user_type", "emailAddress", "password"],
            properties={
                "user_type": openapi.Schema(type=openapi.TYPE_STRING, enum=["teacher", "student"]),
                "emailAddress": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_EMAIL),
                "password": openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_PASSWORD),
            },
        ),
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "message": openapi.Schema(type=openapi.TYPE_STRING),
                    "user_id": openapi.Schema(type=openapi.TYPE_INTEGER),
                },
            ),
            400: "Email and password are required",
            401: "Invalid credentials",
            403: "Please verify your email first",
        },
    )
    def post(self, request):
        user_type = request.data.get("user_type")
        email = request.data.get("emailAddress")
        password = request.data.get("password")

        if not all([user_type, email, password]):
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        ModelClass = Teacher if user_type == "teacher" else Student
        user = ModelClass.objects.filter(emailAddress=email, password=hashlib.sha256(password.encode()).hexdigest()).first()

        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.isVerified:
            return Response({"error": "Please verify your email first"}, status=status.HTTP_403_FORBIDDEN)

        return Response({"message": "Login successful", "user_id": user.id}, status=status.HTTP_200_OK)
