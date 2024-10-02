from django.db import models

class Message:
    def __init__(self) -> None:
        pass

class User(models.Model):
    username = models.CharField(max_length=100)
    email = models.EmailField()
    homepage = models.URLField(unique=True)
    password = models.CharField(max_length=100)
    login = models.CharField(max_length=100,unique=True)


class Message(models.Model):
    owner = models.ForeignKey(User,on_delete=models.PROTECT,null=True,blank=True,default=None)
    username = models.CharField(max_length=100)
    email = models.EmailField()
    homepage = models.URLField(blank=True,null=True,unique=True)
    # captcha = models.CharField() // client
    text = models.TextField()
    image = models.URLField(blank=True,null=True)
    dateOfCreating = models.DateTimeField(auto_now=True)

    isAnswer = models.BooleanField(default=False)
    answerTo = models.ForeignKey('self',on_delete=models.CASCADE,null=True,blank=True)



