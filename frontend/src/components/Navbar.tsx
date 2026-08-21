import React from 'react';
import { 
  ShieldAlert, 
  Database, 
  GitFork, 
  Flame, 
  Terminal, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import { ConnectionStatus } from '../types/graph';

interface NavbarProps {
  activeTab: 'topology' | 'attack-paths' | 'blast-radius' | 'chokepoints' | 'cypher';
  setActiveTab: (tab: 'topology' | 'attack-paths' | 'blast-radius' | 'chokepoints' | 'cypher') => void;
  connectionStatus: ConnectionStatus | null;
  onOpenConnectModal: () => void;
  nodeCount: number;
  edgeCount: number;
  crownJewelCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  connectionStatus,
  onOpenConnectModal,
  nodeCount,
  edgeCount,
  crownJewelCount,
}) => {
  const isLiveCogno = connectionStatus?.connected && !connectionStatus?.is_mock_fallback;

  return (
    <header className="sticky top-3 z-40 px-4 sm:px-6 w-full max-w-7xl mx-auto mb-4">
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white stroke-2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v18M3 12h18" strokeDasharray="2 2" />
              <circle cx="12" cy="12" r="4" className="fill-white" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">WEXA</span>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                AegisGraph
              </span>
            </div>
          </div>
        </div>

        {/* Center Tab Navigation Pills */}
        <nav className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-full border border-slate-200/60">
          <button
            onClick={() => setActiveTab('topology')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'topology'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Topology
          </button>

          <button
            onClick={() => setActiveTab('attack-paths')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'attack-paths'
                ? 'bg-white text-rose-600 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Attack Paths
          </button>

          <button
            onClick={() => setActiveTab('blast-radius')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'blast-radius'
                ? 'bg-white text-amber-600 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Blast Radius
          </button>

          <button
            onClick={() => setActiveTab('chokepoints')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'chokepoints'
                ? 'bg-white text-purple-600 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            Chokepoints
          </button>

          <button
            onClick={() => setActiveTab('cypher')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'cypher'
                ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Cypher Console
          </button>
        </nav>

        {/* Right Actions: CognoDB Cloud Status & Modal Trigger */}
        <div className="flex items-center gap-2.5">
          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 border-r border-slate-200 pr-3">
            <span><strong className="text-slate-900">{nodeCount}</strong> Nodes</span>
            <span>-</span>
            <span><strong className="text-slate-900">{edgeCount}</strong> Edges</span>
            <span>-</span>
            <span className="text-rose-600 font-semibold">{crownJewelCount} Crown Jewels</span>
          </div>

          {/* Connection Status Button (Wexa style black pill button) */}
          <button
            onClick={onOpenConnectModal}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-full text-xs font-medium shadow-sm transition-all"
            title="Configure CognoDB Cloud connection"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLiveCogno ? 'bg-emerald-400' : 'bg-amber-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isLiveCogno ? 'bg-emerald-400' : 'bg-amber-400'
              }`}></span>
            </span>
            <span>{isLiveCogno ? 'CognoDB Live' : 'CognoDB Demo'}</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>

      </div>

      {/* Mobile Submenu Bar */}
      <div className="flex md:hidden items-center justify-around bg-white border border-slate-200 mt-2 px-2 py-1 rounded-2xl shadow-sm text-xs">
        <button 
          onClick={() => setActiveTab('topology')}
          className={`py-1 px-2.5 rounded-lg ${activeTab === 'topology' ? 'font-bold text-slate-900 bg-slate-100' : 'text-slate-600'}`}
        >
          Topology
        </button>
        <button 
          onClick={() => setActiveTab('attack-paths')}
          className={`py-1 px-2.5 rounded-lg ${activeTab === 'attack-paths' ? 'font-bold text-rose-600 bg-rose-50' : 'text-slate-600'}`}
        >
          Attack Paths
        </button>
        <button 
          onClick={() => setActiveTab('blast-radius')}
          className={`py-1 px-2.5 rounded-lg ${activeTab === 'blast-radius' ? 'font-bold text-amber-600 bg-amber-50' : 'text-slate-600'}`}
        >
          Blast Radius
        </button>
        <button 
          onClick={() => setActiveTab('chokepoints')}
          className={`py-1 px-2.5 rounded-lg ${activeTab === 'chokepoints' ? 'font-bold text-purple-600 bg-purple-50' : 'text-slate-600'}`}
        >
          Chokepoints
        </button>
        <button 
          onClick={() => setActiveTab('cypher')}
          className={`py-1 px-2.5 rounded-lg ${activeTab === 'cypher' ? 'font-bold text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}
        >
          Cypher
        </button>
      </div>
    </header>
  );
};
