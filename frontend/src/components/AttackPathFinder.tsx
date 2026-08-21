import React, { useState } from 'react';
import { Zap, ShieldAlert, Copy, Check } from 'lucide-react';
import { AttackPathResult, GraphNode } from '../types/graph';

interface AttackPathFinderProps {
  paths: AttackPathResult[];
  nodes: GraphNode[];
  selectedPathId: string | null;
  onSelectPath: (path: AttackPathResult | null) => void;
  onHighlightNodes: (nodeIds: string[], edgeIds: string[]) => void;
  isLoading: boolean;
}

export const AttackPathFinder: React.FC<AttackPathFinderProps> = ({
  paths,
  nodes,
  selectedPathId,
  onSelectPath,
  onHighlightNodes,
  isLoading,
}) => {
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);

  const handleCopyQuery = (id: string, query: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(query);
    setCopiedQueryId(id);
    setTimeout(() => setCopiedQueryId(null), 2000);
  };

  const handleSelectPath = (path: AttackPathResult) => {
    if (selectedPathId === path.path_id) {
      onSelectPath(null);
      onHighlightNodes([], []);
    } else {
      onSelectPath(path);
      const nodeIds = path.nodes.map((n) => n.id);
      const edgeIds = path.edges.map((e) => e.id);
      onHighlightNodes(nodeIds, edgeIds);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cyber-card border border-cyber-cardBorder rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-cyber-cardBorder bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Multi-Hop Attack Path Discovery</h2>
              <p className="text-xs text-slate-400">Traces full exploit chains to Crown Jewels (2+ hops)</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
            {paths.length} Vectors
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-xs">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400 mr-2"></div>
            Analyzing graph traversals...
          </div>
        ) : paths.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No exploit paths detected.
          </div>
        ) : (
          paths.map((path) => {
            const isSelected = selectedPathId === path.path_id;
            return (
              <div
                key={path.path_id}
                onClick={() => handleSelectPath(path)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-950/20 border-red-500/60 shadow-neon-red'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                      {path.hop_count} HOPS
                    </span>
                    <span className="text-xs font-semibold text-slate-200">
                      {path.source_name} <span className="text-slate-500">?</span> {path.target_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-400">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>Risk: {path.threat_score}</span>
                  </div>
                </div>

                <div className="space-y-1.5 my-2.5">
                  {path.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center text-[11px] text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-cyan-400 shrink-0 mr-2">
                        {idx + 1}
                      </div>
                      <div className="flex-1 truncate">
                        <span className="font-medium text-slate-200">{step.node_name}</span>
                        {step.relationship && (
                          <span className="ml-1.5 text-[10px] font-mono text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-500/20">
                            {step.relationship}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-slate-400 truncate max-w-[280px]">
                    <code>{path.cypher_query}</code>
                  </div>
                  <button
                    onClick={(e) => handleCopyQuery(path.path_id, path.cypher_query, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors ml-2"
                    title="Copy Cypher Query"
                  >
                    {copiedQueryId === path.path_id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
