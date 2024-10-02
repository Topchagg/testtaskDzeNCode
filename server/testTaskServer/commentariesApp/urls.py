from django.urls import path,include
from rest_framework.routers import SimpleRouter

from .views import *

router = SimpleRouter()

router.register(r'user',UserView,basename='user')
router.register(r'message',MessageView,basename='message')


urlpatterns = [
    path('',include(router.urls))
]   