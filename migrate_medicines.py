"""
One-time script to migrate the 112 real medicines into MongoDB Atlas.
Run this ONCE from your project root (where your .env / backend lives).

Usage:
    pip install pymongo python-dotenv --break-system-packages
    python3 migrate_medicines.py
"""

import os
import json
import certifi
from pymongo import MongoClient

# Reads MONGO_URI from environment. Set it inline below if you don't use .env locally.
MONGO_URI = os.environ.get("MONGO_URI")
if not MONGO_URI:
    # Look for .env file or raise error
    from dotenv import load_dotenv
    load_dotenv()
    MONGO_URI = os.environ.get("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable not found. Please set it in your environment or .env file.")

client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client.get_default_database()  # uses the db name from your URI
medicines_col = db["medicines"]

with open("medicines.json", "r") as f:
    medicines = json.load(f)

# Clear any old test data first (safe to run multiple times)
medicines_col.delete_many({})

# Insert fresh
result = medicines_col.insert_many(medicines)

# Helpful indexes for fast search/filter
medicines_col.create_index("name")
medicines_col.create_index("category")

print(f"✅ Inserted {len(result.inserted_ids)} medicines into MongoDB.")
print("✅ Indexes created on 'name' and 'category'.")
