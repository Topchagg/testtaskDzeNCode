from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404

from .models import *

from .serializers import *

class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        try:
            
            jwtAuth = JWTAuthentication()

            result = jwtAuth.authenticate(request=request)

            if result:
                raise Exception("Authentication failed")

            userObject = get_object_or_404(username=result.username)
            serializedData = UserDetailSerializer(userObject,many=False).data

            return serializedData.get("username") == obj.username
        except Exception as e:
            print(e)
            return False    