from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from .models import Student, Subject, Mark, Report
from .serializers import StudentSerializer, SubjectSerializer, MarkSerializer, ReportSerializer
from accounts.permissions import IsAdminRole, IsAdminOrTeacher, IsAdminOrTeacherReadOnly

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrTeacherReadOnly]  # admin full CRUD, teacher read-only

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]  # only admin manages subjects

class MarkViewSet(viewsets.ModelViewSet):
    queryset = Mark.objects.all()
    serializer_class = MarkSerializer
    permission_classes = [IsAuthenticated, IsAdminOrTeacher]  # admin & teacher can add/edit marks

    def create(self, request, *args, **kwargs):
        # optional: validate duplicate marks per student/subject, or support bulk
        return super().create(request, *args, **kwargs)

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated, IsAdminOrTeacher]

    @action(detail=False, methods=['post'], url_path='generate')
    def generate_report(self, request):
        """
        POST: {"student": <id>, "term": "Term 1"}
        calculates total & average, creates and returns report object.
        """
        student_id = request.data.get('student')
        term = request.data.get('term', 'Term')

        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return Response({"detail":"Student not found"}, status=status.HTTP_404_NOT_FOUND)

        marks = Mark.objects.filter(student=student)
        if not marks.exists():
            return Response({"detail":"No marks for this student"}, status=status.HTTP_400_BAD_REQUEST)

        total = sum(m.mark for m in marks)
        average = total / marks.count()

        report = Report.objects.create(student=student, term=term, total=total, average=average)
        serializer = self.get_serializer(report)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
