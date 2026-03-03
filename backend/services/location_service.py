import math

emergency_centers = {
    "hospital": [
        ("Lakeshore Hospital", 10.0154, 76.3412),
        ("Aster Medcity", 10.0261, 76.3503),
        ("General Hospital Kochi", 10.0082, 76.3321)
    ],
    "fire": [
        ("Ernakulam Fire Station", 10.0201, 76.3454),
        ("North Fire Station", 10.0303, 76.3552)
    ],
    "police": [
        ("Central Police Station", 10.0184, 76.3423)
    ]
}

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    return R * c

def find_nearest(service_type, user_lat, user_lon):
    nearest = None
    min_dist = float("inf")

    for name, lat, lon in emergency_centers.get(service_type, []):
        dist = haversine(user_lat, user_lon, lat, lon)
        if dist < min_dist:
            min_dist = dist
            nearest = (name, lat, lon, round(dist, 2))

    return nearest