import os
os.system("pip install -r requirements.txt")
import asyncio
import traceback
from threading import Thread
from datetime import datetime

import aiohttp
import discord
from discord.ext import commands

from core import Context
from core.Cog import Cog
from core.axon import axon
from utils.Tools import *
from utils.config import *

import jishaku
import cogs

os.environ["JISHAKU_NO_DM_TRACEBACK"] = "False"
os.environ["JISHAKU_HIDE"] = "True"
os.environ["JISHAKU_NO_UNDERSCORE"] = "True"
os.environ["JISHAKU_FORCE_PAGINATOR"] = "True"

from dotenv import load_dotenv
load_dotenv()
TOKEN = os.getenv("TOKEN")

client = axon()
tree = client.tree

@client.event
async def on_ready():
    await client.wait_until_ready()
    
    print("""
           \033[1;31m

 ▄████▄   ▒█████  ▓█████▄ ▓█████ ▒██   ██▒
▒██▀ ▀█  ▒██▒  ██▒▒██▀ ██▌▓█   ▀ ▒▒ █ █ ▒░
▒▓█    ▄ ▒██░  ██▒░██   █▌▒███   ░░  █   ░
▒▓▓▄ ▄██▒▒██   ██░░▓█▄   ▌▒▓█  ▄  ░ █ █ ▒ 
▒ ▓███▀ ░░ ████▓▒░░▒████▓ ░▒████▒▒██▒ ▒██▒
░ ░▒ ▒  ░░ ▒░▒░▒░  ▒▒▓  ▒ ░░ ▒░ ░▒▒ ░ ░▓ ░
  ░  ▒     ░ ▒ ▒░  ░ ▒  ▒  ░ ░  ░░░   ░▒ ░
░        ░ ░ ░ ▒   ░ ░  ░    ░    ░    ░  
░ ░          ░ ░     ░       ░  ░ ░    ░  
░                  ░                      

           \033[0m
           """)
    print("Loaded & Online!")
    print(f"Logged in as: {client.user}")
    print(f"Connected to: {len(client.guilds)} guilds")
    print(f"Connected to: {len(client.users)} users")
    try:
        synced = await client.tree.sync()
        all_commands = list(client.commands)
        print(f"Synced Total {len(all_commands)} Client Commands and {len(synced)} Slash Commands")
    except Exception as e:
        print(e)

@client.event
async def on_command_completion(context: commands.Context) -> None:
    admin_id = int(os.getenv("ADMIN_ID", 767979794411028491))
    if context.author.id == admin_id:
        return

    executed_command = context.command.qualified_name
    webhook_url = os.getenv("LOGGING_WEBHOOK", "https://discord.com/api/webhooks/1389541229775159356/fnyxoWRhcIt77OLabLZLLCrKxoxQDmEN4yZbUaDMK82-qymTbMMwwQA5WkFJ4zRi0R_l")
    
    webhook = discord.Webhook.from_url(webhook_url, session=client.session)

    avatar_url = context.author.avatar.url if context.author.avatar else context.author.default_avatar.url
    embed = discord.Embed(color=0x000000, timestamp=discord.utils.utcnow())
    embed.set_author(name=f"Command Executed: {executed_command}", icon_url=avatar_url)
    embed.set_thumbnail(url=avatar_url)
    embed.add_field(name="User", value=f"{context.author} ({context.author.id})", inline=True)
    
    if context.guild:
        embed.add_field(name="Guild", value=f"{context.guild.name} ({context.guild.id})", inline=True)
        embed.add_field(name="Channel", value=f"{context.channel.name} ({context.channel.id})", inline=False)
    else:
        embed.add_field(name="Location", value="Direct Messages", inline=True)

    embed.set_footer(text="Axon Logging System", icon_url=client.user.display_avatar.url)
    
    try:
        await webhook.send(embed=embed)
    except Exception as e:
        print(f"Logging failed: {e}")

from flask import Flask, request, jsonify
from flask_cors import CORS
from threading import Thread
import sqlite3

app = Flask(__name__)
CORS(app)

DASHBOARD_API_KEY = os.getenv("DASHBOARD_API_KEY", "axon_secret_key_123")

def verify_api_key():
    key = request.headers.get("X-API-Key")
    return key == DASHBOARD_API_KEY

@app.route('/')
def home():
    return f"Axon Development™ 2025 - API Active"

@app.route('/api/stats', methods=['GET'])
def get_stats():
    if not verify_api_key():
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        with open("dashboard_stats.json", "r") as f:
            stats = json.load(f)
        return jsonify(stats)
    except:
        return jsonify({"error": "Stats not ready"}), 503

