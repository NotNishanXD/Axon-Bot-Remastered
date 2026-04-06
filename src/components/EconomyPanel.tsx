import React, { useState, useEffect } from 'react';
import { Wallet, Landmark, TrendingUp, Trophy, Coins, User } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';
const API_KEY = 'axon_secret_key_123';
const DEFAULT_GUILD_ID = '1234567890';
const DEFAULT_USER_ID = '767979794411028491';

const EconomyPanel: React.FC = () => {
  const [guildId, setGuildId] = useState(DEFAULT_GUILD_ID);
  const [userId, setUserId] = useState(DEFAULT_USER_ID);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [balance, setBalance] = useState({
    wallet: 0,
    bank: 0,
    total: 0
  });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    fetchEconomyData();
  }, [guildId, userId]);

  const fetchEconomyData = async () => {
    setIsApiLoading(true);
    try {
      // Fetch Balance
      const balRes = await fetch(`${API_BASE_URL}/economy/balance/${guildId}/${userId}`, {
        headers: { 'X-API-Key': API_KEY }
      });
      const balData = await balRes.json();
      if (balData && !balData.error) {
        setBalance(balData);
      }

      // Fetch Leaderboard
      const lbRes = await fetch(`${API_BASE_URL}/economy/leaderboard/${guildId}`, {
        headers: { 'X-API-Key': API_KEY }
      });
      const lbData = await lbRes.json();
      if (lbData && !lbData.error) {
        setLeaderboard(Array.isArray(lbData) ? lbData : []);
      }
    } catch (error) {
      console.error('Failed to fetch economy settings:', error);
    }
    setIsApiLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Axon Economy</h1>
          <p className="text-dark-400 mt-1">Manage Axon Coins and view server wealth.</p>
        </div>
        <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
                <span className="text-xs text-dark-500 font-mono">GUILD:</span>
                <input 
                  type="text" 
                  value={guildId} 
                  onChange={(e) => setGuildId(e.target.value)}
                  className="bg-dark-800 border border-dark-600 rounded px-2 py-1 text-xs text-white font-mono w-40"
                />
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-xs text-dark-500 font-mono">USER: &nbsp;</span>
                <input 
                  type="text" 
                  value={userId} 
                  onChange={(e) => setUserId(e.target.value)}
                  className="bg-dark-800 border border-dark-600 rounded px-2 py-1 text-xs text-white font-mono w-40"
                />
            </div>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-primary-900/20 to-dark-900 border-primary-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-500/10 rounded-xl">
              <Wallet className="text-primary-400" size={24} />
            </div>
            {isApiLoading && <div className="h-2 w-2 bg-primary-400 rounded-full animate-ping" />}
          </div>
          <p className="text-sm text-dark-400">Wallet Balance</p>
          <h2 className="text-2xl font-bold text-white mt-1">🪙 {balance.wallet.toLocaleString()}</h2>
        </div>

        <div className="card p-6 bg-gradient-to-br from-blue-900/20 to-dark-900 border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Landmark className="text-blue-400" size={24} />
            </div>
          </div>
          <p className="text-sm text-dark-400">Bank Balance</p>
          <h2 className="text-2xl font-bold text-white mt-1">🏦 {balance.bank.toLocaleString()}</h2>
        </div>

        <div className="card p-6 bg-gradient-to-br from-yellow-900/20 to-dark-900 border-yellow-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <TrendingUp className="text-yellow-400" size={24} />
            </div>
          </div>
          <p className="text-sm text-dark-400">Total Net Worth</p>
          <h2 className="text-2xl font-bold text-white mt-1">💰 {balance.total.toLocaleString()}</h2>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 border-dark-600">
          <div className="flex items-center space-x-3 mb-6">
            <Trophy className="text-yellow-500" size={24} />
            <h3 className="text-xl font-bold text-white">Global Leaderboard</h3>
          </div>
          
          <div className="space-y-4">
            {leaderboard.length > 0 ? (
              leaderboard.map((user, index) => (
                <div key={user.user_id} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-dark-700/50 hover:border-primary-500/30 transition-all">
                  <div className="flex items-center space-x-4">
                    <span className={`text-lg font-bold w-6 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-dark-500'}`}>
                      {index + 1}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-white font-medium font-mono text-sm">{user.user_id}</span>
                      <span className="text-xs text-dark-500">Member ID</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-primary-400 font-bold">🪙 {user.total.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-dark-500">
                <Coins size={48} className="mx-auto mb-2 opacity-20" />
                <p>No high rollers found yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
            <div className="card p-6 border-dark-600">
                <h3 className="text-lg font-bold text-white mb-4">Quick Earn (Simulated)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button className="flex flex-col items-center justify-center p-4 bg-dark-800 border border-dark-700 rounded-xl hover:bg-dark-700 transition-colors group">
                        <Coins className="text-primary-500 mb-2 group-hover:scale-110 transition-transform" size={32} />
                        <span className="text-white font-bold">Daily Coin</span>
                        <span className="text-xs text-dark-500">Claim 1,000 coins</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-dark-800 border border-dark-700 rounded-xl hover:bg-dark-700 transition-colors group">
                        <User className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={32} />
                        <span className="text-white font-bold">Work Hard</span>
                        <span className="text-xs text-dark-500">Earn 50-200 coins</span>
                    </button>
                </div>
            </div>

            <div className="card p-6 border-dashed border-dark-600 bg-transparent flex items-center justify-center py-12">
                <div className="text-center">
                    <Landmark className="mx-auto mb-2 text-dark-600" size={48} />
                    <p className="text-dark-500 italic">Financial logs and store integration coming soon...</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EconomyPanel;
