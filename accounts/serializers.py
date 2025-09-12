from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')

class AdminCreateTeacherSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES, default='teacher')

    class Meta:
        model = CustomUser
        fields = ('id','username','email','password','first_name','last_name','role')

    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.pop('role', 'teacher')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.role = role
        user.save()
        return user
