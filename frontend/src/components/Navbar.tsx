import React from 'react';
import { Shield, Database, Zap, AlertTriangle, Radio, Settings, Compass, Flame } from 'lucide-react';
import { ConnectionStatus, GraphStats } from '../types/graph';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  status: ConnectionStatus | null;
  stats?: GraphStats;
  onOpenConnectionModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  status,
  stats,
  onOpenConnectionModal,
}) => {
  const tabs = [
    { id: 'graph', label: 'Topology Map', icon: Compass },
    { id: 'attack-paths', label: 'Attack Paths', icon: Zap },
    { id: 'blast-radius', label: 'Blast Radius', icon: Flame },
    { id: 'chokepoints', label: 'Chokepoint ROI', icon: Shield },
    { id: 'cypher', label: 'Cypher Console', icon: Database },
  ];

  const isConnected = status && status.connected;

  return (
    <header className="border-b border-cyber-cardBorder bg-cyber-darker/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-neon-cyan flex items-center justify-center">
              <div className="h-full w-full bg-cyber-darker rounded-[10px] flex items-center justify-center">
                <Shield className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white">AEGIS<span className="text-cyan-400">GRAPH</span></span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">CognoDB</span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Cloud Security Attack Path & Blast Radius Engine</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Area: Status & Config */}
          <div className="flex items-center gap-3">
            {/* Quick Stat Badges */}
            {stats && (
              <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
                <div className="px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{stats.crown_jewels} Crown Jewels</span>
                </div>
                <div className="px-2 py-1 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3 w-3 text-amber-400" />
                  <span>{stats.chokepoints} Chokepoints</span>
                </div>
              </div>
            )}

            {/* Connection Pill */}
            <button
              onClick={onOpenConnectionModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all ${
                isConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
              }`}
            >
              <Radio className={`h-3.5 w-3.5 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-cyan-400'}`} />
              <span className="hidden sm:inline">
                {isConnected ? 'CognoDB Cloud' : 'Demo Mode (Simulated)'}
              </span>
              <Settings className="h-3.5 w-3.5 text-slate-400 ml-1" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs whitespace-nowrap ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
