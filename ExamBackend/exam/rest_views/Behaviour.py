import google.generativeai as genai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import random
from exam.models import BehavioralQuestion, Result
from exam.serializers import BehavioralQuestionSerializer

# ✅ Configure Google Gemini API only once
genai.configure(api_key="AIzaSyDhzV_bwGBcitCr8yz5k9gnIcnOyLp6F-4")

class BehaviourREST(APIView):
    def get(self, request):
        try:
            all_questions = list(BehavioralQuestion.objects.all())
            user_id = request.query_params.get('user_id')
            result_id = request.query_params.get('result_id')

            if not all_questions:
                return Response({"error": "No behavioral questions found"}, status=status.HTTP_404_NOT_FOUND)

            selected_question = random.choice(all_questions)  # Pick ONE random question
            serializer = BehavioralQuestionSerializer(selected_question)

            # ✅ Store only the question text
            Result.objects.filter(id=result_id, userId=user_id).update(behaviourQuestion=selected_question.question_text)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        question = request.data.get("question")
        answer = request.data.get("answer")
        user_id = request.query_params.get("user_id")  # ✅ Extract from request.data
        result_id = request.query_params.get("result_id")

        if not question or not answer or not user_id or not result_id:
            return Response({"error": "question, answer, user_id, and result_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # ✅ Initialize the model correctly
            model = genai.GenerativeModel("gemini-1.5-flash")
            prompt = f"""
            Question: {question}
            Answer: {answer}
            
            Evaluate the answer based on correctness, completeness, and clarity.
            Give a score from 0.00 to 100.00.
            Respond with only a number.
            """

            response = model.generate_content(prompt)  # ✅ Fixed API call

            score_text = response.text.strip()
            try:
                score = float(score_text)  # ✅ Parse as float
                score = max(0.0, min(score, 100.0))  # Ensure valid range
            except ValueError:
                score = 0.0  # Default if parsing fails
            print(score)
            old_result = Result.objects.filter(id=result_id, userId=user_id).first()
            if not old_result:
                return Response({"error": "Result not found."}, status=status.HTTP_404_NOT_FOUND)

            # ✅ Calculate Total Marks
            total = score + float(old_result.quizMarks) + float(old_result.codingMarks)

            # ✅ Update Behaviour Marks and Total Result
            Result.objects.filter(id=result_id, userId=user_id).update(
                behaviourMarks=score,
                result=str(total)  # Convert total to string to match CharField
            )

            return Response({"score": score}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"error": "Failed to evaluate answer", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
