import sqlite3
import os

databases = ['db/anti.db', 'db/automod.db']

for db_path in databases:
    if os.path.exists(db_path):
        print(f"--- Schema for {db_path} ---")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        for table in tables:
            table_name = table[0]
            print(f"Table: {table_name}")
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()
            for col in columns:
                print(f"  Column: {col[1]} ({col[2]})")
        conn.close()
    else:
        print(f"Database {db_path} not found.")
