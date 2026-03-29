from flask import Blueprint, jsonify, request
from database.supabase import supabase  # your Supabase client

admin_bp = Blueprint("admin_bp", __name__)

@admin_bp.route("/stats", methods=["GET"])
def stats():
    try:
        # Optional filters
        filter_type = request.args.get("type")
        filter_severity = request.args.get("severity")

        # ---------------- TOTAL COUNT ----------------
        total_resp = supabase.table("incidents").select("id", count="exact").execute()
        total = total_resp.data[0]['count'] if total_resp.data else 0

        # ---------------- TYPE STATS ----------------
        query_type = supabase.table("incidents").select("type", count="type", group="type")
        if filter_type:
            query_type = query_type.eq("type", filter_type)
        type_resp = query_type.execute()
        type_data_raw = type_resp.data or []

        type_data = [
            {
                "type": t["type"],
                "count": t["count"],
                "percentage": round((t["count"] / total) * 100, 2) if total else 0
            }
            for t in type_data_raw
        ]

        # ---------------- SEVERITY STATS ----------------
        query_severity = supabase.table("incidents").select("severity", count="severity", group="severity")
        if filter_severity:
            query_severity = query_severity.eq("severity", filter_severity)
        severity_resp = query_severity.execute()
        severity_data_raw = severity_resp.data or []

        severity_data = [
            {
                "severity": s["severity"],
                "count": s["count"],
                "percentage": round((s["count"] / total) * 100, 2) if total else 0
            }
            for s in severity_data_raw
        ]

        # ---------------- SERVICE STATS (OPTIONAL) ----------------
        service_data = []  # you can implement later if you have service_name in table

        # ---------------- RECENT CASES ----------------
        recent_resp = (
            supabase.table("incidents")
            .select("type,severity")
            .order("created_at", desc=True)
            .limit(5)
            .execute()
        )
        recent_raw = recent_resp.data or []
        recent = [{"type": r["type"], "severity": r["severity"]} for r in recent_raw]

        # ---------------- FINAL RESPONSE ----------------
        return jsonify({
            "status": "success",
            "summary": {"total_cases": total},
            "analytics": {
                "by_type": type_data,
                "by_severity": severity_data,
                "by_service": service_data
            },
            "recent_cases": recent
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
