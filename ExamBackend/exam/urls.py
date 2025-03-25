from django.urls import path
from exam.rest_views.Face import generate_face_encoding, check_face
from exam.rest_views.Coding import execute_code,question_get
from exam.rest_views.Quiz import QuizRest
from exam.rest_views.Exam import ExamRest
from exam.rest_views.Temp import TempRest
from exam.rest_views.Auth import RegisterView,LoginView,VerifyView


urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('verify/<str:user_type>/<int:user_id>/', VerifyView.as_view(), name='verify'),
    path('login/', LoginView.as_view(), name='login'),
    
    
    path('generate-face-encoding/', generate_face_encoding, name='generate_face_encoding'),
    path('check-face/', check_face, name='check_face'),
    
    # Create Exam
    path('exam/create', ExamRest.as_view(),name='exam-create'),
    # Quiz Routes
    path('quiz/random/', QuizRest.as_view(), name='random-quiz'),
    
    # Coding Routes
    path("coding/random/", question_get, name="random_coding_question"),
    path('execute_code/', execute_code, name='execute_code'),
    
    # Behaviour Routes
    
    
    # Temp
    # path("Temp/",TempRest.as_view()),
    
    
]
