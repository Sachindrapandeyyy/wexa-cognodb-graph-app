from fastapi import APIRouter, HTTPException
import time
from typing import List, Dict, Any
from app.models import CypherQueryRequest, CypherQueryResult, GraphNode, GraphEdge
from app.queries import QUERY_CATALOG
from app.database import graph_service

router = APIRouter(prefix="/api/cypher", tags=["Cypher Executor"])

@router.get("/catalog")
def get_query_catalog() -> List[Dict[str, Any]]:
    return QUERY_CATALOG

@router.post("/execute", response_model=CypherQueryResult)
def execute_cypher_query(request: CypherQueryRequest):
    q = request.query.strip()
    if not q:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    start_time = time.time()
    try:
        records = graph_service.execute_query(q, request.params or {})
        elapsed = (time.time() - start_time) * 1000.0
        return CypherQueryResult(
            query=q,
            records=records,
            execution_time_ms=round(elapsed, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
