from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'admin')

class IsTeacherRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'role', None) == 'teacher')

class IsAdminOrTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and getattr(user,'role',None) in ('admin','teacher'))

class IsAdminOrTeacherReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if getattr(user,'role',None) == 'admin':
            return True
        if getattr(user,'role',None) == 'teacher':
            return request.method in permissions.SAFE_METHODS
        return False
