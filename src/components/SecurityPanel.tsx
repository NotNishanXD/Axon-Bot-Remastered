import React, { useState, useEffect } from 'react';
import { ShieldAlert, Fingerprint, ShieldBan, MonitorX } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api'; // Update with your bot's IP/URL
const API_KEY = 'axon_secret_key_123';
const DEFAULT_GUILD_ID = '1234567890'; // Replace with your actual guild ID

const SecurityPanel: React.FC = () => {
  const [guildId, setGuildId] = useState(DEFAULT_GUILD_ID);
  const [securityLevels, setSecurityLevels] = useState({
    antiNuke: false,
    antiWebhook: true,
    antiBotAdd: true,
    antiPrune: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [guildId]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/settings/${guildId}`, {
        headers: { 'X-API-Key': API_KEY }
      });
      const data = await response.json();
      if (data && !data.error) {
        setSecurityLevels(s => ({ ...s, antiNuke: !!data.antinuke }));
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
    setIsLoading(false);
  };

  const toggleMode = async (key: keyof typeof securityLevels) => {
    const newValue = !securityLevels[key];
    setSecurityLevels(s => ({ ...s, [key]: newValue }));

    if (key === 'antiNuke') {
      try {
        await fetch(`${API_BASE_URL}/settings/${guildId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
          },
          body: JSON.stringify({ antinuke: newValue })
        });
      } catch (error) {
        console.error('Failed to update settings:', error);
        // Revert on failure
        setSecurityLevels(s => ({ ...s, [key]: !newValue }));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-red-500">Anti-Nuke & Security</h1>
          <p className="text-dark-400 mt-1">Configure extreme server protection parameters.</p>
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

      <div className="card p-6 bg-red-900/10 border border-red-500/20">
        <div className="flex items-center space-x-3 mb-6">
          <ShieldAlert className="text-red-500" size={28} />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">Master Anti-Nuke</h3>
            <p className="text-sm text-dark-400">Main toggle for the Anti-Nuke system protection modules.</p>
          </div>
          <div className="flex items-center space-x-4">
             {isLoading && <span className="text-xs text-red-500 animate-pulse">Syncing...</span>}
             <button onClick={() => toggleMode('antiNuke')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${securityLevels.antiNuke ? 'bg-red-500' : 'bg-dark-600'}`}>
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${securityLevels.antiNuke ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between mb-4">
             <div className="flex space-x-3 items-center">
               <ShieldBan className="text-orange-400" />
               <h3 className="font-semibold text-white">Anti-Bot Add</h3>
             </div>
             <button onClick={() => toggleMode('antiBotAdd')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${securityLevels.antiBotAdd ? 'bg-orange-500' : 'bg-dark-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securityLevels.antiBotAdd ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <p className="text-sm text-dark-300">Instantly kicks any unrecognized bot invited to the server.</p>
        </div>

        <div className="card p-6 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between mb-4">
             <div className="flex space-x-3 items-center">
               <Fingerprint className="text-orange-400" />
               <h3 className="font-semibold text-white">Anti-Webhook</h3>
             </div>
             <button onClick={() => toggleMode('antiWebhook')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${securityLevels.antiWebhook ? 'bg-orange-500' : 'bg-dark-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securityLevels.antiWebhook ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <p className="text-sm text-dark-300">Blocks creation/deletion of webhooks to prevent ghost ping raids.</p>
        </div>

        <div className="card p-6 border-l-4 border-l-orange-500 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
             <div className="flex space-x-3 items-center">
               <MonitorX className="text-orange-400" />
               <h3 className="font-semibold text-white">Anti-Mass Prune & Ban</h3>
             </div>
             <button onClick={() => toggleMode('antiPrune')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${securityLevels.antiPrune ? 'bg-orange-500' : 'bg-dark-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securityLevels.antiPrune ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <p className="text-sm text-dark-300">Revokes permissions from any admin who kicks/bans more than 3 users in 1 minute.</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityPanel;
