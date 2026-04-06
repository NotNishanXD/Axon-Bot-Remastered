import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Management from './components/Management';
import Logs from './components/Logs';
import Settings from './components/Settings';
import ModerationPanel from './components/ModerationPanel';
import AutomodPanel from './components/AutomodPanel';
import GamesPanel from './components/GamesPanel';
import SecurityPanel from './components/SecurityPanel';
import EconomyPanel from './components/EconomyPanel';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'management':
        return <Management />;
      case 'logs':
        return <Logs />;
      case 'moderation':
        return <ModerationPanel />;
      case 'automod':
        return <AutomodPanel />;
      case 'games':
        return <GamesPanel />;
      case 'security':
        return <SecurityPanel />;
      case 'economy':
        return <EconomyPanel />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-dark-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-900 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;