from supabase_client import supabase

def init_db():
    pass  # Supabase handles everything, nothing needed here

def log_emergency(data):
    response = supabase.table("logs").insert({
        "log_id":        data["log_id"],
        "inci_id":       data["inci_id"],
        "resp_time":     data.get("resp_time"),
        "ai_prediction": data.get("ai_prediction"),
    }).execute()
    return response

def get_logs_by_incident(inci_id: str):
    response = supabase.table("logs") \
        .select("*") \
        .eq("inci_id", inci_id) \
        .order("created_at", desc=True) \
        .execute()
    return response.data
