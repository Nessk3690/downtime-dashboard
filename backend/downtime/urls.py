from django.urls import path
from . import views

urlpatterns = [
    path("health", views.health, name="health"),
    path("filters", views.filters, name="filters"),
    path("events", views.events, name="events"),
    path("charts", views.charts, name="charts"),
]
