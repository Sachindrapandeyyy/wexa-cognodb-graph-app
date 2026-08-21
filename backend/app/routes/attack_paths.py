from fastapi import APIRouter, Query, Body
from typing import List, Optional
from app.models import AttackPathResult
from app.mock_engine import _mock_engine

router = APIRouter(prefix="/api/attack-paths", tags=["Attack Paths"])

@router.get("", response_model=List[AttackPathResult])
def get_attack_paths(
    source_id: Optional[str] = Query(None, description="Entrypoint or attacker node ID"),
    target_id: Optional[str] = Query(None, description="Target Crown Jewel ID"),
    max_hops: int = Query(5, ge=1, le=10)
):
    return _mock_engine.find_attack_paths(source_id=source_id, target_id=target_id, max_hops=max_hops)

@router.post("/find", response_model=List[AttackPathResult])
def find_specific_paths(
    source_id: Optional[str] = Body(None),
    target_id: Optional[str] = Body(None),
    max_hops: int = Body(5)
):
    return _mock_engine.find_attack_paths(source_id=source_id, target_id=target_id, max_hops=max_hops)
