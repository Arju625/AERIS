import os
from supabase import create_client
from dotenv import load_dotenv

# 🔥 FORCE LOAD .env FROM CURRENT DIRECTORY
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, ".env")

load_dotenv(env_path)

# DEBUG PRINTS
print("ENV PATH:", env_path)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

print("URL:", url)
print("KEY:", key)

if not url or not key:
    raise Exception("Supabase credentials missing in .env")

supabase = create_client(url, key)