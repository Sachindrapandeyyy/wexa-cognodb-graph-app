import React, { useState } from 'react';
import { 
  GitFork, 
  RotateCcw, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';
import { ChokepointItem, GraphData } from '../types/graph';
import { simulatePatchChokepoint } from '../services/api';

interface ChokepointListProps {
  chokepoints: ChokepointItem[];
  onPatchSimulated: (nodeId: string, updatedGraph?: GraphData) => void;
  onResetGraph: () => void;
}

export const ChokepointList: React.FC<ChokepointListProps> = ({
  chokepoints,
  onPatchSimulated,
  onResetGraph,
}) => {
  const [patchedNodeId, setPatchedNodeId] = useState<string | null>(null);
  const [simulationMsg, setSimulationMsg] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleSimulatePatch = (nodeId: string) => {
    setIsSimulating(true);
    simulatePatchChokepoint(nodeId)
      .then((data) => {
        setPatchedNodeId(nodeId);
        setSimulationMsg(`Successfully severed chokepoint ${nodeId}. Attack paths converging through this node are neutralized.`);
        onPatchSimulated(nodeId, data.graph);
      })
      .catch((err) => console.error('Simulation failed:', err))
      .finally(() => setIsSimulating(false));
  };

  const handleReset = () => {
    setPatchedNodeId(null);
    setSimulationMsg(null);
    onResetGraph();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitFork className="w-4 h-4 text-purple-600" />
            <h3 className="font-extrabold text-base text-slate-900">Critical Chokepoint Remediation Advisor</h3>
          </div>
          <p className="text-xs text-slate-500">
            Identify single points of failure where multiple multi-hop attack vectors converge.
          </p>
        </div>

        {patchedNodeId && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulated Patches</span>
          </button>
        )}
      </div>

      {/* Simulation Feedback Alert */}
      {simulationMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-900">
                Remediation Simulation Active: Patched {patchedNodeId}
              </div>
              <div className="text-xs text-emerald-700 mt-0.5">
                {simulationMsg}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chokepoint Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chokepoints.map((item, index) => {
          const isPatched = patchedNodeId === item.node_id;
          return (
            <div
              key={item.node_id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isPatched
                  ? 'bg-emerald-50/40 border-emerald-300 shadow-sm'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    #{index + 1} {item.name}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 shrink-0">
                    {item.estimated_risk_reduction_pct}% ROI
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                  <span>Type:</span>
                  <span className="font-semibold text-slate-700">{item.labels?.join(', ') || item.type}</span>
                  <span className="text-slate-300">?</span>
                  <span className="text-rose-600 font-semibold">{item.paths_intercepted} paths blocked</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.remediation_recommendation}
                </p>
              </div>

              <button
                onClick={() => handleSimulatePatch(item.node_id)}
                disabled={isPatched || isSimulating}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full text-xs font-semibold transition-all shadow-xs ${
                  isPatched
                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isPatched ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Path Severed & Remediated</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Simulate Patch (Cut Edge)</span>
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