@app.before_first_request
def setup_db():
    try:
        conn = sqlite3.connect('db/prefix.db')
        cur = conn.cursor()
        cur.execute("CREATE TABLE IF NOT EXISTS moderation_settings (guild_id INTEGER PRIMARY KEY, dm_on_punish BOOLEAN, delete_msg_on_ban BOOLEAN, default_timeout TEXT)")
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Failed to setup mod settings table: {e}")

@app.route('/api/settings/<int:guild_id>', methods=['GET'])
def get_settings(guild_id):
    if not verify_api_key():
        return jsonify({"error": "Unauthorized"}), 401
    
    settings = {}
    try:
        # Antinuke
        conn_anti = sqlite3.connect('db/anti.db')
        cur_anti = conn_anti.cursor()
        cur_anti.execute("SELECT status FROM antinuke WHERE guild_id = ?", (guild_id,))
        row_anti = cur_anti.fetchone()
        settings['antinuke'] = bool(row_anti[0]) if row_anti else False
        conn_anti.close()

        # Automod
        conn_auto = sqlite3.connect('db/automod.db')
        cur_auto = conn_auto.cursor()
        cur_auto.execute("SELECT enabled FROM automod WHERE guild_id = ?", (guild_id,))
        row_auto = cur_auto.fetchone()
        settings['automod'] = bool(row_auto[0]) if row_auto else False
        conn_auto.close()

        # Moderation
        conn_mod = sqlite3.connect('db/prefix.db')
        cur_mod = conn_mod.cursor()
        cur_mod.execute("SELECT dm_on_punish, delete_msg_on_ban, default_timeout FROM moderation_settings WHERE guild_id = ?", (guild_id,))
        row_mod = cur_mod.fetchone()
        if row_mod:
            settings['dmOnKickBan'] = bool(row_mod[0])
            settings['deleteMessagesOnBan'] = bool(row_mod[1])
            settings['defaultTimeout'] = row_mod[2]
        else:
            settings['dmOnKickBan'] = True
            settings['deleteMessagesOnBan'] = True
            settings['defaultTimeout'] = '10m'
        conn_mod.close()
        
        return jsonify(settings)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/settings/<int:guild_id>', methods=['POST'])
def update_settings(guild_id):
    if not verify_api_key():
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.json
    try:
        # Antinuke Update
        if 'antinuke' in data:
            status = 1 if data['antinuke'] else 0
            conn = sqlite3.connect('db/anti.db')
            cur = conn.cursor()
            cur.execute("INSERT OR REPLACE INTO antinuke (guild_id, status) VALUES (?, ?)", (guild_id, status))
            conn.commit()
            conn.close()

        # Automod Update
        if 'automod' in data:
            status = 1 if data['automod'] else 0
            conn = sqlite3.connect('db/automod.db')
            cur = conn.cursor()
            cur.execute("INSERT OR REPLACE INTO automod (guild_id, enabled) VALUES (?, ?)", (guild_id, status))
            conn.commit()
            conn.close()

        # Moderation Update
        if 'dmOnKickBan' in data or 'deleteMessagesOnBan' in data or 'defaultTimeout' in data:
            conn = sqlite3.connect('db/prefix.db')
            cur = conn.cursor()
            # Fetch existing to avoid overwriting with None if some fields are missing from JSON
            cur.execute("SELECT dm_on_punish, delete_msg_on_ban, default_timeout FROM moderation_settings WHERE guild_id = ?", (guild_id,))
            row = cur.fetchone()
            
            dm = data.get('dmOnKickBan', row[0] if row else True)
            dl = data.get('deleteMessagesOnBan', row[1] if row else True)
            dt = data.get('defaultTimeout', row[2] if row else '10m')
            
            cur.execute("INSERT OR REPLACE INTO moderation_settings (guild_id, dm_on_punish, delete_msg_on_ban, default_timeout) VALUES (?, ?, ?, ?)", 
                        (guild_id, int(dm), int(dl), dt))
            conn.commit()
            conn.close()
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def run():
    app.run(host='0.0.0.0', port=os.getenv("PORT", 8080))

def keep_alive():
    server = Thread(target=run)
    server.setDaemon(True)
    server.start()

keep_alive()

async def main():
    async with client:
        os.system("clear")
        await client.load_extension("jishaku")
        await client.start(TOKEN)

if __name__ == "__main__":
    asyncio.run(main())
