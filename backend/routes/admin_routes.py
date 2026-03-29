from flask import Blueprint, jsonify, request
from supabase_client import supabase

admin_bp = Blueprint("admin_bp", __name__)


# -------------------- STATS --------------------
@admin_bp.route("/stats", methods=["GET"])
def stats():
    try:
        # -------- FETCH ALL DATA --------
        response = supabase.table("emergencies").select("*").execute()
        data = response.data or []

        total = len(data)

        # -------- TYPE STATS --------
        type_counts = {}
        for r in data:
            t = r.get("type", "unknown")
            type_counts[t] = type_counts.get(t, 0) + 1

        type_data = [
            {
                "type": k,
                "count": v,
                "percentage": round((v / total) * 100, 2) if total else 0
            }
            for k, v in type_counts.items()
        ]

        # -------- SEVERITY STATS --------
        severity_counts = {}
        for r in data:
            s = r.get("severity", "unknown")
            severity_counts[s] = severity_counts.get(s, 0) + 1

        severity_data = [
            {
                "severity": k,
                "count": v,
                "percentage": round((v / total) * 100, 2) if total else 0
            }
            for k, v in severity_counts.items()
        ]

        # -------- RECENT CASES --------
        sorted_data = sorted(
            data,
            key=lambda x: x.get("created_at", ""),
            reverse=True
        )

        recent = [
            {
                "type": r.get("type"),
                "severity": r.get("severity"),
                "status": r.get("status")
            }
            for r in sorted_data[:5]
        ]

        # -------- FINAL RESPONSE --------
        return jsonify({
            "status": "success",
            "summary": {"total_cases": total},
            "analytics": {
                "by_type": type_data,
                "by_severity": severity_data
            },
            "recent_cases": recent
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# -------------------- REPORTS --------------------
@admin_bp.route("/reports", methods=["GET"])
def reports():
    try:
        res = (
            supabase.table("emergencies")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return jsonify(res.data or [])

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- UPDATE STATUS --------------------
@admin_bp.route("/update-status/<string:id>", methods=["PUT"])
def update_status(id):
    try:
        status = request.json.get("status")

        supabase.table("emergencies").update({
            "status": status
        }).eq("id", id).execute()

        return jsonify({"message": "Status updated"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------- TRENDS --------------------
@admin_bp.route("/trends", methods=["GET"])
def trends():
    try:
        res = supabase.table("emergencies").select("created_at").execute()
        data = res.data or []

        daily_counts = {}

        for r in data:
            date = r["created_at"][:10]  # YYYY-MM-DD
            daily_counts[date] = daily_counts.get(date, 0) + 1

        formatted = [[k, v] for k, v in sorted(daily_counts.items())]

        return jsonify({"daily": formatted})

    except Exception as e:
        return jsonify({"error": str(e)}), 500