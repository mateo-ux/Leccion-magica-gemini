from django.urls import path
from .views import MyTokenObtainPairView, UserDataView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('me/', UserDataView.as_view(), name='user_data'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
