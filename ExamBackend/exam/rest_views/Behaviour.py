import google.generativeai as genai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from exam.models import BehavioralQuestion
from exam.serializers import BehavioralQuestionSerializer
import random

# Configure Google Gemini API
genai.configure(api_key="AIzaSyDhzV_bwGBcitCr8yz5k9gnIcnOyLp6F")

class BehaviourREST(APIView):
    
    def get(self, request):
        try:
            all_questions = list(BehavioralQuestion.objects.all())
            selected_questions = random.sample(all_questions, min(5, len(all_questions)))  # Pick 5 random questions
            serializer = BehavioralQuestionSerializer(selected_questions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        question = request.data.get("question")
        answer = request.data.get("answer")

        if not question or not answer:
            return Response({"error": "Both question and answer are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate response using Gemini AI
        try:
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""
            Question: {question}
            Answer: {answer}
            
            Evaluate the answer based on correctness, completeness, and clarity.
            Give a score from 0.00 to 100.00
            Respond with only a number.
            """
            response = model.generate_content(prompt)
            score_text = response.text.strip()
            score = int(score_text) if score_text.isdigit() else 0
            score = max(0, min(score, 10))  # Ensure score is between 0-10

            return Response({"score": score}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": "Failed to evaluate answer", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


