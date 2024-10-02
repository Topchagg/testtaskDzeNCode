from rest_framework.serializers import ModelSerializer

import bleach

from .models import *
from .utils.findKBWeight import *

class FullUserSerializer(ModelSerializer):
    

    class Meta:
        model = User
        fields = '__all__'



class fullMessageSerializer(ModelSerializer):

    class Meta:
        model = Message
        fields = '__all__'
    
    def validate(self,data):

            AllowedHtmlTags = ['a','i','strong','code'] # Дозволенные HTML-теги // Может расширяться 

            kbSize = FindKbWeight(data["text"]) # Проверка на вес, больше в utils/findKBWeight.py
                
            if kbSize > 100:
                raise Exception("Text is too weight")

            textIsValid = bleach.clean(data["text"],tags=AllowedHtmlTags,strip=False) # Проверка на валидность тегов

            if textIsValid != data["text"]:
                raise Exception("Text has unpredictable tags")
            
            return data       

    def create(self,data):

        message = super().create(data) 

        
        

 