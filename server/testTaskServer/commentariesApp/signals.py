from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.shortcuts import get_object_or_404

from .models import Message
from .views import MessageView
from .utils.deleteCacheByPattern import deleteCacheByPattern


from .serializers import *

@receiver(post_save, sender=Message)
def updateHasAnswers(sender, instance, created, **kwargs):
    if created and instance.answerTo:
        instance.answerTo.hasAnswers = True
        instance.answerTo.amountOfAnswers = instance.answerTo.amountOfAnswers + 1
        instance.answerTo.save()


@receiver(post_delete, sender=Message)
def updateAfterDelete(sender, instance, **kwargs):
    deleteCacheByPattern(MessageView.filteredCacheName) 
    fakeSerializedData = fullMessageSerializer(instance,many=False).data
    if (fakeSerializedData.get('answerTo')):
        neededObject = False
        try:
            neededObject = get_object_or_404(Message,id=fakeSerializedData.get('answerTo'))
        except:
            return
        
        if neededObject:
            if not neededObject.answers.exists():
                neededObject.hasAnswers = False
                neededObject.amountOfAnswers = 0
                neededObject.save()
            else:
                neededObject.amountOfAnswers = neededObject.amountOfAnswers - 1
        else:
            return
