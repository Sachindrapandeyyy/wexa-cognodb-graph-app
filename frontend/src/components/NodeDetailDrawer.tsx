import React from 'react';
import { X, ShieldAlert, Sparkles, GitFork } from 'lucide-react';
import { GraphNode } from '../types/graph';

interface NodeDetailDrawerProps {
  node: GraphNode | null;
  onClose: () => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({ node, onClose }) => {
  if (!node) return null;

  const name = node.properties?.name || node.label || node.id;
  const isCrownJewel = node.properties?.is_crown_jewel;
  const isChokepoint = node.properties?.is_chokepoint;
  const isInternetFacing = node.properties?.is_internet_facing;
  const riskScore = node.properties?.risk_score || 50;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200 shadow-2xl p-6 flex flex-col gap-6 overflow-y-auto animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">
            Node Inspector
          </span>
          <h2 className="text-base font-extrabold text-slate-900 mt-0.5 break-words">
            {name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Badges & Tags */}
      <div className="flex flex-wrap gap-1.5">
        {(node.labels || [node.label]).map((lbl) => (
          <span key={lbl} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            {lbl}
          </span>
        ))}
        {isCrownJewel && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Crown Jewel
          </span>
        )}
        {isChokepoint && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            Critical Chokepoint
          </span>
        )}
        {isInternetFacing && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Publicly Exposed
          </span>
        )}
      </div>

      {/* Risk Score Meter */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Calculated Risk Metric</span>
          <span className={`font-bold ${riskScore >= 80 ? 'text-rose-600' : 'text-amber-600'}`}>
            {riskScore} / 100
          </span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              riskScore >= 80 ? 'bg-rose-500' : riskScore >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      {/* Attributes & Properties Table */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Security Attributes</h4>
        <div className="bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
          <div className="p-3 flex justify-between gap-2">
            <span className="text-slate-500 font-medium">Node ID</span>
            <span className="font-mono text-slate-900 font-medium">{node.id}</span>
          </div>
          {Object.entries(node.properties || {}).map(([k, v]) => (
            <div key={k} className="p-3 flex justify-between gap-2">
              <span className="text-slate-500 font-medium">{k}</span>
              <span className="font-mono text-slate-900 font-medium text-right max-w-[200px] truncate" title={String(v)}>
                {String(v)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
