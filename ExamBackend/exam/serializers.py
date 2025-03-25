from rest_framework import serializers
from exam.models import Quiz,Result,Teacher,Student

class FaceEncodingSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=100)
    image = serializers.ImageField()

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'  

class ResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = '__all__'  

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'