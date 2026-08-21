from fastapi import APIRouter, Body
from typing import Optional, Dict, Any
from app.models import ConnectionStatus
from app.database import graph_service
from app.seed_data import NODES, RELATIONSHIPS
from app.config import settings

router = APIRouter(prefix="/api/health", tags=["System Health"])

@router.get("", response_model=ConnectionStatus)
def check_health():
    is_mock = graph_service.is_mock
    err = graph_service.last_error
    status_str = "FALLBACK_DEMO_MODE" if is_mock else "COGNODB_CLOUD_CONNECTED"
    
    return ConnectionStatus(
        connected=not is_mock,
        status=status_str,
        uri=settings.COGNODB_URI or "bolt+s://your-instance.databases.cognodb.cloud",
        is_mock_fallback=is_mock,
        database_version="CognoDB 5.0 (Cloud)" if not is_mock else "AegisGraph Simulated Engine 1.0",
        error_message=err,
        total_nodes=len(NODES),
        total_edges=len(RELATIONSHIPS)
    )

@router.post("/test-connection")
def test_connection(
    uri: str = Body(..., embed=True),
    user: str = Body("cognodb", embed=True),
    password: str = Body(..., embed=True)
):
    from neo4j import GraphDatabase
    try:
        driver = GraphDatabase.driver(
            uri,
            auth=(user, password),
            connection_acquisition_timeout=5.0
        )
        with driver.session() as session:
            res = session.run("RETURN 1 AS ok")
            rec = res.single()
            if rec and rec["ok"] == 1:
                driver.close()
                return {
                    "success": True,
                    "message": "Connection to CognoDB Cloud was successful!"
                }
        driver.close()
        return {"success": False, "message": "Connection verification failed."}
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to connect: {str(e)}"
        }
