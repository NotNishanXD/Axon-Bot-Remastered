import React, { useState } from 'react';
import { Gamepad2, PlaySquare, Trophy, AlignCenterHorizontal } from 'lucide-react';

const GamesPanel: React.FC = () => {
  const [games, setGames] = useState([
    { id: 1, name: 'Battleship', enabled: true },
    { id: 2, name: 'Chess', enabled: false },
    { id: 3, name: 'Connect Four', enabled: true },
    { id: 4, name: 'Tic-Tac-Toe', enabled: true },
    { id: 5, name: '2048', enabled: true },
    { id: 6, name: 'Wordle', enabled: true },
    { id: 7, name: 'TypeRacer', enabled: false },
  ]);

  const toggleGame = (id: number) => {
    setGames(games.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Mini-Games Ecosystem</h1>
        <p className="text-dark-400 mt-1">Enable or disable interactive games inside the bot.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-primary-900/40 to-dark-800 md:col-span-2">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="text-yellow-400" size={24} />
            <h3 className="text-xl font-bold text-white">Active Games</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {games.map(g => (
                <div key={g.id} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                  <span className="font-medium text-white">{g.name}</span>
                  <button onClick={() => toggleGame(g.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${g.enabled ? 'bg-green-500' : 'bg-dark-600'}`}>
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${g.enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
             ))}
          </div>
        </div>

        <div className="card p-6 border-primary-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
          <div className="flex items-center space-x-3 mb-4">
            <Gamepad2 className="text-primary-400" size={24} />
            <h3 className="text-lg font-bold text-white">Economy Link</h3>
          </div>
          <p className="text-sm text-dark-400 mb-4">Link game victories to the bot's global economy system to reward players.</p>
          <button className="btn-primary w-full shadow-lg shadow-primary-500/20">Enable Economy Integration</button>
        </div>
      </div>
    </div>
  );
};

export default GamesPanel;
