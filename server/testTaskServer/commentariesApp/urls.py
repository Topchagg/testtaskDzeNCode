from django.urls import path,include
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import *

router = SimpleRouter()

router.register(r'message',MessageView,basename='message')
router.register(r'user',UserViewSet,basename='user')

urlpatterns = [
    path('',include(router.urls)),

    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    path('answers/',getAnswers.as_view(),name='answers')

]   