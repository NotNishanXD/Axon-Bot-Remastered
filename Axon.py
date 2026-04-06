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

from flask import Flask
from threading import Thread

app = Flask(__name__)

@app.route('/')
def home():
    return f"Axon Development™ 2025"

def run():
    app.run(host='0.0.0.0', port=8080)

def keep_alive():
    server = Thread(target=run)
    server.start()

keep_alive()

async def main():
    async with client:
        os.system("clear")
        await client.load_extension("jishaku")
        await client.start(TOKEN)

if __name__ == "__main__":
    asyncio.run(main())
