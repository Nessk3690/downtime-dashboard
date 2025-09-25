from django.contrib import admin
from django.urls import path
from downtime import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health", views.health),
    path("filters", views.filters),
    path("events", views.events),
    path("charts", views.charts),
]
