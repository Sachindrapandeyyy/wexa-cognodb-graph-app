export interface GraphNodeProperties {
  id: string;
  name?: string;
  type?: string;
  is_crown_jewel?: boolean;
  is_chokepoint?: boolean;
  is_internet_facing?: boolean;
  risk_score?: number;
  icon?: string;
  arn?: string;
  runtime?: string;
  cvss?: number;
  severity?: string;
  cve?: string;
  exploit_type?: string;
  classification?: string;
  record_count?: number;
  data_types?: string;
  public_ip?: string;
  cidr?: string;
  security_tier?: string;
  environment?: string;
  [key: string]: any;
}

export interface GraphNode {
  id: string;
  label: string;
  labels: string[];
  properties: GraphNodeProperties;
}

export interface GraphEdgeProperties {
  action?: string;
  effect?: string;
  mechanism?: string;
  method?: string;
  protocol?: string;
  port?: number;
  last_used_days?: number;
  exploit_difficulty?: number;
  cross_account?: boolean;
  is_circular?: boolean;
  risk_weight?: number;
  [key: string]: any;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  properties: GraphEdgeProperties;
}

export interface GraphStats {
  total_nodes: number;
  total_edges: number;
  crown_jewels: number;
  chokepoints: number;
  vulnerabilities: number;
  [key: string]: any;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stats?: GraphStats;
}

export interface AttackPathStep {
  node_id: string;
  node_name: string;
  node_label: string;
  relationship?: string;
  step_description: string;
}

export interface AttackPathResult {
  path_id: string;
  source_name: string;
  target_name: string;
  hop_count: number;
  threat_score: number;
  steps: AttackPathStep[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  cypher_query: string;
}

export interface BlastRadiusResult {
  origin_node_id: string;
  origin_name: string;
  total_impacted_assets: number;
  compromise_tier_1: GraphNode[];
  compromise_tier_2: GraphNode[];
  compromise_tier_3: GraphNode[];
  threatened_crown_jewels: GraphNode[];
  graph: GraphData;
  cypher_query: string;
}

export interface ChokepointItem {
  node_id: string;
  name: string;
  type: string;
  labels: string[];
  paths_intercepted: number;
  exposed_entrypoints: number;
  threatened_targets: number;
  remediation_recommendation: string;
  estimated_risk_reduction_pct: number;
}

export interface CypherCatalogItem {
  id: string;
  title: string;
  category: string;
  description: string;
  why_graph_wins: string;
  cypher: string;
  parameters: Record<string, any>;
}

export interface CypherQueryResult {
  query: string;
  records: Record<string, any>[];
  execution_time_ms: number;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
}

export interface ConnectionStatus {
  connected: boolean;
  status: string;
  uri?: string;
  is_mock_fallback: boolean;
  database_version?: string;
  error_message?: string;
  total_nodes: number;
  total_edges: number;
}
