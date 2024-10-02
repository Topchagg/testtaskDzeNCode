from rest_framework.pagination import PageNumberPagination

class MessagePagination(PageNumberPagination):

    page_size = 25
    max_page_size = 25
