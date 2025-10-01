from django.contrib import admin
from django.urls import path
from DeciCASE.views import main
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', main, name='home'),  # raíz del sitio
    path('main/', main),
    path('save/', views.save_objectives, name='save_objectives'),
]
