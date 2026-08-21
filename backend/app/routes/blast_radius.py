from fastapi import APIRouter, Query, Body
from typing import Optional
from app.models import BlastRadiusResult
from app.mock_engine import _mock_engine

router = APIRouter(prefix="/api/blast-radius", tags=["Blast Radius"])

@router.get("", response_model=BlastRadiusResult)
def get_blast_radius(
    node_id: str = Query("iam-role-cross-account-db", description="Origin node to calculate blast radius from"),
    max_hops: int = Query(3, ge=1, le=5)
): 
    return _mock_engine.calculate_blast_radius(origin_id=node_id, max_hops=max_hops)

@router.post("", response_model=BlastRadiusResult)
def post_blast_radius(
    node_id: str = Body(..., embed=True),
    max_hops: int = Body(3, embed=True)
): 
    return _mock_engine.calculate_blast_radius(origin_id=node_id, max_hops=max_hops)
