from django.db import models


class MachineDowntimeEvent(models.Model):
    id = models.BigAutoField(primary_key=True)
    line = models.CharField(max_length=255, blank=True, null=True)
    machine = models.CharField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=255, blank=True, null=True)
    subcategory = models.CharField(max_length=255, blank=True, null=True)
    code = models.CharField(max_length=100, blank=True, null=True)
    start_epoch = models.BigIntegerField(blank=True, null=True)
    closeout_epoch = models.BigIntegerField(blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    is_deleted = models.BooleanField(blank=True, null=True, default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at_utc = models.DateTimeField(db_column="created_at_UTC", blank=True, null=True)
    updated_at_utc = models.DateTimeField(db_column="updated_at_UTC", blank=True, null=True)
    employee_id = models.CharField(max_length=255, blank=True, null=True)
    closeout_comment = models.TextField(blank=True, null=True)
    labour_requested = models.CharField(max_length=255, blank=True, null=True)
    severity = models.CharField(max_length=50, blank=True, null=True)
    factory_id = models.IntegerField(blank=True, null=True)
    closed_by_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "downtime_machinedowntimeevent"
        ordering = ["-start_epoch"]

    def __str__(self):
        return f"{self.line} - {self.machine} - {self.code}"
