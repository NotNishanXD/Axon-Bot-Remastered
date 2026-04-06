import discord
from discord.ext import commands
import aiosqlite
import datetime
import random
from core import axon
from core.Cog import Cog

class Economy(Cog):
    def __init__(self, bot: axon):
        self.bot = bot
        self.db_path = 'db/economy.db'

    async def get_balance(self, user_id: int):
        async with aiosqlite.connect(self.db_path) as db:
            async with db.execute("SELECT wallet, bank FROM balances WHERE user_id = ?", (user_id,)) as cursor:
                row = await cursor.fetchone()
                if row:
                    return row[0], row[1]
                else:
                    await db.execute("INSERT INTO balances (user_id, wallet, bank) VALUES (?, 0, 0)", (user_id,))
                    await db.commit()
                    return 0, 0

    async def update_balance(self, user_id: int, wallet: int = 0, bank: int = 0):
        w, b = await self.get_balance(user_id)
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute("UPDATE balances SET wallet = ?, bank = ? WHERE user_id = ?", (w + wallet, b + bank, user_id))
            await db.commit()

    async def get_cooldown(self, user_id: int, type: str):
        async with aiosqlite.connect(self.db_path) as db:
            async with db.execute(f"SELECT last_{type} FROM cooldowns WHERE user_id = ?", (user_id,)) as cursor:
                row = await cursor.fetchone()
                if row and row[0]:
                    return datetime.datetime.fromisoformat(row[0])
                return None

    async def update_cooldown(self, user_id: int, type: str):
        now = datetime.datetime.now().isoformat()
        async with aiosqlite.connect(self.db_path) as db:
            await db.execute(f"INSERT OR REPLACE INTO cooldowns (user_id, last_{type}) VALUES (?, ?)", (user_id, now))
            await db.commit()

    @commands.hybrid_command(name="balance", aliases=["bal"], help="Check your Axon Coin balance.")
    async def balance(self, ctx, user: discord.Member = None):
        user = user or ctx.author
        wallet, bank = await self.get_balance(user.id)
        embed = discord.Embed(title=f"{user.display_name}'s Balance", color=0x00FF00)
        embed.add_field(name="Wallet", value=f"🪙 {wallet:,}", inline=True)
        embed.add_field(name="Bank", value=f"🏦 {bank:,}", inline=True)
        embed.add_field(name="Total", value=f"💰 {wallet + bank:,}", inline=False)
        embed.set_footer(text="Axon Economy System")
        await ctx.send(embed=embed)

    @commands.hybrid_command(name="work", help="Work to earn some Axon Coins! (1h cooldown)")
    async def work(self, ctx):
        last_work = await self.get_cooldown(ctx.author.id, "work")
        if last_work and (datetime.datetime.now() - last_work).total_seconds() < 3600:
            remaining = 3600 - (datetime.datetime.now() - last_work).total_seconds()
            return await ctx.send(f"❌ You are too tired! Try again in {int(remaining // 60)}m {int(remaining % 60)}s.")

        reward = random.randint(50, 200)
        await self.update_balance(ctx.author.id, wallet=reward)
        await self.update_cooldown(ctx.author.id, "work")
        await ctx.send(f"✅ You worked hard and earned **🪙 {reward}** Axon Coins!")

    @commands.hybrid_command(name="daily", help="Claim your daily Axon Coins! (24h cooldown)")
    async def daily(self, ctx):
        last_daily = await self.get_cooldown(ctx.author.id, "daily")
        if last_daily and (datetime.datetime.now() - last_daily).total_seconds() < 86400:
            remaining = 86400 - (datetime.datetime.now() - last_daily).total_seconds()
            return await ctx.send(f"❌ You already claimed your daily coins! Try again in {int(remaining // 3600)}h {int((remaining % 3600) // 60)}m.")

        reward = 1000
        await self.update_balance(ctx.author.id, wallet=reward)
        await self.update_cooldown(ctx.author.id, "daily")
        await ctx.send(f"🎉 You claimed your daily reward of **🪙 {reward}** Axon Coins!")

    @commands.hybrid_command(name="deposit", aliases=["dep"], help="Deposit coins into your bank.")
    async def deposit(self, ctx, amount: str):
        wallet, bank = await self.get_balance(ctx.author.id)
        if amount.lower() == "all":
            amount = wallet
        else:
            try:
                amount = int(amount)
            except ValueError:
                return await ctx.send("❌ Please provide a valid amount.")

        if amount <= 0:
            return await ctx.send("❌ Amount must be positive.")
        if amount > wallet:
            return await ctx.send("❌ You don't have that many coins in your wallet.")

        await self.update_balance(ctx.author.id, wallet=-amount, bank=amount)
        await ctx.send(f"🏦 Deposited **🪙 {amount:,}** Axon Coins into your bank.")

    @commands.hybrid_command(name="withdraw", aliases=["with"], help="Withdraw coins from your bank.")
    async def withdraw(self, ctx, amount: str):
        wallet, bank = await self.get_balance(ctx.author.id)
        if amount.lower() == "all":
            amount = bank
        else:
            try:
                amount = int(amount)
            except ValueError:
                return await ctx.send("❌ Please provide a valid amount.")

        if amount <= 0:
            return await ctx.send("❌ Amount must be positive.")
        if amount > bank:
            return await ctx.send("❌ You don't have that many coins in your bank.")

        await self.update_balance(ctx.author.id, wallet=amount, bank=-amount)
        await ctx.send(f"🪙 Withdrew **🪙 {amount:,}** Axon Coins from your bank.")

    @commands.hybrid_command(name="pay", help="Transfer coins to another user.")
    async def pay(self, ctx, user: discord.Member, amount: int):
        if user == ctx.author:
            return await ctx.send("❌ You cannot pay yourself.")
        if amount <= 0:
            return await ctx.send("❌ Amount must be positive.")

        wallet, bank = await self.get_balance(ctx.author.id)
        if amount > wallet:
            return await ctx.send("❌ You don't have enough coins in your wallet.")

        await self.update_balance(ctx.author.id, wallet=-amount)
        await self.update_balance(user.id, wallet=amount)
        await ctx.send(f"✅ Transferred **🪙 {amount:,}** Axon Coins to {user.mention}.")

    @commands.hybrid_command(name="leaderboard", aliases=["lb"], help="View the richest users in the server.")
    async def leaderboard(self, ctx):
        async with aiosqlite.connect(self.db_path) as db:
            async with db.execute("SELECT user_id, (wallet + bank) as total FROM balances ORDER BY total DESC LIMIT 10") as cursor:
                rows = await cursor.fetchall()
        
        if not rows:
            return await ctx.send("No one has any coins yet!")

        embed = discord.Embed(title="🏆 Axon Coin Leaderboard", color=0xFFD700)
        description = ""
        for i, (uid, total) in enumerate(rows, 1):
            user = self.bot.get_user(uid) or f"Unknown User ({uid})"
            description += f"**{i}.** {user} - **🪙 {total:,}**\n"
        
        embed.description = description
        await ctx.send(embed=embed)
