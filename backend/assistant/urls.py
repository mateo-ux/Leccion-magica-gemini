from django.urls import path
from .views import ChatView, SearchHistoryView, ChatHistoryView, StudentChatView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('search-history/', SearchHistoryView.as_view(), name='search-history'),
    path('chat-history/', ChatHistoryView.as_view(), name='chat-history'),
    path('student-chat/', StudentChatView.as_view(), name='student-chat'),
]

