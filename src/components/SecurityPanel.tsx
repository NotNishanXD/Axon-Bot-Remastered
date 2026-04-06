import React, { useState } from 'react';
import { ShieldAlert, Fingerprint, ShieldBan, MonitorX } from 'lucide-react';

const SecurityPanel: React.FC = () => {
  const [securityLevels, setSecurityLevels] = useState({
    antiNuke: true,
    antiWebhook: true,
    antiBotAdd: true,
    antiPrune: false
  });

  const toggleMode = (key: keyof typeof securityLevels) => {
    setSecurityLevels(s => ({ ...s, [key]: !s[key] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-red-500">Anti-Nuke & Security</h1>
        <p className="text-dark-400 mt-1">Configure extreme server protection parameters.</p>
      </div>

      <div className="card p-6 bg-red-900/10 border border-red-500/20">
        <div className="flex items-center space-x-3 mb-6">
          <ShieldAlert className="text-red-500" size={28} />
          <div>
            <h3 className="text-xl font-bold text-white">Master Override</h3>
            <p className="text-sm text-dark-400">If triggered, prevents all destructive actions regardless of roles.</p>
          </div>
          <div className="flex-1 text-right">
             <button className="btn-danger shadow-lg shadow-red-500/20">Quarantine Server Now</button>
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
