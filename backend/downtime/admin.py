from django.contrib import admin
from .models import MachineDowntimeEvent


@admin.register(MachineDowntimeEvent)
class MachineDowntimeEventAdmin(admin.ModelAdmin):
    list_display = (
        "id", "line", "machine", "category", "subcategory", "code",
        "start_epoch", "closeout_epoch", "severity", "employee_id",
        "created_at_utc", "updated_at_utc",
    )
    list_filter = ("line", "machine", "category", "severity", "is_deleted")
    search_fields = ("line", "machine", "code", "employee_id", "comment", "closeout_comment")
    ordering = ("-created_at_utc",)
