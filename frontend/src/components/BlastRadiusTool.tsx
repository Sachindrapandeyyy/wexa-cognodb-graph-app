import React, { useState, useEffect } from 'react';
import { Flame, AlertTriangle, Database } from 'lucide-react';
import { BlastRadiusResult, GraphNode } from '../types/graph';
import { fetchBlastRadius } from '../services/api';

interface BlastRadiusToolProps {
  nodes: GraphNode[];
  onHighlightNodes: (nodeIds: string[], edgeIds: string[]) => void;
}

export const BlastRadiusTool: React.FC<BlastRadiusToolProps> = ({ nodes, onHighlightNodes }) => {
  const [selectedOriginId, setSelectedOriginId] = useState<string>('iam-role-cross-account-db');
  const [maxHops, setMaxHops] = useState<number>(3);
  const [blastResult, setBlastResult] = useState<BlastRadiusResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedOriginId) return;
    setIsLoading(true);
    fetchBlastRadius(selectedOriginId, maxHops)
      .then((res) => {
        setBlastResult(res);
        const allNodeIds = res.graph.nodes.map((n) => n.id);
        const allEdgeIds = res.graph.edges.map((e) => e.id);
        onHighlightNodes(allNodeIds, allEdgeIds);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [selectedOriginId, maxHops]);

  const candidateNodes = nodes.filter(
    (n) => n.labels.includes('Identity') || n.labels.includes('Compute') || n.labels.includes('Secret')
  );

  return (
    <div className="flex flex-col h-full bg-cyber-card border border-cyber-cardBorder rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-cyber-cardBorder bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">IAM & Asset Blast Radius Simulator</h2>
            <p className="text-xs text-slate-400">Simulate transitive compromise cascade across infrastructure</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">COMPROMISED ORIGIN</label>
            <select
              value={selectedOriginId}
              onChange={(e) => setSelectedOriginId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {candidateNodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.properties.name || n.id} ({n.labels[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-mono text-slate-400">CASCADE DEPTH</label>
              <span className="text-xs font-mono text-cyan-400 font-bold">{maxHops} Hops</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              value={maxHops}
              onChange={(e) => setMaxHops(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-xs">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-400 mr-2"></div>
            Simulating compromise blast wave...
          </div>
        ) : blastResult ? (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400">TOTAL IMPACTED ASSETS</span>
                <div className="text-xl font-black text-amber-400 mt-1">
                  {blastResult.total_impacted_assets} <span className="text-xs font-normal text-slate-400">nodes</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30">
                <span className="text-[10px] font-mono text-red-300">THREATENED CROWN JEWELS</span>
                <div className="text-xl font-black text-red-400 mt-1">
                  {blastResult.threatened_crown_jewels.length} <span className="text-xs font-normal text-slate-400">critical</span>
                </div>
              </div>
            </div>

            {blastResult.threatened_crown_jewels.length > 0 && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>CRITICAL DATA COMPROMISED</span>
                </div>
                <div className="space-y-1.5">
                  {blastResult.threatened_crown_jewels.map((cj) => (
                    <div key={cj.id} className="text-[11px] font-medium text-slate-200 flex items-center gap-2">
                      <Database className="h-3.5 w-3.5 text-red-400 shrink-0" />
                      <span className="truncate">{cj.properties.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-900/60 text-red-300 ml-auto shrink-0">
                        {cj.properties.classification}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Cascade Neighborhood Tiers
              </h3>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-slate-200">Tier 1 ? Direct Compromise (1-Hop)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {blastResult.compromise_tier_1.length} Assets
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {blastResult.compromise_tier_1.map((n) => n.properties.name).join(', ') || 'None'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-slate-200">Tier 2 ? Transitive Privilege (2-Hops)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                    {blastResult.compromise_tier_2.length} Assets
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {blastResult.compromise_tier_2.map((n) => n.properties.name).join(', ') || 'None'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold text-slate-200">Tier 3 ? Cascade Exfiltration (3-Hops)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                    {blastResult.compromise_tier_3.length} Assets
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {blastResult.compromise_tier_3.map((n) => n.properties.name).join(', ') || 'None'}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
