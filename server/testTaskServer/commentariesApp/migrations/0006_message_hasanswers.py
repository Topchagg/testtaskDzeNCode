# Generated by Django 5.1.1 on 2024-10-06 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('commentariesApp', '0005_remove_user_homepage'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='hasAnswers',
            field=models.BooleanField(default=False),
        ),
    ]
