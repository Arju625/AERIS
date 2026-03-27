from flask import Blueprint, jsonify, request
import sqlite3

admin_bp = Blueprint("admin_bp", __name__)

@admin_bp.route("/stats", methods=["GET"])
def stats():
    try:
        conn = sqlite3.connect("emergencies.db")
        cursor = conn.cursor()

        # -------- OPTIONAL FILTERS --------
        filter_type = request.args.get("type")
        filter_severity = request.args.get("severity")

        # -------- TOTAL COUNT --------
        cursor.execute("SELECT COUNT(*) FROM logs")
        total = cursor.fetchone()[0]

        # -------- TYPE STATS --------
        if filter_type:
            cursor.execute(
                "SELECT type, COUNT(*) FROM logs WHERE type=? GROUP BY type",
                (filter_type,)
            )
        else:
            cursor.execute("SELECT type, COUNT(*) FROM logs GROUP BY type")

        type_data_raw = cursor.fetchall()
        type_data = [
            {
                "type": t[0],
                "count": t[1],
                "percentage": round((t[1] / total) * 100, 2) if total else 0
            }
            for t in type_data_raw
        ]

        # -------- SEVERITY STATS --------
        if filter_severity:
            cursor.execute(
                "SELECT severity, COUNT(*) FROM logs WHERE severity=? GROUP BY severity",
                (filter_severity,)
            )
        else:
            cursor.execute("SELECT severity, COUNT(*) FROM logs GROUP BY severity")

        severity_data_raw = cursor.fetchall()
        severity_data = [
            {
                "severity": s[0],
                "count": s[1],
                "percentage": round((s[1] / total) * 100, 2) if total else 0
            }
            for s in severity_data_raw
        ]

        # -------- SERVICE (TEMP DISABLED) --------
        service_data = []

        # -------- RECENT CASES --------
        cursor.execute("""
            SELECT type, severity
            FROM logs
            ORDER BY ROWID DESC
            LIMIT 5
        """)
        recent_raw = cursor.fetchall()
        recent = [{"type": r[0], "severity": r[1]} for r in recent_raw]

        conn.close()

        # -------- FINAL RESPONSE --------
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