from fastapi import APIRouter, Body
from typing import List, Dict, Any
from app.models import ChokepointItem, GraphData
from app.mock_engine import _mock_engine

router = APIRouter(prefix="/api/chokepoints", tags=["Chokepoints & Remediation"])

@router.get("", response_model=List[ChokepointItem])
def get_chokepoints():
    return _mock_engine.get_chokepoints()

@router.post("/simulate-patch")
def simulate_patch(
    node_id: str = Body(..., embed=True)
):
    g = _mock_engine.get_full_graph()
    remaining_nodes = [n for n in g.nodes if n.id != node_id]
    remaining_edges = [e for e in g.edges if e.source != node_id and e.target != node_id]
    return {
        "patched_node_id": node_id,
        "status": "SIMULATION_ACTIVE: Attack paths neutralized",
        "remaining_nodes_count": len(remaining_nodes),
        "remaining_edges_count": len(remaining_edges),
        "graph": GraphData(nodes=remaining_nodes, edges=remaining_edges)
    }
