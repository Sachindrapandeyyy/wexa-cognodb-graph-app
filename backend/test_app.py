import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/api/info")
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "AegisGraph API"
    
    res_spa = client.get("/")
    assert res_spa.status_code == 200

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data
    assert data["total_nodes"] > 10
    assert data["total_edges"] > 10

def test_graph_full_and_filtering():
    res = client.get("/api/graph")
    assert res.status_code == 200
    data = res.json()
    assert len(data["nodes"]) >= 15
    assert len(data["stats"]) >= 3
    
    res_crown = client.get("/api/graph?is_crown_jewel=true")
    assert res_crown.status_code == 200
    data_crown = res_crown.json()
    for node in data_crown["nodes"]:
        assert node["properties"]["is_crown_jewel"] is True

def test_attack_paths_discovery():
    res = client.get("/api/attack-paths?max_hops=5")
    assert res.status_code == 200
    paths = res.json()
    assert len(paths) > 0
    for p in paths:
        assert p["hop_count"] >= 1
        assert len(p["steps"]) >= 2
        assert "cypher_query" in p

def test_blast_radius():
    res = client.get("/api/blast-radius?node_id=iam-role-cross-account-db&max_hops=3")
    assert res.status_code == 200
    blast = res.json()
    assert blast["total_impacted_assets"] > 0
    assert len(blast["graph"]["nodes"]) > 0

def test_chokepoints_and_simulation():
    res = client.get("/api/chokepoints")
    assert res.status_code == 200
    chokes = res.json()
    assert len(chokes) > 0
    first = chokes[0]
    assert first["paths_intercepted"] > 0
    assert first["estimated_risk_reduction_pct"] > 0
    
    res_sim = client.post("/api/chokepoints/simulate-patch", json={"node_id": first["node_id"]})
    assert res_sim.status_code == 200
    sim = res_sim.json()
    assert "patched_node_id" in sim

def test_cypher_execution():
    res = client.get("/api/cypher/catalog")
    assert res.status_code == 200
    catalog = res.json()
    assert len(catalog) >= 5
    
    res_exec = client.post("/api/cypher/execute", json={
        "query": "MATCH (r:Attacker)-[*1..5]->(d:DataAsset) RETURN r, d",
        "params": {}
    })
    assert res_exec.status_code == 200
    exec_data = res_exec.json()
    assert "records" in exec_data
    assert "execution_time_ms" in exec_data
