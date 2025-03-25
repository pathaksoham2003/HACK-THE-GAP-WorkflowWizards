from django.urls import path
from exam.rest_views.Face import generate_face_encoding, check_face
from exam.rest_views.Coding import execute_code,question_get,execute_test_cases
from exam.rest_views.Quiz import QuizRest
from exam.rest_views.Exam import ExamRest
from exam.rest_views.Temp import TempRest
from exam.rest_views.Auth import RegisterView,LoginView,VerifyView
from exam.rest_views.Behaviour import BehaviourREST
from exam.rest_views.Result import ResultGraphView


urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('verify/<str:user_type>/<int:user_id>/', VerifyView.as_view(), name='verify'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Face 
    path('generate-face-encoding/', generate_face_encoding, name='generate_face_encoding'),
    path('check-face/', check_face, name='check_face'),
    
    # Create Exam
    path('exam/create', ExamRest.as_view(),name='exam-create'),
    # Quiz Routes
    path('quiz/random/', QuizRest.as_view(), name='random-quiz'),
    
    # Coding Routes
    path("coding/random/", question_get, name="random_coding_question"),
    path('execute_code/', execute_code, name='execute_code'),
    path('execute_test_cases/', execute_test_cases, name='execute_test_cases'),
    
    # Behaviour Routes
    path('behaviour/', BehaviourREST.as_view(), name='execute_code'),
    
    # Result
    path('result-graph/', ResultGraphView.as_view(), name='result-graph'),
    
    # Temp
    path("Temp/",TempRest.as_view()),
    
    
]
