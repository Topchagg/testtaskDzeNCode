from django.shortcuts import render
from django.core.cache import cache

from rest_framework.viewsets import ModelViewSet,ViewSet
from rest_framework.response import Response
from rest_framework import status

from .models import *
from .serializers import *
from .pagination import *

from .utils import cacheMethods
from .utils.callBackUpdateCache import *
from .utils.orderBy import *
from .utils.cacheNameBuilder import *


class UserView(ModelViewSet):

    queryset = User.objects.all()
    serializer_class = FullUserSerializer



class MessageView(ModelViewSet):

    queryset = Message.objects.all()
    serializer_class = fullMessageSerializer
    # pagination_class = MessagePagination
    keyNameOfCache = "message_cache"

    def list(self,request,*args,**kwargs):
        try:
            pageNumber = request.GET.get("page")
            keyOfCache = CacheNameBuilder(self.keyNameOfCache,{"page":pageNumber})

            isFilterByName = request.GET.get("byName",' ') # Параметр сортировки + или - 
            isFilterByEmail = request.GET.get("byEmail",' ') # Параметр сортировки + или -
            isFilterByDate = request.GET.get("byDate",'-') # Параметр сортировки + или -
            # + , означает, что сортировка будет по возростанию
            # - , означает, что сортировка будет по убыванию

            approximateCache = cacheMethods.getCache(keyOfCache)

            if approximateCache:
                return Response({"messages":approximateCache},status=status.HTTP_200_OK)
            else:
                result = Message.objects.filter(isAnswer=False)

                if isFilterByName:
                    result = orderBy(result,"name",isFilterByName)

                if isFilterByEmail:
                    result = orderBy(result,"email",isFilterByEmail)                    

                if isFilterByDate:
                    result = orderBy(result,"dateOfCreating",isFilterByDate)

                keyOfCache = CacheNameBuilder(keyOfCache,{
                    "isFilterByName":isFilterByName,
                    "isFilterByEmail":isFilterByEmail,
                    "isFilterByDate":isFilterByDate
                })

                serializedData = fullMessageSerializer(result,many=True)

                cacheMethods.setCache(keyOfCache,serializedData.data,600*600)

            return Response({"messages":serializedData.data}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({"message":"Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self,request,*args,**kwargs):
        try:
            response =  CallBackUpdateCache(self,super().create,request,*args,**kwargs) # Реюзабельная функция для удаления кеша при обновлении

            if response: # Если Response != false Возвращаем результат 
                return Response({"message": response.data},status=status.HTTP_201_CREATED)
            
            raise Exception("Something went wrong")

        except Exception as e:
            print(e)

            return Response({"message":"Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def destroy(self, request, *args, **kwargs):
        try:
            response = super().destroy(request, *args, **kwargs)

            cache.clear() # Очищаю весь кеш, по причине того, что удаление сообщения может повлиять на другие страницы (Исправлю позже)

            return Response({"message":response.data},status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            print(e)
            return Response({"message":"Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    def update(self, request, *args, **kwargs):
        try:
            response = CallBackUpdateCache(self,super().update,request,*args,**kwargs) # Реюзабельная функция для удаления кеша при обновлении

            if response: # Если Response != false Возвращаем результат 
                return Response({"message": response.data},status=status.HTTP_200_OK)
            
            raise Exception("Something went wrong")   
                   
        except Exception as e:
            print(e)
            return Response({"message":"Something went wrong"}, status.HTTP_500_INTERNAL_SERVER_ERROR)


class getAnswers(ViewSet):

    def list(self,request,*args,**kwargs):

        try:
            messageID = request.GET.get("messageID")
            startWith = int(request.GET.get("startWith"))
            endWith = int(request.GET.get("endWith"))

            getAnswers = Message.objects.filter(answerTo=messageID).order_by('-dateOfCreating')[startWith:endWith]

            serializedQuerySet = fullMessageSerializer(getAnswers,many=True)

            return Response({"data":serializedQuerySet.data},status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"message":"Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)