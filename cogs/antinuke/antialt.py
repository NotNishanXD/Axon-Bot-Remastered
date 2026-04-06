import discord
from discord.ext import commands
import aiosqlite
import datetime
from utils.Tools import *

class AntiAlt(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_member_join(self, member):
        guild = member.guild
        if member.bot:
            return

        async with aiosqlite.connect('db/anti.db') as db:
            async with db.execute("SELECT status FROM antinuke WHERE guild_id = ?", (guild.id,)) as cursor:
                row = await cursor.fetchone()
                if not row or not row[0]:
                    return

            # Default threshold: 7 days
            threshold_days = 7
            account_age = (discord.utils.utcnow() - member.created_at).days

            if account_age < threshold_days:
                try:
                    embed = discord.Embed(
                        title="Anti-Alt Protection",
                        description=f"Your account is too new to join **{guild.name}**.\nRequired Age: {threshold_days} days\nYour Account Age: {account_age} days",
                        color=0xff0000
                    )
                    await member.send(embed=embed)
                except:
                    pass

                try:
                    await member.kick(reason="Anti-Alt: Account younger than 7 days")
                except discord.Forbidden:
                    pass

async def setup(bot):
    await bot.add_cog(AntiAlt(bot))
