import discord
from discord.ext import commands, tasks
import json
import os
import time

class DashboardAPI(commands.Cog):
    def __init__(self, bot):
        self.bot = bot
        self.start_time = time.time()
        self.update_stats.start()

    def cog_unload(self):
        self.update_stats.cancel()

    @tasks.loop(seconds=60)
    async def update_stats(self):
        try:
            stats = {
                "guild_count": len(self.bot.guilds),
                "user_count": len(self.bot.users),
                "uptime": int(time.time() - self.start_time),
                "shards": self.bot.shard_count,
                "latency": round(self.bot.latency * 1000, 2),
                "last_updated": int(time.time())
            }
            
            with open("dashboard_stats.json", "w") as f:
                json.dump(stats, f, indent=4)
        except Exception as e:
            print(f"Failed to update dashboard stats: {e}")

async def setup(bot):
    await bot.add_cog(DashboardAPI(bot))
