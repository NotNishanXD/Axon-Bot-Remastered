import React from 'react';
import { 
  BarChart3, 
  Settings, 
  Activity, 
  FileText, 
  Shield,
  Menu,
  X,
  Gavel,
  Filter,
  Gamepad2,
  Lock,
  Coins
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'management', label: 'Management', icon: Shield },
    { id: 'moderation', label: 'Moderation', icon: Gavel },
    { id: 'automod', label: 'Auto Moderation', icon: Filter },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'security', label: 'Anti-Nuke', icon: Lock },
    { id: 'economy', label: 'Economy', icon: Coins },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-30 w-64 bg-dark-800 border-r border-dark-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AX</span>
            </div>
            <h1 className="text-xl font-bold text-white">Axon X</h1>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-dark-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={clsx(
                      "w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200",
                      activeTab === item.id
                        ? "bg-primary-600 text-white shadow-lg"
                        : "text-dark-300 hover:bg-dark-700 hover:text-white"
                    )}
                  >
                    <Icon size={20} className="mr-3" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">QX</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Quantum X Dev</p>
              <p className="text-xs text-dark-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;