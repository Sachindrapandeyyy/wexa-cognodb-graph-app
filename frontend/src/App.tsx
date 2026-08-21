import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GraphCanvas } from './components/GraphCanvas';
import { AttackPathFinder } from './components/AttackPathFinder';
import { BlastRadiusTool } from './components/BlastRadiusTool';
import { ChokepointList } from './components/ChokepointList';
import { CypherConsole } from './components/CypherConsole';
import { NodeDetailDrawer } from './components/NodeDetailDrawer';
import { ConnectionModal } from './components/ConnectionModal';

import { GraphData, GraphNode, AttackPathResult, ChokepointItem, ConnectionStatus } from './types/graph';
import { fetchFullGraph, fetchAttackPaths, fetchChokepoints, fetchHealth } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('graph');
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [attackPaths, setAttackPaths] = useState<AttackPathResult[]>([]);
  const [chokepoints, setChokepoints] = useState<ChokepointItem[]>([]);
  const [healthStatus, setHealthStatus] = useState<ConnectionStatus | null>(null);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [highlightedEdgeIds, setHighlightedEdgeIds] = useState<string[]>([]);
  const [patchedNodeId, setPatchedNodeId] = useState<string | null>(null);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [g, ap, cp, h] = await Promise.all([
        fetchFullGraph(),
        fetchAttackPaths(),
        fetchChokepoints(),
        fetchHealth(),
      ]);
      setGraphData(g);
      setAttackPaths(ap);
      setChokepoints(cp);
      setHealthStatus(h);
    } catch (e) {
      console.error('Data loading error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleHighlightNodes = (nodeIds: string[], edgeIds: string[]) => {
    setHighlightedNodeIds(nodeIds);
    setHighlightedEdgeIds(edgeIds);
  };

  const handlePatchSimulated = (nodeId: string, updatedGraph: GraphData | null) => {
    setPatchedNodeId(nodeId || null);
    if (updatedGraph) {
      setGraphData(updatedGraph);
    } else {
      fetchFullGraph().then((g) => setGraphData(g));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-darker text-slate-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'graph') {
            setHighlightedNodeIds([]);
            setHighlightedEdgeIds([]);
            setSelectedPathId(null);
          }
        }}
        status={healthStatus}
        stats={graphData.stats}
        onOpenConnectionModal={() => setIsConnectionModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-4">
        {activeTab === 'cypher' ? (
          <div className="h-[calc(100vh-140px)]">
            <CypherConsole />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-140px)] min-h-[600px]">
            <div className="lg:col-span-5 h-full overflow-hidden flex flex-col">
              {activeTab === 'attack-paths' && (
                <AttackPathFinder
                  paths={attackPaths}
                  nodes={graphData.nodes}
                  selectedPathId={selectedPathId}
                  onSelectPath={(p) => setSelectedPathId(p ? p.path_id : null)}
                  onHighlightNodes={handleHighlightNodes}
                  isLoading={isLoading}
                />
              )}

              {activeTab === 'blast-radius' && (
                <BlastRadiusTool nodes={graphData.nodes} onHighlightNodes={handleHighlightNodes} />
              )}

              {activeTab === 'chokepoints' && (
                <ChokepointList
                  chokepoints={chokepoints}
                  onPatchSimulated={handlePatchSimulated}
                  patchedNodeId={patchedNodeId}
                />
              )}

              {activeTab === 'graph' && (
                <div className="p-5 rounded-2xl bg-cyber-card border border-cyber-cardBorder flex flex-col gap-4 h-full">
                  <div className="space-y-2">
                    <h2 className="text-base font-bold text-white">Cloud Infrastructure Topology</h2>
                    <p className="text-xs text-slate-400">
                      Explore full multi-account attack graph with IAM policies, CVEs, EC2/EKS instances, and Crown Jewel databases.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 text-[10px]">TOTAL NODES</span>
                      <div className="text-lg font-bold text-cyan-400">{graphData.nodes.length}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 text-[10px]">RELATIONSHIPS</span>
                      <div className="text-lg font-bold text-blue-400">{graphData.edges.length}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 text-[10px]">CROWN JEWELS</span>
                      <div className="text-lg font-bold text-emerald-400">{graphData.stats?.crown_jewels || 2}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 text-[10px]">CHOKEPOINTS</span>
                      <div className="text-lg font-bold text-amber-400">{graphData.stats?.chokepoints || 2}</div>
                    </div>
                  </div>

                  <div className="mt-auto p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300">
                    <span className="text-cyan-400 font-bold block mb-1">Quick Tip</span>
                    Click on any node to open the deep metadata inspector drawer or switch to the <strong>Attack Paths</strong> tab to discover multi-hop exploit vectors.
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 h-full">
              <GraphCanvas
                graphData={graphData}
                onSelectNode={(node) => setSelectedNode(node)}
                selectedNodeId={selectedNode?.id}
                highlightedNodeIds={highlightedNodeIds}
                highlightedEdgeIds={highlightedEdgeIds}
              />
            </div>
          </div>
        )}
      </main>

      <NodeDetailDrawer node={selectedNode} onClose={() => setSelectedNode(null)} />

      <ConnectionModal
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        status={healthStatus}
        onRefreshHealth={loadData}
      />
    </div>
  );
};
