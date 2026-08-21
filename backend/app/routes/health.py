from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.models import ConnectionStatus
from app.database import graph_service
from app.seed_data import NODES, RELATIONSHIPS
from app.config import settings

router = APIRouter(prefix="/api/health", tags=["System Health"])

class TestConnectionRequest(BaseModel):
    uri: str
    user: str = "cognodb"
    password: str
    database: Optional[str] = "neo4j"

@router.get("", response_model=ConnectionStatus)
def check_health():
    is_mock = graph_service.is_mock
    err = graph_service.last_error
    status_str = "FALLBACK_DEMO_MODE" if is_mock else "COGNODB_CLOUD_CONNECTED"
    
    return ConnectionStatus(
        connected=not is_mock,
        status=status_str,
        uri=settings.COGNODB_URI or "bolt+s://db-c50a18eb.bravo.databases.cognodb.com",
        is_mock_fallback=is_mock,
        database_version="CognoDB 5.0 (Cloud)" if not is_mock else "AegisGraph Simulated Engine 1.0",
        error_message=err,
        total_nodes=len(NODES),
        total_edges=len(RELATIONSHIPS)
    )

@router.post("/test-connection")
def test_connection(payload: TestConnectionRequest):
    from neo4j import GraphDatabase
    try:
        clean_uri = payload.uri.strip()
        clean_user = payload.user.strip()
        clean_pass = payload.password.strip()
        clean_db = (payload.database or "neo4j").strip()

        driver = GraphDatabase.driver(
            clean_uri,
            auth=(clean_user, clean_pass),
            max_connection_lifetime=3600,
            max_connection_pool_size=50,
            connection_acquisition_timeout=5.0
        )
        with driver.session(database=clean_db) as session:
            res = session.run("RETURN 1 AS ok")
            rec = res.single()
            if rec and rec["ok"] == 1:
                # Update live graph service driver
                graph_service.set_live_driver(driver)
                
                # Update global settings in memory
                settings.COGNODB_URI = clean_uri
                settings.COGNODB_USER = clean_user
                settings.COGNODB_PASSWORD = clean_pass
                settings.COGNODB_DATABASE = clean_db
                
                # Fetch live node count
                count_res = session.run("MATCH (n) RETURN count(n) AS cnt").single()
                node_count = count_res["cnt"] if count_res else len(NODES)
                
                return {
                    "success": True,
                    "message": f"Connected to CognoDB Cloud! Live Graph: {node_count} nodes.",
                    "node_count": node_count
                }
        driver.close()
        return {"success": False, "message": "Connection verification failed."}
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to connect: {str(e)}"
        }
