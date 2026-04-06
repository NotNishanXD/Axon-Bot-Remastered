import React, { useState } from 'react';
import { Filter, MessageSquare, Link, Type } from 'lucide-react';

const AutomodPanel: React.FC = () => {
  const [toggles, setToggles] = useState({
    antiSpam: true,
    antiCaps: false,
    antiLink: true,
    antiInvite: true,
    antiMassMention: true,
    antiEmojiSpam: false
  });

  const toggleHandler = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
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
      <div>
        <h1 className="text-3xl font-bold text-white">Auto Mod Configuration</h1>
        <p className="text-dark-400 mt-1">Fine-tune automated filtering and rules.</p>
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
