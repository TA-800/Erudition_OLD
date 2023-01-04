from django.urls import path
from . import views

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.register, name='register'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', views.apiOverview, name='api-overview'),
    path('courses/<int:course_id>', views.courseList, name='course-list'),
    path('modules/<int:course_id>', views.moduleList, name='module-list'),
]