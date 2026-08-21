import {
  GraphData,
  AttackPathResult,
  BlastRadiusResult,
  ChokepointItem,
  CypherCatalogItem,
  CypherQueryResult,
  ConnectionStatus
} from '../types/graph';

const API_BASE = '/api';

export async function fetchHealth(): Promise<ConnectionStatus> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch health');
  return res.json();
}

export async function testConnection(uri: string, user: string, password: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/health/test-connection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uri, user, password }),
  });
  return res.json();
}

export async function fetchFullGraph(assetType?: string, isCrownJewel?: boolean): Promise<GraphData> {
  const params = new URLSearchParams();
  if (assetType) params.append('asset_type', assetType);
  if (isCrownJewel !== undefined) params.append('is_crown_jewel', String(isCrownJewel));
  
  const res = await fetch(`${API_BASE}/graph?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch graph data');
  return res.json();
}

export async function fetchAttackPaths(sourceId?: string, targetId?: string, maxHops = 5): Promise<AttackPathResult[]> {
  const params = new URLSearchParams();
  if (sourceId) params.append('source_id', sourceId);
  if (targetId) params.append('target_id', targetId);
  params.append('max_hops', String(maxHops));

  const res = await fetch(`${API_BASE}/attack-paths?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch attack paths');
  return res.json();
}

export async function fetchBlastRadius(nodeId: string, maxHops = 3): Promise<BlastRadiusResult> {
  const params = new URLSearchParams({ node_id: nodeId, max_hops: String(maxHops) });
  const res = await fetch(`${API_BASE}/blast-radius?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to calculate blast radius');
  return res.json();
}

export async function fetchChokepoints(): Promise<ChokepointItem[]> {
  const res = await fetch(`${API_BASE}/chokepoints`);
  if (!res.ok) throw new Error('Failed to fetch chokepoints');
  return res.json();
}

export async function simulatePatchChokepoint(nodeId: string): Promise<{ patched_node_id: string; status: string; graph: GraphData }> {
  const res = await fetch(`${API_BASE}/chokepoints/simulate-patch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ node_id: nodeId }),
  });
  if (!res.ok) throw new Error('Failed to simulate patch');
  return res.json();
}

export async function fetchCypherCatalog(): Promise<CypherCatalogItem[]> {
  const res = await fetch(`${API_BASE}/cypher/catalog`);
  if (!res.ok) throw new Error('Failed to fetch Cypher catalog');
  return res.json();
}

export async function executeCypherQuery(query: string, params: Record<string, any> = {}): Promise<CypherQueryResult> {
  const res = await fetch(`${API_BASE}/cypher/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, params }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Query execution failed' }));
    throw new Error(errorData.detail || 'Query execution failed');
  }
  return res.json();
}
