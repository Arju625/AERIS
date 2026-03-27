import sqlite3

def init_db():
    conn = sqlite3.connect("emergencies.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        severity TEXT,
        suggestion TEXT,
        latitude REAL,
        longitude REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()


# -------- LOG FUNCTION --------
def log_emergency(data):
    conn = sqlite3.connect("emergencies.db")
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO logs (type, severity, lat, lon, service, distance)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data["type"],
        data["severity"],
        data["lat"],
        data["lon"],
        data["service"],
        data["distance"]
    ))

    conn.commit()
    conn.close()