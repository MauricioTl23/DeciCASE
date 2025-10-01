from django.contrib import admin
from django.urls import path
from DeciCASE.views import main, save_objectives

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', main, name='home'),
    path('main/', main),
    path('save/', save_objectives, name='save_objectives'),
]
