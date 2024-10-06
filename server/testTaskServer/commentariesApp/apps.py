from django.apps import AppConfig


class CommentariesappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'commentariesApp'

    def ready(self) -> None:
        import commentariesApp.signals