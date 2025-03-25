from django.db import models

class Teacher(models.Model):
    id = models.AutoField(primary_key=True)
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    emailAddress = models.CharField(max_length=50)
    password = models.CharField(max_length=20)
    isVerified = models.BooleanField(default=False)

    def __str__(self):
        return self.emailAddress


class Student(models.Model):
    id = models.AutoField(primary_key=True)
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    emailAddress = models.CharField(max_length=50)
    password = models.CharField(max_length=20)
    isVerified = models.BooleanField(default=False)

    def __str__(self):
        return self.emailAddress
    
class Quiz(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.TextField()
    optionA = models.CharField(max_length=255)
    optionB = models.CharField(max_length=255)
    optionC = models.CharField(max_length=255)
    optionD = models.CharField(max_length=255)
    correctAnswer = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=255)
    topic = models.CharField(max_length=255)
    
    def __str__(self):
        return self.question


class Result(models.Model):
    id = models.AutoField(primary_key=True)
    userId = models.ForeignKey(Student, on_delete=models.CASCADE)
    quizQuestions = models.CharField(max_length=255, default="", null=True, blank=True)
    quizMarks = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, null=True, blank=True)
    codingQuestion = models.TextField(default="", null=True, blank=True)
    codingMarks = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, null=True, blank=True)
    behaviourQuestion = models.TextField(default="", null=True, blank=True)
    behaviourMarks = models.DecimalField(max_digits=5, decimal_places=2, default=0.0, null=True, blank=True)
    isCaught = models.BooleanField(default=False)
    result = models.CharField(max_length=255, default="", null=True, blank=True)

    def __str__(self):
        return f"{self.userId.name} - Result"