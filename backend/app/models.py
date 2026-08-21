from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class GraphNode(BaseModel):
    id: str
    label: str
    labels: List[str] = []
    properties: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str
    properties: Dict[str, Any] = {}

class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    stats: Optional[Dict[str, Any]] = None

class AttackPathStep(BaseModel):
    node_id: str
    node_name: str
    node_label: str
    relationship: Optional[str] = None
    step_description: str

class AttackPathResult(BaseModel):
    path_id: str
    source_name: str
    target_name: str
    hop_count: int
    threat_score: float
    steps: List[AttackPathStep]
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    cypher_query: str

class BlastRadiusResult(BaseModel):
    origin_node_id: str
    origin_name: str
    total_impacted_assets: int
    compromise_tier_1: List[GraphNode] = []
    compromise_tier_2: List[GraphNode] = []
    compromise_tier_3: List[GraphNode] = []
    threatened_crown_jewels: List[GraphNode] = []
    graph: GraphData
    cypher_query: str

class ChokepointItem(BaseModel):
    node_id: str
    name: str
    type: str
    labels: List[str]
    paths_intercepted: int
    exposed_entrypoints: int
    threatened_targets: int
    remediation_recommendation: str
    estimated_risk_reduction_pct: float

class CypherQueryRequest(BaseModel):
    query: str
    params: Optional[Dict[str, Any]] = None

class CypherQueryResult(BaseModel):
    query: str
    records: List[Dict[str, Any]]
    execution_time_ms: float
    nodes: List[GraphNode] = []
    edges: List[GraphEdge] = []

class ConnectionStatus(BaseModel):
    connected: bool
    status: str
    uri: Optional[str] = None
    is_mock_fallback: bool
    database_version: Optional[str] = None
    error_message: Optional[str] = None
    total_nodes: int = 0
    total_edges: int = 0
