from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List
from app.models import GraphData, GraphNode, GraphEdge
from app.database import graph_service
from app.mock_engine import _mock_engine

router = APIRouter(prefix="/api/graph", tags=["Graph"])

@router.get("", response_model=GraphData)
def get_graph(
    asset_type: Optional[str] = Query(None, description="Filter by asset type"),
    is_crown_jewel: Optional[bool] = Query(None, description="Filter crown jewels")
): 
    g = _mock_engine.get_full_graph()
    filtered_nodes = g.nodes
    if asset_type:
        filtered_nodes = [n for n in filtered_nodes if asset_type.lower() in [str(l).lower() for l in n.labels] or asset_type.lower() in str(n.properties.get('type', '')).lower()]
    if is_crown_jewel is not None:
        filtered_nodes = [n for n in filtered_nodes if n.properties.get("is_crown_jewel") == is_crown_jewel]
    
    node_ids = {n.id for n in filtered_nodes}
    filtered_edges = [e for e in g.edges if e.source in node_ids and e.target in node_ids]
    return GraphData(nodes=filtered_nodes, edges=filtered_edges, stats=g.stats)

@router.get("/stats")
def get_graph_stats():
    g = _mock_engine.get_full_graph()
    return g.stats

@router.get("/nodes/{node_id}", response_model=GraphNode)
def get_node_detail(node_id: str):
    node = _mock_engine.node_map.get(node_id)
    if not node:
        raise HTTPException(status_code=404, detail=f"Node {node_id} not found")
    return GraphNode(id=node["id"], label=node["labels"][0], labels=node["labels"], properties=node["properties"])
