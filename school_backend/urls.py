from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from accounts.views import UserViewSet, TeacherCreateViewSet, current_user
from core.views import StudentViewSet, SubjectViewSet, MarkViewSet, ReportViewSet

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teachers', TeacherCreateViewSet, basename='teacher')
router.register(r'students', StudentViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'marks', MarkViewSet)
router.register(r'reports', ReportViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/me/', current_user, name='current_user'),
]
