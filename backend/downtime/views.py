import time
from datetime import datetime
from typing import Optional

from django.http import JsonResponse
from django.db.models import Count, Sum, F, Value, FloatField
from django.db.models.functions import Coalesce
from django.views.decorators.http import require_GET

from .models import MachineDowntimeEvent


# --- Helpers -----------------------------------------------------

def _iso_to_epoch(s: Optional[str]) -> Optional[int]:
    """
    Convert an ISO8601 datetime string to epoch seconds.
    Accepts strings like '2025-09-23T03:59:59Z' or with fractional seconds.
    Returns None if parsing fails.
    """
    if not s:
        return None
    try:
        # Strip trailing Z/z and replace with UTC offset
        s2 = s.rstrip("Zz")
        dt = datetime.fromisoformat(s2.replace("Z", "+00:00").replace("z", "+00:00"))
        return int(dt.timestamp())
    except Exception:
        return None


# --- API Endpoints ------------------------------------------------

@require_GET
def health(request):
    """Simple health check."""
    return JsonResponse({"status": "ok"})


@require_GET
def filters(request):
    """
    Returns distinct lists of filter values for dropdowns:
    lines, machines, categories, subcategories, codes.
    Optional cascading filters by line/machine/category.
    """
    qs = MachineDowntimeEvent.objects.all()

    # Optional filters to narrow down filter values
    line = request.GET.get("line")
    machine = request.GET.get("machine")
    category = request.GET.get("category")

    if line:
        qs = qs.filter(line=line)
    if machine:
        qs = qs.filter(machine=machine)
    if category:
        qs = qs.filter(category=category)

    data = {
        "lines": list(
            qs.exclude(line__isnull=True).exclude(line="")
              .values_list("line", flat=True).distinct().order_by("line")
        ),
        "machines": list(
            qs.exclude(machine__isnull=True).exclude(machine="")
              .values_list("machine", flat=True).distinct().order_by("machine")
        ),
        "categories": list(
            qs.exclude(category__isnull=True).exclude(category="")
              .values_list("category", flat=True).distinct().order_by("category")
        ),
        "subcategories": list(
            qs.exclude(subcategory__isnull=True).exclude(subcategory="")
              .values_list("subcategory", flat=True).distinct().order_by("subcategory")
        ),
        "codes": list(
            qs.exclude(code__isnull=True).exclude(code="")
              .values_list("code", flat=True).distinct().order_by("code")
        ),
    }
    return JsonResponse(data)


@require_GET
def events(request):
    """
    Paginated list of downtime events with optional filters:
    ?line=&machine=&category=&subcategory=&code=&start=&end=&page=&limit=
    """
    qs = MachineDowntimeEvent.objects.all()

    # Filters
    if line := request.GET.get("line"):
        qs = qs.filter(line=line)
    if machine := request.GET.get("machine"):
        qs = qs.filter(machine=machine)
    if category := request.GET.get("category"):
        qs = qs.filter(category=category)
    if subcategory := request.GET.get("subcategory"):
        qs = qs.filter(subcategory=subcategory)
    if code := request.GET.get("code"):
        qs = qs.filter(code=code)

    # Date range filtering
    start = _iso_to_epoch(request.GET.get("start"))
    end = _iso_to_epoch(request.GET.get("end"))
    if start is not None:
        qs = qs.filter(start_epoch__gte=start)
    if end is not None:
        qs = qs.filter(start_epoch__lte=end)

    # Pagination
    page = max(int(request.GET.get("page", 1)), 1)
    limit = max(min(int(request.GET.get("limit", 25)), 200), 1)
    total = qs.count()
    start_idx = (page - 1) * limit

    rows = qs.values(
        "id", "line", "machine", "category", "subcategory", "code",
        "start_epoch", "closeout_epoch", "comment", "employee_id",
        "closeout_comment", "severity", "factory_id", "closed_by_id",
        "created_at_utc", "updated_at_utc"
    )[start_idx:start_idx + limit]

    return JsonResponse({
        "page": page,
        "limit": limit,
        "total": total,
        "rows": list(rows),
    })


@require_GET
def charts(request):
    """
    Aggregated counts + total downtime minutes, grouped by:
    /charts?group_by=line|machine|code&start=<iso>&end=<iso>
    """
    group_by = request.GET.get("group_by", "line")
    if group_by not in {"line", "machine", "code"}:
        return JsonResponse(
            {"error": "group_by must be one of: line, machine, code"},
            status=400
        )

    qs = MachineDowntimeEvent.objects.all()

    # Date filtering
    start = _iso_to_epoch(request.GET.get("start"))
    end = _iso_to_epoch(request.GET.get("end"))
    if start is not None:
        qs = qs.filter(start_epoch__gte=start)
    if end is not None:
        qs = qs.filter(start_epoch__lte=end)

    # Calculate duration in minutes = (closeout or now - start) / 60
    now_epoch = int(time.time())
    duration_expr = (Coalesce(F("closeout_epoch"), Value(now_epoch)) - F("start_epoch")) / Value(60.0)

    agg = (
        qs.values(group_by)
          .annotate(
              count=Count("id"),
              total_minutes=Sum(duration_expr, output_field=FloatField())
          )
          .order_by("-count")
    )

    data = [
        {
            "name": item[group_by] or "(blank)",
            "count": item["count"],
            "total_minutes": round(item["total_minutes"] or 0, 2)
        }
        for item in agg
    ]

    return JsonResponse({"group_by": group_by, "data": data})
