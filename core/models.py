from django.db import models

class Student(models.Model):
    name = models.CharField(max_length=200)
    roll_number = models.CharField(max_length=50, unique=True)
    class_name = models.CharField(max_length=50)
    date_of_birth = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.roll_number})"

class Subject(models.Model):
    name = models.CharField(max_length=200)
    class_name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Mark(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='marks')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    mark = models.FloatField()

    class Meta:
        unique_together = ('student', 'subject')

class Report(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    term = models.CharField(max_length=50)
    total = models.FloatField()
    average = models.FloatField()
    pdf_url = models.TextField(blank=True)
    qr_code_url = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
