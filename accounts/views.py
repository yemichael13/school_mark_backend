from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import CustomUser
from .serializers import UserSerializer, AdminCreateTeacherSerializer
from .permissions import IsAdminRole

class UserViewSet(viewsets.ModelViewSet):
    """
    Admin-only: list, update, delete users.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

class TeacherCreateViewSet(viewsets.ModelViewSet):
    """
    Admin can create/manage teachers.
    """
    queryset = CustomUser.objects.filter(role='teacher')
    serializer_class = AdminCreateTeacherSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
