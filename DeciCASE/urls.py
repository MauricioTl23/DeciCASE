from django.contrib import admin
from django.urls import path
from DeciCASE import views 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.main, name='home'),  
    path('main/', views.main),
    path('save/', views.save_objectives, name='save_objectives'),
]
