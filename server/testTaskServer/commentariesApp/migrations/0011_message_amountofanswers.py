# Generated by Django 5.1.1 on 2024-10-08 18:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('commentariesApp', '0010_remove_message_image_message_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='amountOfAnswers',
            field=models.IntegerField(default=0),
        ),
    ]
