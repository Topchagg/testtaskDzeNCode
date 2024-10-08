from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


import bleach

from .models import *
from .utils.findKBWeight import *

class UserSerializer(ModelSerializer):
    
    class Meta:
        model = User
        fields = ["username","email","password","pk"]

class UserDetailSerializer(ModelSerializer):
     
    class Meta:
        model = User
        fields = ["username","email","pk"]


class fullMessageSerializer(ModelSerializer):

    owner = UserDetailSerializer(many=False)

    class Meta:
        model = Message
        fields = '__all__'


class CreateMessageSerializer(ModelSerializer):

    class Meta:
        model = Message
        fields = '__all__' 


    def validate(self,data):

            AllowedHtmlTags = ['a','i','strong','code'] # Дозволенные HTML-теги // Может расширяться 

            textIsValid = bleach.clean(data["text"],tags=AllowedHtmlTags,strip=False) # Проверка на валидность тегов

            if textIsValid != data["text"]:
                raise Exception("Text has unpredictable tags")
            
            return data       

        


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['id'] = user.id

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data['userId'] = self.user.id

        return data