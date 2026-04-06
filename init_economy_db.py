import sqlite3
import os

db_path = 'db/economy.db'
if not os.path.exists('db'):
    os.makedirs('db')

conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Table: balances - Stores wallet and bank balances
cur.execute('''
    CREATE TABLE IF NOT EXISTS balances (
        user_id INTEGER PRIMARY KEY,
        wallet INTEGER DEFAULT 0,
        bank INTEGER DEFAULT 0
    )
''')

# Table: cooldowns - Track timestamps for commands
cur.execute('''
    CREATE TABLE IF NOT EXISTS cooldowns (
        user_id INTEGER PRIMARY KEY,
        last_work TIMESTAMP,
        last_daily TIMESTAMP
    )
''')

conn.commit()
conn.close()
print(f"Database initialized at {db_path}")
