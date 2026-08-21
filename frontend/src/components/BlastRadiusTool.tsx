import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Layers, 
  ShieldAlert, 
  Sparkles
} from 'lucide-react';
import { GraphNode, BlastRadiusResult } from '../types/graph';
import { fetchBlastRadius } from '../services/api';

interface BlastRadiusToolProps {
  nodes: GraphNode[];
  onHighlightBlastRadius: (nodeIds: string[]) => void;
}

export const BlastRadiusTool: React.FC<BlastRadiusToolProps> = ({
  nodes,
  onHighlightBlastRadius,
}) => {
  const [selectedOriginId, setSelectedOriginId] = useState<string>('node-iam-role-crossaccount');
  const [maxDepth, setMaxDepth] = useState<number>(2);
  const [result, setResult] = useState<BlastRadiusResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!selectedOriginId) return;

    setIsLoading(true);
    fetchBlastRadius(selectedOriginId, maxDepth)
      .then((data) => {
        setResult(data);
        const allImpacted = [
          data.origin_node_id,
          ...data.compromise_tier_1.map(n => n.id),
          ...data.compromise_tier_2.map(n => n.id),
          ...data.compromise_tier_3.map(n => n.id),
        ];
        onHighlightBlastRadius(allImpacted);
      })
      .catch((err) => console.error('Failed to compute blast radius:', err))
      .finally(() => setIsLoading(false));
  }, [selectedOriginId, maxDepth]);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6 w-full">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="font-extrabold text-base text-slate-900">IAM & Infrastructure Blast Radius Simulator</h3>
          </div>
          <p className="text-xs text-slate-500">
            Simulate transitive compromise cascade across bidirectional entity trust graphs.
          </p>
        </div>

        {/* Origin Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700">Compromised Asset:</label>
            <select
              value={selectedOriginId}
              onChange={(e) => setSelectedOriginId(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-full px-3.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
            >
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.properties?.name || node.label || node.id} ({node.labels?.[0] || node.label})
                </option>
              ))}
            </select>
          </div>

          {/* Depth Slider */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200">
            <label className="text-xs font-semibold text-slate-700">Depth:</label>
            <input
              type="range"
              min="1"
              max="3"
              value={maxDepth}
              onChange={(e) => setMaxDepth(parseInt(e.target.value))}
              className="w-20 accent-slate-900 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-900 min-w-[28px]">{maxDepth} hops</span>
          </div>
        </div>
      </div>

      {/* Metrics Summary Row */}
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-medium">Total Impacted</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{result.total_impacted_assets} Assets</div>
          </div>

          <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200">
            <span className="text-xs text-rose-600 font-semibold">Crown Jewels at Risk</span>
            <div className="text-2xl font-extrabold text-rose-700 mt-1">
              {result.threatened_crown_jewels?.length || 0} Databases
            </div>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
            <span className="text-xs text-amber-700 font-semibold">Tier 1 (Direct 1-Hop)</span>
            <div className="text-2xl font-extrabold text-amber-800 mt-1">
              {result.compromise_tier_1?.length || 0} Nodes
            </div>
          </div>

          <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200">
            <span className="text-xs text-purple-700 font-semibold">Tier 2+ (Transitive)</span>
            <div className="text-2xl font-extrabold text-purple-800 mt-1">
              {(result.compromise_tier_2?.length || 0) + (result.compromise_tier_3?.length || 0)} Nodes
            </div>
          </div>
        </div>
      )}

      {/* Impact Breakdown Columns */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1 */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Tier 1: Direct Adjacency</span>
              <span className="text-[11px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-700">
                1 Hop
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {result.compromise_tier_1?.length > 0 ? (
                result.compromise_tier_1.map((node) => (
                  <span key={node.id} className="text-[11px] bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-medium">
                    {node.properties?.name || node.id}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">None</span>
              )}
            </div>
          </div>

          {/* Tier 2 */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Tier 2: Transitive Trust</span>
              <span className="text-[11px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-700">
                2 Hops
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {result.compromise_tier_2?.length > 0 ? (
                result.compromise_tier_2.map((node) => (
                  <span key={node.id} className="text-[11px] bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-medium">
                    {node.properties?.name || node.id}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">None</span>
              )}
            </div>
          </div>

          {/* Tier 3 */}
          <div className="bg-slate-50/60 p-4 rounded-2xl border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Tier 3: Cascade Perimeter</span>
              <span className="text-[11px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-700">
                3 Hops
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {result.compromise_tier_3?.length > 0 ? (
                result.compromise_tier_3.map((node) => (
                  <span key={node.id} className="text-[11px] bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-medium">
                    {node.properties?.name || node.id}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">None</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
