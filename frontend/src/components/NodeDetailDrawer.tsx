import React from 'react';
import { X } from 'lucide-react';
import { GraphNode } from '../types/graph';

interface NodeDetailDrawerProps {
  node: GraphNode | null;
  onClose: () => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({ node, onClose }) => {
  if (!node) return null;

  const props = node.properties;
  const primaryLabel = node.labels[0] || 'Asset';

  return (
    <div className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-cyber-darker/95 backdrop-blur-xl border-l border-slate-800 p-5 shadow-2xl z-50 overflow-y-auto flex flex-col gap-4 animate-in slide-in-from-right duration-200">
      <div className="flex items-start justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              {primaryLabel}
            </span>
            {props.is_crown_jewel && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                ?? CROWN JEWEL
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-white mt-1.5 leading-snug">{props.name || node.id}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {props.risk_score !== undefined && (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">THREAT / RISK SCORE</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  props.risk_score > 80 ? 'bg-red-500' : props.risk_score > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${props.risk_score}%` }}
              ></div>
            </div>
            <span className="text-sm font-mono font-bold text-white">{props.risk_score}/100</span>
          </div>
        </div>
      )}

      <div className="space-y-3 text-xs">
        <h3 className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-bold">Node Attributes</h3>
        <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          {Object.entries(props).map(([key, val]) => {
            if (['id', 'name', 'icon', 'risk_score'].includes(key)) return null;
            return (
              <div key={key} className="flex justify-between gap-2 border-b border-slate-800/50 pb-1.5 last:border-0 last:pb-0">
                <span className="font-mono text-slate-400 text-[11px]">{key}</span>
                <span className="font-medium text-slate-200 text-right truncate max-w-[180px]">
                  {typeof val === 'boolean' ? (val ? 'True' : 'False') : String(val)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
