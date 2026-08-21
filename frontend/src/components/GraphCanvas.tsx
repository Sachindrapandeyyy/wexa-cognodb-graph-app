import React, { useEffect, useRef, useState } from 'react';
import { Network, Node, Edge } from 'vis-network';
import { DataSet } from 'vis-data';
import { Maximize2, ZoomIn, ZoomOut, RefreshCw, Filter } from 'lucide-react';
import { GraphData, GraphNode } from '../types/graph';

interface GraphCanvasProps {
  graphData: GraphData;
  onSelectNode: (node: GraphNode | null) => void;
  selectedNodeId?: string | null;
  highlightedNodeIds?: string[];
  highlightedEdgeIds?: string[];
  className?: string;
}

const LABEL_COLORS: Record<string, { bg: string; border: string; highlight: string }> = {
  Attacker: { bg: '#3f121d', border: '#ff2a55', highlight: '#ff5c7e' },
  Compute: { bg: '#083344', border: '#06b6d4', highlight: '#22d3ee' },
  Identity: { bg: '#451a03', border: '#f59e0b', highlight: '#fbbf24' },
  Secret: { bg: '#3b0764', border: '#a855f7', highlight: '#c084fc' },
  DataAsset: { bg: '#022c22', border: '#10b981', highlight: '#34d399' },
  Vulnerability: { bg: '#431407', border: '#f97316', highlight: '#fb923c' },
  NetworkZone: { bg: '#172554', border: '#3b82f6', highlight: '#60a5fa' },
  Default: { bg: '#1e293b', border: '#64748b', highlight: '#94a3b8' },
};

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graphData,
  onSelectNode,
  selectedNodeId,
  highlightedNodeIds = [],
  highlightedEdgeIds = [],
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  useEffect(() => {
    if (!containerRef.current || !graphData.nodes) return;

    const hasHighlight = highlightedNodeIds.length > 0;

    // Filter nodes if filter is active
    const displayNodes = graphData.nodes.filter((n) => {
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'CROWN') return n.properties.is_crown_jewel;
      if (activeFilter === 'CHOKE') return n.properties.is_chokepoint;
      return n.labels.includes(activeFilter);
    });

    const displayNodeIds = new Set(displayNodes.map((n) => n.id));

    // Vis Nodes
    const visNodes: Node[] = displayNodes.map((n) => {
      const primaryLabel = n.labels[0] || 'Default';
      const colorScheme = LABEL_COLORS[primaryLabel] || LABEL_COLORS.Default;
      const isHighlighted = highlightedNodeIds.includes(n.id);
      const isSelected = selectedNodeId === n.id;
      const isCrownJewel = n.properties.is_crown_jewel;
      const isChokepoint = n.properties.is_chokepoint;

      let opacity = 1.0;
      if (hasHighlight && !isHighlighted) {
        opacity = 0.22;
      }

      const borderWidth = isSelected ? 3 : isCrownJewel || isChokepoint ? 2.5 : 1.5;
      const shape = isCrownJewel ? 'hexagon' : primaryLabel === 'Attacker' ? 'diamond' : 'box';

      return {
        id: n.id,
        label: `${n.properties.name || n.id}\n[${primaryLabel}]`,
        shape: shape,
        margin: { top: 8, right: 8, bottom: 8, left: 8 },
        font: {
          color: hasHighlight && !isHighlighted ? '#64748b' : '#f8fafc',
          size: 11,
          face: 'Plus Jakarta Sans, sans-serif',
        },
        color: {
          background: isSelected ? colorScheme.highlight : colorScheme.bg,
          border: isSelected ? '#ffffff' : colorScheme.border,
          highlight: {
            background: colorScheme.highlight,
            border: '#ffffff',
          },
        },
        borderWidth: borderWidth,
        shadow: isHighlighted || isCrownJewel ? { enabled: true, color: colorScheme.border, size: 10 } : false,
        opacity: opacity,
      };
    });

    // Vis Edges
    const visEdges: Edge[] = graphData.edges
      .filter((e) => displayNodeIds.has(e.source) && displayNodeIds.has(e.target))
      .map((e) => {
        const isHighlighted =
          highlightedEdgeIds.includes(e.id) ||
          (highlightedNodeIds.includes(e.source) && highlightedNodeIds.includes(e.target));

        let color = '#334155';
        let width = 1.2;
        let opacity = 0.85;

        if (hasHighlight) {
          if (isHighlighted) {
            color = '#ff2a55';
            width = 3.0;
            opacity = 1.0;
          } else {
            opacity = 0.15;
          }
        }

        return {
          id: e.id,
          from: e.source,
          to: e.target,
          label: e.type,
          font: {
            color: isHighlighted ? '#ff5c7e' : '#94a3b8',
            size: 9,
            align: 'middle',
            background: '#0a0d14',
            strokeWidth: 0,
          },
          arrows: {
            to: { enabled: true, scaleFactor: 0.8 },
          },
          color: {
            color: color,
            highlight: '#00f0ff',
            hover: '#00f0ff',
            opacity: opacity,
          },
          width: width,
          smooth: {
            enabled: true,
            type: 'curvedCW',
            roundness: 0.15,
          },
        };
      });

    const data = {
      nodes: new DataSet<Node>(visNodes),
      edges: new DataSet<Edge>(visEdges),
    };

    const options = {
      physics: {
        enabled: physicsEnabled,
        solver: 'barnesHut',
        barnesHut: {
          gravitationalConstant: -3500,
          centralGravity: 0.25,
          springLength: 120,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.3,
        },
        stabilization: {
          iterations: 150,
          updateInterval: 25,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true,
        dragView: true,
      },
    };

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    network.on('click', (params) => {
      if (params.nodes && params.nodes.length > 0) {
        const clickedId = String(params.nodes[0]);
        const fullNode = graphData.nodes.find((n) => n.id === clickedId) || null;
        onSelectNode(fullNode);
      } else {
        onSelectNode(null);
      }
    });

    return () => {
      network.destroy();
    };
  }, [graphData, highlightedNodeIds, highlightedEdgeIds, selectedNodeId, physicsEnabled, activeFilter]);

  const handleFit = () => networkRef.current?.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
  const handleZoomIn = () => {
    if (!networkRef.current) return;
    const scale = networkRef.current.getScale();
    networkRef.current.moveTo({ scale: scale * 1.3, animation: { duration: 300, easingFunction: 'easeInOutQuad' } });
  };
  const handleZoomOut = () => {
    if (!networkRef.current) return;
    const scale = networkRef.current.getScale();
    networkRef.current.moveTo({ scale: scale * 0.7, animation: { duration: 300, easingFunction: 'easeInOutQuad' } });
  };

  const filterOptions = [
    { id: 'ALL', label: 'All Assets' },
    { id: 'CROWN', label: '?? Crown Jewels' },
    { id: 'CHOKE', label: '? Chokepoints' },
    { id: 'Compute', label: 'Compute' },
    { id: 'Identity', label: 'IAM Roles' },
    { id: 'Secret', label: 'Secrets/KMS' },
    { id: 'Vulnerability', label: 'CVEs' },
  ];

  return (
    <div className={`relative w-full h-full bg-[#07090e] overflow-hidden rounded-2xl border border-slate-800 ${className}`}>
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 pointer-events-auto overflow-x-auto shadow-lg">
          <Filter className="h-3.5 w-3.5 text-slate-400 ml-2 mr-1" />
          {filterOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                activeFilter === f.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 pointer-events-auto text-[11px] font-mono shadow-lg">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#ff2a55]"></span> Threat</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#06b6d4]"></span> Compute</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#f59e0b]"></span> IAM</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#a855f7]"></span> Secret</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#10b981]"></span> Data</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={handleFit}
          title="Fit Graph to Viewport"
          className="p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => setPhysicsEnabled(!physicsEnabled)}
          title={physicsEnabled ? 'Pause Physics Simulation' : 'Resume Physics Simulation'}
          className={`p-2 rounded-lg transition-colors ${
            physicsEnabled ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${physicsEnabled ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
