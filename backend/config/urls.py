"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/users/', include('users.urls')),
    path('api/assistant/', include('assistant.urls')),
    path('admin/', admin.site.urls),
]
