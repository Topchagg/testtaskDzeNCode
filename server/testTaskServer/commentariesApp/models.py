from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin,UserManager
from django.contrib.auth.hashers import make_password
# from django.contrib.auth.models import UserManager


class User(AbstractBaseUser,PermissionsMixin):
    username = models.CharField(max_length=100,unique=True)
    email = models.EmailField()
    # homepage = models.URLField()
    password = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()  

    USERNAME_FIELD = 'username'  
    REQUIRED_FIELDS = []

    def save(self, *args, **kwargs):
        if self.password:  
            self.password = make_password(self.password)  
        super().save(*args, **kwargs)


class Message(models.Model):
    owner = models.ForeignKey(User,on_delete=models.PROTECT,null=True,blank=True,default=None)
    # username = models.CharField(max_length=100)
    # email = models.EmailField()
    # homepage = models.URLField(blank=True,null=True,unique=True)
    # captcha = models.CharField() // client
    text = models.TextField()
    image = models.URLField(blank=True,null=True)
    dateOfCreating = models.DateTimeField(auto_now=True)
    

    isAnswer = models.BooleanField(default=False)
    answerTo = models.ForeignKey('self',on_delete=models.CASCADE,null=True,blank=True)
    hasAnswers = models.BooleanField(default=False)



