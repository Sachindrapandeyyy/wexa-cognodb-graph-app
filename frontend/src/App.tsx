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
    <div className="min-h-screen bg-[#fafafa] flex flex-col text-slate-900 selection:bg-purple-100 selection:text-purple-900 pb-16">
      
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

      {/* Hero Section (Wexa AI Typography Style) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-6 flex flex-col items-center text-center">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 text-xs font-semibold mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by CognoDB Managed Graph Cloud</span>
          <ArrowRight className="w-3 h-3 text-purple-400" />
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 max-w-4xl leading-[1.15] mb-4">
          The World's Fastest <br className="hidden sm:inline" />
          <span className="text-slate-950">Cloud Attack Graph</span> Platform
        </h1>

        {/* Hero Subheading */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed mb-6">
          AegisGraph traverses multi-cloud IAM permissions, container escapes, and KMS trust chains to illuminate 
          <strong className="text-slate-900 font-semibold"> multi-hop attack vectors </strong> 
          and calculate blast radius in milliseconds over openCypher.
        </p>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('attack-paths')}
            className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-sm transition-all cursor-pointer"
          >
            <span>Explore Attack Paths</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => setActiveTab('chokepoints')}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-xs transition-all cursor-pointer"
          >
            <span>Simulate Chokepoint Patch</span>
          </button>
        </div>
      </section>

      {/* Main Workspace Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
        
        {/* Force-Directed Canvas */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Interactive Topology Graph</span>
            </div>
            {highlightPathNodeIds.length > 0 && (
              <button
                onClick={() => { setHighlightPathNodeIds([]); setActivePathId(null); }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
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
