from rest_framework import permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404

from .models import *

from .serializers import *

class IsOwner(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        try:
            
            jwtAuth = JWTAuthentication()

            user,token = jwtAuth.authenticate(request=request)

            if not user:
                raise Exception("Authentication failed")

            userObject = get_object_or_404(User,id=user.id)

            return True
        except Exception as e:
            print(e)
            return False    