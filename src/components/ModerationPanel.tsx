import React, { useState } from 'react';
import { Gavel, Clock, Lock, Settings } from 'lucide-react';

const ModerationPanel: React.FC = () => {
  const [settings, setSettings] = useState({
    defaultTimeout: '10m',
    deleteMessagesOnBan: true,
    dmOnKickBan: true,
    strictMode: false
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Moderation Configurations</h1>
          <p className="text-dark-400 mt-1">Configure timeouts, kicks, and access rules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Gavel className="text-red-400" size={24} />
            <h3 className="text-lg font-semibold text-white">Punishment Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-white">DM User on Kick/Ban</span>
                <p className="text-xs text-dark-400">Sends reason via DM before punishment</p>
              </div>
              <button onClick={() => setSettings(s => ({...s, dmOnKickBan: !s.dmOnKickBan}))} 
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.dmOnKickBan ? 'bg-primary-600' : 'bg-dark-600'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.dmOnKickBan ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-white">Delete Messages on Ban</span>
                <p className="text-xs text-dark-400">Cleans last 7 days of history</p>
              </div>
              <button onClick={() => setSettings(s => ({...s, deleteMessagesOnBan: !s.deleteMessagesOnBan}))} 
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.deleteMessagesOnBan ? 'bg-primary-600' : 'bg-dark-600'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.deleteMessagesOnBan ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="text-primary-400" size={24} />
            <h3 className="text-lg font-semibold text-white">Timeout Defaults</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Default Timeout Duration</label>
              <select className="w-full bg-dark-700 border border-dark-600 rounded-lg text-white px-3 py-2">
                <option value="1m">1 Minute</option>
                <option value="10m">10 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="1d">1 Day</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Lock className="text-yellow-400" size={24} />
          <h3 className="text-lg font-semibold text-white">Channel Lockdowns</h3>
        </div>
        <p className="text-sm text-dark-400 mb-4">Manage how your channels are locked during raids.</p>
        <button className="btn-secondary">Configure Allowed Roles</button>
      </div>

    </div>
  );
};

export default ModerationPanel;
