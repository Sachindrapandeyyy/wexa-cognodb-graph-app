import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Play, 
  Pause, 
  Filter, 
  Sparkles
} from 'lucide-react';
import { GraphNode, GraphData } from '../types/graph';

interface GraphCanvasProps {
  graphData: GraphData;
  selectedNodeId: string | null;
  onSelectNode: (node: GraphNode | null) => void;
  highlightPathNodeIds?: string[];
  highlightPathEdgeIds?: string[];
  isLoading?: boolean;
}

const getNodeColor = (node: GraphNode, isHighlighted: boolean, isSelected: boolean) => {
  if (isSelected) {
    return {
      background: '#e0e7ff',
      border: '#4338ca',
      highlight: { background: '#c7d2fe', border: '#3730a3' }
    };
  }

  if (isHighlighted) {
    return {
      background: '#fee2e2',
      border: '#dc2626',
      highlight: { background: '#fecaca', border: '#b91c1c' }
    };
  }

  if (node.properties?.is_crown_jewel) {
    return {
      background: '#dcfce7',
      border: '#16a34a',
      highlight: { background: '#bbf7d0', border: '#15803d' }
    };
  }

  if (node.properties?.is_chokepoint) {
    return {
      background: '#fef3c7',
      border: '#d97706',
      highlight: { background: '#fde68a', border: '#b45309' }
    };
  }

  const primaryLabel = node.labels?.[0] || node.label || '';
  switch (primaryLabel) {
    case 'Attacker':
    case 'ThreatActor':
      return { background: '#fee2e2', border: '#ef4444', highlight: { background: '#fecaca', border: '#dc2626' } };
    case 'Compute':
    case 'Asset':
      return { background: '#e0f2fe', border: '#0284c7', highlight: { background: '#bae6fd', border: '#0369a1' } };
    case 'Identity':
    case 'IAMRole':
    case 'IAMUser':
      return { background: '#fef3c7', border: '#f59e0b', highlight: { background: '#fde68a', border: '#d97706' } };
    case 'Secret':
    case 'KMSKey':
    case 'SSHKey':
      return { background: '#f3e8ff', border: '#a855f7', highlight: { background: '#e9d5ff', border: '#9333ea' } };
    case 'DataAsset':
    case 'CrownJewel':
    case 'Database':
    case 'S3Bucket':
      return { background: '#dcfce7', border: '#10b981', highlight: { background: '#bbf7d0', border: '#059669' } };
    case 'Vulnerability':
    case 'CVE':
      return { background: '#ffe4e6', border: '#f43f5e', highlight: { background: '#fecdd3', border: '#e11d48' } };
    case 'NetworkZone':
      return { background: '#f1f5f9', border: '#64748b', highlight: { background: '#e2e8f0', border: '#475569' } };
    default:
      return { background: '#f8fafc', border: '#94a3b8', highlight: { background: '#f1f5f9', border: '#64748b' } };
  }
};

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graphData,
  selectedNodeId,
  onSelectNode,
  highlightPathNodeIds = [],
  highlightPathEdgeIds = [],
  isLoading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesDataSetRef = useRef<DataSet<any> | null>(null);
  const edgesDataSetRef = useRef<DataSet<any> | null>(null);

  const [physicsEnabled, setPhysicsEnabled] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [showCrownJewelsOnly, setShowCrownJewelsOnly] = useState<boolean>(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const filteredNodes = (graphData.nodes || []).filter(node => {
      if (showCrownJewelsOnly && !node.properties?.is_crown_jewel) return false;
      if (filterType !== 'all' && !(node.labels?.includes(filterType) || node.label === filterType)) return false;
      return true;
    });

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = (graphData.edges || []).filter(e => 
      filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
    );

    const visNodes = filteredNodes.map(node => {
      const isHighlighted = highlightPathNodeIds.includes(node.id);
      const isSelected = selectedNodeId === node.id;
      const colors = getNodeColor(node, isHighlighted, isSelected);

      return {
        id: node.id,
        label: node.properties?.name || node.label || node.id,
        shape: 'box',
        borderWidth: isSelected ? 3 : isHighlighted ? 2.5 : 1.5,
        borderRadius: 8,
        color: colors,
        font: {
          color: '#0f172a',
          size: 11,
          face: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          bold: isSelected || isHighlighted ? '700' : '500',
        },
        margin: { top: 7, right: 10, bottom: 7, left: 10 },
        shadow: isSelected || isHighlighted ? {
          enabled: true,
          color: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(239, 68, 68, 0.25)',
          size: 10,
          x: 0,
          y: 4
        } : {
          enabled: true,
          color: 'rgba(0, 0, 0, 0.04)',
          size: 4,
          x: 0,
          y: 2
        }
      };
    });

    const visEdges = filteredEdges.map(edge => {
      const isHighlighted = highlightPathEdgeIds.includes(edge.id) ||
        (highlightPathNodeIds.includes(edge.source) && highlightPathNodeIds.includes(edge.target));

      return {
        id: edge.id,
        from: edge.source,
        to: edge.target,
        label: edge.type,
        arrows: { to: { enabled: true, scaleFactor: 0.7 } },
        color: {
          color: isHighlighted ? '#dc2626' : '#cbd5e1',
          highlight: '#4f46e5',
          hover: '#94a3b8'
        },
        width: isHighlighted ? 3 : 1.2,
        font: {
          color: isHighlighted ? '#991b1b' : '#64748b',
          size: 9,
          align: 'horizontal',
          background: 'rgba(255, 255, 255, 0.9)',
          strokeWidth: 0
        },
        smooth: { enabled: true, type: 'curvedCW', roundness: 0.12 }
      };
    });

    const nodesDataSet = new DataSet(visNodes);
    const edgesDataSet = new DataSet(visEdges);
    nodesDataSetRef.current = nodesDataSet;
    edgesDataSetRef.current = edgesDataSet;

    const options = {
      physics: {
        enabled: physicsEnabled,
        solver: 'barnesHut',
        barnesHut: {
          gravitationalConstant: -2200,
          centralGravity: 0.35,
          springLength: 120,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.4
        },
        stabilization: {
          iterations: 150,
          updateInterval: 25
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 150,
        zoomView: true,
        dragView: true,
        selectConnectedEdges: true
      }
    };

    const network = new Network(containerRef.current, { nodes: nodesDataSet, edges: edgesDataSet }, options);
    networkRef.current = network;

    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const clickedId = params.nodes[0];
        const fullNode = graphData.nodes?.find(n => n.id === clickedId) || null;
        onSelectNode(fullNode);
      } else {
        onSelectNode(null);
      }
    });

    return () => {
      network.destroy();
    };
  }, [graphData, filterType, showCrownJewelsOnly]);

  useEffect(() => {
    if (!networkRef.current || !nodesDataSetRef.current) return;

    const nodes = nodesDataSetRef.current;
    (graphData.nodes || []).forEach(node => {
      const isHighlighted = highlightPathNodeIds.includes(node.id);
      const isSelected = selectedNodeId === node.id;
      const colors = getNodeColor(node, isHighlighted, isSelected);

      try {
        nodes.update({
          id: node.id,
          borderWidth: isSelected ? 3 : isHighlighted ? 2.5 : 1.5,
          color: colors,
          font: {
            color: '#0f172a',
            size: 11,
            bold: isSelected || isHighlighted ? '700' : '500',
          }
        });
      } catch (e) {
        // Ignored if node is filtered
      }
    });
  }, [selectedNodeId, highlightPathNodeIds, highlightPathEdgeIds]);

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

  const handleFit = () => {
    if (!networkRef.current) return;
    networkRef.current.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } });
  };

  const togglePhysics = () => {
    if (!networkRef.current) return;
    const nextState = !physicsEnabled;
    setPhysicsEnabled(nextState);
    networkRef.current.setOptions({ physics: { enabled: nextState } });
  };

  return (
    <div className="relative w-full h-[600px] lg:h-[680px] bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden wexa-grid-bg">
      
      {/* Top Filter Bar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-full border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-700">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter:</span>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-50 text-slate-800 text-xs font-medium rounded-full px-3 py-1 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
        >
          <option value="all">All Labels ({graphData.nodes?.length || 0})</option>
          <option value="Attacker">Threat Actors</option>
          <option value="Compute">Compute / Workloads</option>
          <option value="Identity">IAM Identities</option>
          <option value="Secret">Secrets & KMS</option>
          <option value="DataAsset">Data Assets</option>
          <option value="Vulnerability">CVE Vulnerabilities</option>
          <option value="NetworkZone">Network Zones</option>
        </select>

        <button
          onClick={() => setShowCrownJewelsOnly(!showCrownJewelsOnly)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            showCrownJewelsOnly 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3 h-3 text-emerald-500" />
          Crown Jewels Only
        </button>
      </div>

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-full border border-slate-200 shadow-sm">
        <button
          onClick={handleZoomIn}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleFit}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
          title="Fit to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>

        <button
          onClick={togglePhysics}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            physicsEnabled
              ? 'bg-slate-100 text-slate-800'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}
          title="Toggle Force Physics"
        >
          {physicsEnabled ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{physicsEnabled ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200 shadow-sm text-[11px] text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 border border-rose-500"></span>
          <span>Threat</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 border border-sky-500"></span>
          <span>Compute</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500"></span>
          <span>IAM</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 border border-purple-500"></span>
          <span>Secrets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-500"></span>
          <span>Crown Jewels</span>
        </div>
      </div>

      {/* Main Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
