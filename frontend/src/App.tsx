import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Layers, 
  Flame, 
  GitFork, 
  Terminal, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { GraphData, GraphNode, AttackPathResult, ConnectionStatus, ChokepointItem } from './types/graph';
import { fetchFullGraph, fetchAttackPaths, fetchChokepoints, fetchHealth } from './services/api';
import { Navbar } from './components/Navbar';
import { GraphCanvas } from './components/GraphCanvas';
import { AttackPathFinder } from './components/AttackPathFinder';
import { BlastRadiusTool } from './components/BlastRadiusTool';
import { ChokepointList } from './components/ChokepointList';
import { CypherConsole } from './components/CypherConsole';
import { NodeDetailDrawer } from './components/NodeDetailDrawer';
import { ConnectionModal } from './components/ConnectionModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'topology' | 'attack-paths' | 'blast-radius' | 'chokepoints' | 'cypher'>('topology');
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [], stats: { total_nodes: 0, total_edges: 0, crown_jewels: 0, chokepoints: 0, vulnerabilities: 0 } });
  const [attackPaths, setAttackPaths] = useState<AttackPathResult[]>([]);
  const [chokepoints, setChokepoints] = useState<ChokepointItem[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightPathNodeIds, setHighlightPathNodeIds] = useState<string[]>([]);
  const [highlightPathEdgeIds, setHighlightPathEdgeIds] = useState<string[]>([]);
  const [activePathId, setActivePathId] = useState<string | null>(null);
  
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial graph, paths, chokepoints & health
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [gData, aPaths, cPoints, health] = await Promise.all([
        fetchFullGraph(),
        fetchAttackPaths(undefined, undefined, 5),
        fetchChokepoints(),
        fetchHealth(),
      ]);

      setGraphData(gData);
      setAttackPaths(aPaths);
      setChokepoints(cPoints);
      setConnectionStatus(health);
    } catch (err) {
      console.error('Failed to load initial graph data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectAttackPath = (path: AttackPathResult) => {
    setActivePathId(path.path_id);
    const nodeIds = (path.steps || []).map(s => s.node_id);
    setHighlightPathNodeIds([...new Set(nodeIds)]);
  };

  const handleHighlightBlastRadius = (nodeIds: string[]) => {
    setHighlightPathNodeIds(nodeIds);
  };

  const handlePatchSimulated = (nodeId: string, updatedGraph?: GraphData) => {
    if (updatedGraph) {
      setGraphData(updatedGraph);
    }
    // Refresh chokepoints and attack paths
    Promise.all([fetchAttackPaths(undefined, undefined, 5), fetchChokepoints()]).then(([aPaths, cPoints]) => {
      setAttackPaths(aPaths);
      setChokepoints(cPoints);
    });
  };

  const handleResetGraph = () => {
    loadData();
    setHighlightPathNodeIds([]);
    setActivePathId(null);
  };

  const crownJewelsCount = (graphData.nodes || []).filter(n => n.properties?.is_crown_jewel).length;

  return (
    <div className="min-h-screen bg-white wexa-hero-bg flex flex-col text-[#09090b] selection:bg-[#ede6ff] selection:text-[#7e14ff] pb-20">
      
      {/* Top Floating Navbar (Wexa style) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        connectionStatus={connectionStatus}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        nodeCount={graphData.nodes?.length || 0}
        edgeCount={graphData.edges?.length || 0}
        crownJewelCount={crownJewelsCount}
      />

      {/* Hero Section with Iconic Wexa Waves & Typography */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-8 flex flex-col items-center text-center overflow-hidden">
        
        {/* Background Decorative Sinusoidal SVG Waves (Signature Wexa visual) */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center opacity-40">
          <svg viewBox="0 0 1200 300" className="w-full h-full text-[#863bff]/20">
            <path
              d="M0,150 C300,50 600,250 900,100 C1050,25 1150,200 1200,150"
              fill="none"
              stroke="rgba(134, 59, 255, 0.35)"
              strokeWidth="1.5"
            />
            <path
              d="M0,160 C280,70 620,230 880,110 C1030,40 1140,180 1200,160"
              fill="none"
              stroke="rgba(134, 59, 255, 0.25)"
              strokeWidth="1"
            />
            <path
              d="M0,140 C320,30 580,270 920,90 C1070,10 1160,220 1200,140"
              fill="none"
              stroke="rgba(134, 59, 255, 0.18)"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Top Feature Pill (Wexa Style) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ede6ff] border border-[#863bff]/30 text-[#7e14ff] text-xs font-bold mb-5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by CognoDB Managed Graph Cloud</span>
          <ArrowRight className="w-3 h-3 text-[#7e14ff]" />
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-tight text-black max-w-4xl leading-[1.1] mb-5">
          The World's Fastest <br className="hidden sm:inline" />
          <span>Cloud Attack Graph</span> Platform
        </h1>

        {/* Hero Subheading with Purple Accent */}
        <p className="text-sm sm:text-base text-slate-700 max-w-2xl leading-relaxed mb-7 font-normal">
          AegisGraph gives security teams live, authorized graph intelligence to cut compromise discovery time by{' '}
          <strong className="text-[#7e14ff] font-extrabold text-base">98.7%</strong>, uncover multi-hop attack vectors, 
          and govern IAM blast radiuses before production breach.
        </p>

        {/* Quick Action CTAs (Pitch Black & Crisp White Pills) */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <button
            onClick={() => setActiveTab('attack-paths')}
            className="flex items-center gap-2.5 bg-black hover:bg-[#1a1a1e] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all cursor-pointer"
          >
            <span>Explore Attack Paths</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          <button
            onClick={() => setActiveTab('chokepoints')}
            className="flex items-center gap-2 bg-white hover:bg-[#f6f1ff] border border-[#863bff]/25 text-black font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-xs transition-all cursor-pointer"
          >
            <span>Simulate Chokepoint Patch</span>
            <ArrowRight className="w-4 h-4 text-[#7e14ff]" />
          </button>
        </div>
      </section>

      {/* Main Workspace Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
        
        {/* Force-Directed Canvas */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#7e14ff]" />
              <span className="text-xs font-bold uppercase tracking-wider text-black">Interactive Topology Graph</span>
            </div>
            {highlightPathNodeIds.length > 0 && (
              <button
                onClick={() => { setHighlightPathNodeIds([]); setActivePathId(null); }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Clear Highlights
              </button>
            )}
          </div>

          <GraphCanvas
            graphData={graphData}
            selectedNodeId={selectedNode?.id || null}
            onSelectNode={setSelectedNode}
            highlightPathNodeIds={highlightPathNodeIds}
            highlightPathEdgeIds={highlightPathEdgeIds}
            isLoading={isLoading}
          />
        </section>

        {/* Active Tab Functional Panels */}
        <section className="mt-2">
          {activeTab === 'attack-paths' && (
            <AttackPathFinder
              attackPaths={attackPaths}
              activePathId={activePathId}
              onSelectPath={handleSelectAttackPath}
              onClearHighlight={() => { setHighlightPathNodeIds([]); setActivePathId(null); }}
            />
          )}

          {activeTab === 'blast-radius' && (
            <BlastRadiusTool
              nodes={graphData.nodes || []}
              onHighlightBlastRadius={handleHighlightBlastRadius}
            />
          )}

          {activeTab === 'chokepoints' && (
            <ChokepointList
              chokepoints={chokepoints}
              onPatchSimulated={handlePatchSimulated}
              onResetGraph={handleResetGraph}
            />
          )}

          {activeTab === 'cypher' && (
            <CypherConsole />
          )}
        </section>

      </main>

      {/* Node Detail Inspector Drawer */}
      <NodeDetailDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />

      {/* CognoDB Connection Modal */}
      <ConnectionModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        connectionStatus={connectionStatus}
        onConnectionUpdated={loadData}
      />

    </div>
  );
};
