from django.urls import path

from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('',views.getRoutes),
    path('check_email',views.checkEmail),
    path('botregister',views.botRegister),
    path('upload_video',views.uploadVideo),
    path('video_link',views.saveVideoLink),
    path('profile/<str:link>',views.getProfile),
]
