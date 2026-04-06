import React, { useState, useEffect } from 'react';
import { Filter, MessageSquare, Link, Type } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';
const API_KEY = 'axon_secret_key_123';
const DEFAULT_GUILD_ID = '1234567890';

const AutomodPanel: React.FC = () => {
  const [guildId, setGuildId] = useState(DEFAULT_GUILD_ID);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [toggles, setToggles] = useState({
    automodMaster: false,
    antiSpam: true,
    antiCaps: false,
    antiLink: true,
    antiInvite: true,
    antiMassMention: true,
    antiEmojiSpam: false
  });

  useEffect(() => {
    fetchSettings();
  }, [guildId]);

  const fetchSettings = async () => {
    setIsApiLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/settings/${guildId}`, {
        headers: { 'X-API-Key': API_KEY }
      });
      const data = await response.json();
      if (data && !data.error) {
        setToggles(prev => ({ ...prev, automodMaster: !!data.automod }));
      }
    } catch (error) {
      console.error('Failed to fetch automod settings:', error);
    }
    setIsApiLoading(false);
  };

  const toggleHandler = async (key: keyof typeof toggles) => {
    const newValue = !toggles[key];
    setToggles(prev => ({ ...prev, [key]: newValue }));

    if (key === 'automodMaster') {
      try {
        await fetch(`${API_BASE_URL}/settings/${guildId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
          },
          body: JSON.stringify({ automod: newValue })
        });
      } catch (error) {
        console.error('Failed to update automod setting:', error);
        setToggles(prev => ({ ...prev, [key]: !newValue }));
      }
    }
  };

  const rules = [
    { key: 'antiSpam', title: 'Anti-Spam', desc: 'Prevents users from sending repeated messages quickly.', icon: MessageSquare },
    { key: 'antiCaps', title: 'Anti-Caps', desc: 'Warns users heavily using caps lock.', icon: Type },
    { key: 'antiLink', title: 'Anti-Link', desc: 'Blocks all external domain links automatically.', icon: Link },
    { key: 'antiInvite', title: 'Anti-Invite', desc: 'Removes discord.gg invite links instantly.', icon: Link },
    { key: 'antiMassMention', title: 'Anti-Mass Mention', desc: 'Stops users from pinging multiple roles/users.', icon: Filter },
    { key: 'antiEmojiSpam', title: 'Anti-Emoji Spam', desc: 'Clears messages flooded with pure emojis.', icon: Filter },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Auto Mod Configuration</h1>
          <p className="text-dark-400 mt-1">Fine-tune automated filtering and rules.</p>
        </div>
        <div className="flex items-center space-x-2">
            <span className="text-sm text-dark-400 font-mono">Guild ID:</span>
            <input 
              type="text" 
              value={guildId} 
              onChange={(e) => setGuildId(e.target.value)}
              className="bg-dark-800 border border-dark-600 rounded px-2 py-1 text-sm text-white font-mono w-48"
            />
        </div>
      </div>

      <div className="card p-6 bg-primary-900/10 border border-primary-500/20 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="text-primary-500" size={32} />
            <div>
              <h3 className="text-xl font-bold text-white">Master Automod Toggle</h3>
              <p className="text-sm text-dark-400">Enable or disable all automated moderation filters at once.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             {isApiLoading && <span className="text-xs text-primary-500 animate-pulse">Syncing...</span>}
             <button onClick={() => toggleHandler('automodMaster')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${toggles.automodMaster ? 'bg-primary-500' : 'bg-dark-600'}`}>
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${toggles.automodMaster ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rules.map((rule) => {
          const Icon = rule.icon;
          const isActive = toggles[rule.key as keyof typeof toggles];
          return (
            <div key={rule.key} className="card p-6 border border-dark-600 transition-all hover:border-primary-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon className={isActive ? "text-primary-400" : "text-dark-400"} size={22} />
                  <h3 className="text-lg font-semibold text-white">{rule.title}</h3>
                </div>
                <button onClick={() => toggleHandler(rule.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-primary-600' : 'bg-dark-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <p className="text-sm text-dark-400 mb-4">{rule.desc}</p>
              
              <div className="pt-4 border-t border-dark-700/50">
                <button className="text-sm text-primary-400 hover:text-primary-300">Advanced Settings &rarr;</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AutomodPanel;
