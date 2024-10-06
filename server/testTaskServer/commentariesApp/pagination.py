from rest_framework.pagination import PageNumberPagination

class MessagePagination(PageNumberPagination):

    page_size = 25
    max_page_size = 25
    page_query_param = "page"

class AnswerPagination(PageNumberPagination):
    page_size = 2
    max_page_size = 2
    page_query_param = "page"