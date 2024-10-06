from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from django.shortcuts import get_object_or_404

import math

from .models import *
from .serializers import *
from .pagination import *

from .utils.cacheMethods import CacheMethods
from .utils.callBackUpdateCache import *
from .utils.orderBy import *
from .utils.cacheNameBuilder import *

from .customPermissions import *


# ViewSets -> 

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['list','create']:
            return [AllowAny()]
        elif self.action in ['destroy','update']:
            return [IsOwner()]
        elif self.action == 'retrieve':
            return [IsAuthenticated()]
        else:
            return [IsOwner()]
    
    def retrieve(self, request, *args, **kwargs):

        jwtAuth = JWTAuthentication()
        try:
            username,validatedToken = jwtAuth.authenticate(request=request)
            neededUser = get_object_or_404(User,username=username)

            if not neededUser:
                raise Exception("Here's no such of user")
            
            serializedData = UserDetailSerializer(neededUser,many=False).data

            return Response(serializedData)

        except Exception as e:
            print(e)
            return Response({"message":"Authentication failed"},status=status.HTTP_400_BAD_REQUEST)

class MessageView(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = fullMessageSerializer
    pagination_class = MessagePagination
    filteredCacheName = "filtered" # паттерн для удаления кеша

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        elif self.action in ['list', 'retrieve']:
            return [AllowAny()]
        elif self.action in ['destroy','update']:
            return [IsOwner()]
        else:
            return [IsOwner(),IsAdminUser()]

    def list(self, request, *args, **kwargs):
        try:
            pageNumber = request.GET.get("page", 1)
            isFilterByName = request.GET.get("by-name")
            isFilterByEmail = request.GET.get("by-email")
            isFilterByDate = request.GET.get("by-date","descending")

            keyOfCache = CacheNameBuilder(
                self.filteredCacheName,{
                    "isFilterByName": isFilterByName,
                    "isFilterByEmail": isFilterByEmail,
                    "isFilterByDate": isFilterByDate,
                    "page": pageNumber
                })
                


            if keyOfCache == False:
                return Response({"message":"wrong params"},status=status.HTTP_400_BAD_REQUEST)

            cachedData = CacheMethods.getCache(keyOfCache)
            if cachedData:
                return Response(cachedData, status=status.HTTP_200_OK)

            result = Message.objects.filter(isAnswer=False)


            if isFilterByName:
                result = orderBy(result, "username", isFilterByName)
            if isFilterByEmail:
                result = orderBy(result, "email", isFilterByEmail)
            if isFilterByDate:
                result = orderBy(result, "dateOfCreating", isFilterByDate)

            paginator = self.pagination_class()
            paginatedMessages = paginator.paginate_queryset(result, request)
            serializedData = self.serializer_class(paginatedMessages, many=True)

            CacheMethods.setCache(keyOfCache, paginator.get_paginated_response(serializedData.data).data, 120) 
            cacheToReturn = CacheMethods.getCache(keyOfCache)

            return Response(cacheToReturn)

        except Exception as e:
            print(e)
            return Response({"message": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            response = super().update(request, *args, **kwargs)

            updatedMessage = self.get_object()

            sortedMessages = Message.objects.order_by('-dateOfCreating')

            elPosition = list(sortedMessages).index(updatedMessage) + 1  

            messagesPerPage = 25

            pageNumber = math.ceil(elPosition / messagesPerPage)

            nameCacheToDelete = CacheNameBuilder(self.filteredCacheName, {"page": pageNumber})
            CacheMethods.deleteCache(nameCacheToDelete) # Удаляю кеш страницы на которой был обновлен предмет (Если была)

            return Response({"message": response.data}, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({"message": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def create(self, request, *args, **kwargs):
        jwtAuth = JWTAuthentication()

        try:
            username, validatedToken = jwtAuth.authenticate(request)
            neededUser = get_object_or_404(User, username=username)

            serializedData = UserDetailSerializer(neededUser, many=False)

            newData = {
                "owner": serializedData.data.get("pk"),  
                **json.loads(request.body) 
            }

            serializer = CreateMessageSerializer(data=newData, many=False)
            if serializer.is_valid():
                deleteCacheByPattern(self.filteredCacheName)

                created_message = serializer.save()

                response_serializer = self.serializer_class(created_message)

                return Response({
                    "message": "Message created successfully!",
                    "id": created_message.id,  
                    "result": response_serializer.data  
                }, status=status.HTTP_201_CREATED)

            return Response({
                "message": "Data isn't valid",
                "errors": serializer.errors 
            }, status=status.HTTP_400_BAD_REQUEST)

        except User.DoesNotExist:
            return Response({
                "message": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)

        except json.JSONDecodeError:
            return Response({
                "message": "Invalid JSON",
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print(e)
            return Response({
                "message": "Something went wrong",
                "error": str(e)     
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def destroy(self, request, *args, **kwargs):

        deleteCacheByPattern(MessageView.filteredCacheName) # Удаляю все фильтрационные страницы (Если бы)
        return super().destroy(request, *args, **kwargs)
# ApViews -> 

class getAnswers(APIView):

    def get(self,request,*args,**kwargs):

        try:
            paginator = AnswerPagination()

            messageID = request.GET.get("messageID")

            if not messageID:
                return Response({"message":"Wrong params"},status=status.HTTP_400_BAD_REQUEST)

            answers = Message.objects.filter(answerTo=messageID).filter(isAnswer=True).order_by('-dateOfCreating')

            paginatedAnswers = paginator.paginate_queryset(answers,request)
            serializedData = fullMessageSerializer(paginatedAnswers, many=True).data

            return paginator.get_paginated_response(serializedData)

        except Exception as e:
            print(e)
            return Response({"message":"Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)   
        

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
