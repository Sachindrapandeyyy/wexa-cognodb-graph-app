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
    <header className="sticky top-3 z-40 px-4 sm:px-6 w-full max-w-7xl mx-auto mb-2">
      <div className="bg-white/92 backdrop-blur-md border border-[#863bff]/20 shadow-[0_4px_24px_rgba(134,59,255,0.06)] rounded-full px-5 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold shadow-xs">
            {/* Wexa Logo Spiral Ring Mark */}
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none stroke-white stroke-[1.8]">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="6" strokeDasharray="3 2" />
              <circle cx="12" cy="12" r="3" className="fill-white stroke-none" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-black text-base tracking-tight">WEXA</span>
            <span className="text-[11px] font-bold text-[#7e14ff] bg-[#ede6ff] px-2.5 py-0.5 rounded-full border border-[#863bff]/30">
              AegisGraph
            </span>
          </div>
        </div>

        {/* Center Tab Navigation Pills */}
        <nav className="hidden md:flex items-center bg-[#f8fafc] p-1 rounded-full border border-[#863bff]/15">
          <button
            onClick={() => setActiveTab('topology')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'topology'
                ? 'bg-black text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-black hover:bg-white/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Topology
          </button>

          <button
            onClick={() => setActiveTab('attack-paths')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'attack-paths'
                ? 'bg-[#7e14ff] text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-black hover:bg-white/60'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Attack Paths
          </button>

          <button
            onClick={() => setActiveTab('blast-radius')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'blast-radius'
                ? 'bg-amber-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-black hover:bg-white/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Blast Radius
          </button>

          <button
            onClick={() => setActiveTab('chokepoints')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'chokepoints'
                ? 'bg-[#7e14ff] text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-black hover:bg-white/60'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            Chokepoints
          </button>

          <button
            onClick={() => setActiveTab('cypher')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'cypher'
                ? 'bg-black text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-black hover:bg-white/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            openCypher
          </button>
        </nav>

        {/* Right Actions: CognoDB Cloud Status & Modal Trigger */}
        <div className="flex items-center gap-3">
          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 border-r border-slate-200 pr-3">
            <span><strong className="text-black font-semibold">{nodeCount}</strong> Nodes</span>
            <span>?</span>
            <span><strong className="text-black font-semibold">{edgeCount}</strong> Edges</span>
            <span>?</span>
            <span className="text-rose-600 font-bold">{crownJewelCount} Crown Jewels</span>
          </div>

          {/* Connection Status Button (Wexa style black pill button) */}
          <button
            onClick={onOpenConnectModal}
            className="flex items-center gap-2 bg-black hover:bg-[#1a1a1e] text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer"
            title="Configure CognoDB Cloud connection"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLiveCogno ? 'bg-emerald-400' : 'bg-[#7e14ff]'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isLiveCogno ? 'bg-emerald-400' : 'bg-[#7e14ff]'
              }`}></span>
            </span>
            <span>{isLiveCogno ? 'CognoDB Live' : 'CognoDB Demo'}</span>
            <ArrowRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>

      </div>

      {/* Mobile Submenu Bar */}
      <div className="flex md:hidden items-center justify-around bg-white border border-[#863bff]/20 mt-2 px-2 py-1 rounded-2xl shadow-xs text-xs">
        <button 
          onClick={() => setActiveTab('topology')}
          className={`py-1 px-2.5 rounded-lg ${activeTab === 'topology' ? 'font-bold text-white bg-black' : 'text-slate-600'}`}
        >
          Topology
        </button>
        <button 
          onClick={() => setActiveTab('attack-paths')}
          className={`py-1 px-2.5 rounded-lg ${activeTab === 'attack-paths' ? 'font-bold text-white bg-[#7e14ff]' : 'text-slate-600'}`}
        >
          Attack Paths
        </button>
        <button 
          onClick={() => setActiveTab('blast-radius')}
          className={`py-1 px-2.5 rounded-lg ${activeTab === 'blast-radius' ? 'font-bold text-white bg-amber-600' : 'text-slate-600'}`}
        >
          Blast Radius
        </button>
        <button 
          onClick={() => setActiveTab('chokepoints')}
          className={`py-1 px-2.5 rounded-lg ${activeTab === 'chokepoints' ? 'font-bold text-white bg-[#7e14ff]' : 'text-slate-600'}`}
        >
          Chokepoints
        </button>
        <button 
          onClick={() => setActiveTab('cypher')}
          className={`py-1 px-2.5 rounded-lg ${activeTab === 'cypher' ? 'font-bold text-white bg-black' : 'text-slate-600'}`}
        >
          Cypher
        </button>
      </div>
    </header>
  );
};
