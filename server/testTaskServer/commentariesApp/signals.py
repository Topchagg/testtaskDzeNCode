from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Message

@receiver(post_save, sender=Message)
def updateHasAnswers(sender, instance, created, **kwargs):
    if created and instance.answerTo:
        instance.answerTo.hasAnswers = True
        instance.answerTo.save()

@receiver(post_delete, sender=Message)
def updateHasAnswers(sender, instance, **kwargs):
    if instance.answerTo:
        if not instance.answerTo.answers.exists():
            instance.answerTo.hasAnswers = False
            instance.answerTo.save()