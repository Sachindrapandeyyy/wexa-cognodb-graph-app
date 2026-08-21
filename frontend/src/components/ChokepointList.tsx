import React, { useState } from 'react';
import { Shield, CheckCircle2, RotateCcw, TrendingDown } from 'lucide-react';
import { ChokepointItem, GraphData } from '../types/graph';
import { simulatePatchChokepoint } from '../services/api';

interface ChokepointListProps {
  chokepoints: ChokepointItem[];
  onPatchSimulated: (nodeId: string, updatedGraph: GraphData | null) => void;
  patchedNodeId: string | null;
}

export const ChokepointList: React.FC<ChokepointListProps> = ({
  chokepoints,
  onPatchSimulated,
  patchedNodeId,
}) => {
  const [loadingNodeId, setLoadingNodeId] = useState<string | null>(null);

  const handleTogglePatch = async (item: ChokepointItem) => {
    if (patchedNodeId === item.node_id) {
      onPatchSimulated('', null);
      return;
    }

    setLoadingNodeId(item.node_id);
    try {
      const res = await simulatePatchChokepoint(item.node_id);
      onPatchSimulated(item.node_id, res.graph);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNodeId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cyber-card border border-cyber-cardBorder rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-cyber-cardBorder bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Chokepoint Remediation Advisor</h2>
            <p className="text-xs text-slate-400">Single points of failure where multiple attack chains converge</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chokepoints.map((item) => {
          const isPatched = patchedNodeId === item.node_id;
          const isLoading = loadingNodeId === item.node_id;

          return (
            <div
              key={item.node_id}
              className={`p-3.5 rounded-xl border transition-all ${
                isPatched
                  ? 'bg-emerald-950/20 border-emerald-500/50 shadow-neon-green'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                    <span>
                      Intercepts: <strong className="text-amber-400 font-mono">{item.paths_intercepted} paths</strong>
                    </span>
                    <span>
                      Threatened: <strong className="text-red-400 font-mono">{item.threatened_targets} Crown Jewels</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-bold bg-emerald-950/50 px-2 py-1 rounded border border-emerald-800/60 shrink-0">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>-{item.estimated_risk_reduction_pct}% Risk</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300 mb-3">
                <span className="text-cyan-400 font-semibold">Recommended Fix: </span>
                {item.remediation_recommendation}
              </div>

              <button
                onClick={() => handleTogglePatch(item)}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold font-mono transition-all ${
                  isPatched
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-neon-cyan'
                }`}
              >
                {isLoading ? (
                  <span>Recalculating attack paths...</span>
                ) : isPatched ? (
                  <>
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Reset Simulation (Restore Asset)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Simulate Remediation (Sever Paths)</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
