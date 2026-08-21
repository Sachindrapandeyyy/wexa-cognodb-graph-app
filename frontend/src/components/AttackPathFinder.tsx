import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ChevronRight, 
  Copy, 
  Check, 
  Terminal, 
  ArrowRight
} from 'lucide-react';
import { AttackPathResult } from '../types/graph';

interface AttackPathFinderProps {
  attackPaths: AttackPathResult[];
  activePathId: string | null;
  onSelectPath: (path: AttackPathResult) => void;
  onClearHighlight: () => void;
}

export const AttackPathFinder: React.FC<AttackPathFinderProps> = ({
  attackPaths,
  activePathId,
  onSelectPath,
  onClearHighlight,
}) => {
  const [copiedQueryId, setCopiedQueryId] = useState<string | null>(null);

  const activePath = attackPaths.find(p => p.path_id === activePathId) || attackPaths[0];

  const handleCopyQuery = (query: string, pathId: string) => {
    navigator.clipboard.writeText(query);
    setCopiedQueryId(pathId);
    setTimeout(() => setCopiedQueryId(null), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Left Sidebar: Attack Path List */}
      <div className="w-full lg:w-80 flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-sm text-slate-900">Discovered Attack Vectors</h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            {attackPaths.length} Active Paths
          </span>
        </div>

        <div className="flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pr-1">
          {attackPaths.map((path) => {
            const isSelected = path.path_id === (activePathId || activePath?.path_id);
            return (
              <div
                key={path.path_id}
                onClick={() => onSelectPath(path)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50/50 border-rose-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {path.source_name}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {path.hop_count} hops
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      path.threat_score >= 85 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      Risk {path.threat_score}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <span className="text-slate-400">Target:</span>
                  <span className="font-medium text-slate-800 truncate">{path.target_name}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-rose-600 font-medium flex items-center gap-1">
                    <span>Inspect traversal</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Detail Panel */}
      {activePath && (
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Multi-Hop Traversal Chain</span>
                <span className="text-xs font-medium text-slate-400">?</span>
                <span className="text-xs font-semibold text-slate-700">{activePath.hop_count} Exploit Hops</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">
                {activePath.source_name} <span className="text-slate-400 font-normal">?</span> {activePath.target_name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyQuery(activePath.cypher_query, activePath.path_id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-all"
              >
                {copiedQueryId === activePath.path_id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Cypher Copied!</span>
                  </>
                ) : (
                  <>
                    <Terminal className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy openCypher</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Execution Progression</h4>
            
            <div className="relative pl-6 flex flex-col gap-4 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {activePath.steps.map((step, index) => (
                <div key={index} className="relative flex flex-col gap-1 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/80">
                  {/* Step Pin */}
                  <div className="absolute -left-[27px] top-3.5 w-4 h-4 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{step.node_name || step.node_id}</span>
                      <span className="text-[11px] text-slate-400">({step.node_label})</span>
                    </div>
                    {step.relationship && (
                      <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                        {step.relationship}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {step.step_description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cypher Block Preview */}
          <div className="mt-auto bg-slate-900 text-slate-100 rounded-2xl p-4 text-xs font-mono overflow-x-auto">
            <div className="flex items-center justify-between text-slate-400 pb-2 mb-2 border-b border-slate-800 text-[11px]">
              <span>openCypher Parameterized Traversal</span>
              <span>Bolt Protocol</span>
            </div>
            <pre className="text-slate-200">{activePath.cypher_query}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
