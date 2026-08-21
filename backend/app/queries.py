from typing import List, Dict, Any

QUERY_CATALOG: List[Dict[str, Any]] = [
    {
        "id": "multi-hop-attack-paths",
        "title": "Multi-Hop Cloud Attack Path Discovery",
        "category": "Attack Vectors",
        "description": "Traces unrestricted attack chains from external threat actors or publicly exposed compute instances through IAM profiles, CVEs, and STS AssumeRole trusts to Crown Jewel databases (2+ hops).",
        "why_graph_wins": "In SQL, finding variable-length network + IAM + data paths requires complex recursive CTEs with exponential joins and cycle detection challenges. In openCypher, it is a natural *1..5 path pattern.",
        "cypher": """MATCH path = (source:Asset {id: $source_id})-[*1..5]->(target:DataAsset {id: $target_id})
RETURN path, length(path) AS hops""",
        "parameters": {
            "source_id": "actor-apt29",
            "target_id": "data-s3-customer-pii"
        }
    },
    {
        "id": "blast-radius-impact",
        "title": "IAM & Infrastructure Blast Radius Simulation",
        "category": "Blast Radius",
        "description": "Determines all directly and indirectly affected assets, secrets, and databases if an IAM role, compute node, or key is compromised.",
        "why_graph_wins": "Graph databases traverse neighborhoods (1..3 hops) bidirectionally in milliseconds without pre-joining tables.",
        "cypher": """MATCH (origin {id: $origin_id})-[r*1..3]-(affected)
RETURN origin, r, affected""",
        "parameters": {
            "origin_id": "iam-role-cross-account-db",
            "max_hops": 3
        }
    },
    {
        "id": "chokepoint-bottleneck",
        "title": "Critical Security Chokepoints (REMEDIATION ROI)",
        "category": "Remediation",
        "description": "Identifies single points of failure through which multiple attack paths converge. Patching these nodes breaks the maximum number of exploit chains.",
        "why_graph_wins": "Computing graph betweenness and path intersection is a fundamental graph algorithm, whereas relational queries would require prohibitive self-joins over materialized paths.",
        "cypher": """MATCH (entry:Compute {is_internet_facing: true})-[*1..4]->(choke)-[*1..3]->(target:DataAsset {is_crown_jewel: true})
WHERE NOT choke:CrownJewel AND NOT choke:Attacker
RETURN choke.name AS chokepoint, labels(choke) AS types, count(DISTINCT entry) AS exposed_entries, count(DISTINCT target) AS threatened_targets
ORDER BY exposed_entries * threatened_targets DESC LIMIT 5""",
        "parameters": {}
    },
    {
        "id": "circular-iam-escalation",
        "title": "Circular IAM Privilege Escalation Detection",
        "category": "IAM Sanity",
        "description": "Detects dangerous reciprocal or transitive IAM Role assumption loops where roles can escalate their own privileges.",
        "why_graph_wins": "Cycle detection in directed graphs is a native Cypher strength, avoiding infinite loops or complex tracking tables.",
        "cypher": """MATCH path = (r1:Identity)-[:ASSUMES*2..6]->(r1)
RETURN path, length(path) AS cycle_length""",
        "parameters": {}
    },
    {
        "id": "least-privilege-audit",
        "title": "Unused Overprivileged IAM Permissions (Least Privilege)",
        "category": "IAM Sanity",
        "description": "Identifies IAM roles possessing wildcard or administrative permissions against Crown Jewels that have not been exercised in > 90 days.",
        "why_graph_wins": "Graphs allow querying relationship properties directly alongside connected node attributes in a single declarative statement.",
        "cypher": """MATCH (i:Identity)-[p:HAS_PERMISSION]->(d:DataAsset)
WHERE p.last_used_days > 90 AND (p.action CONTAINS '*' OR p.is_admin_action = true)
RETURN i.name AS identity, p.action AS permission, d.name AS target_asset, p.last_used_days AS days_inactive""",
        "parameters": {}
    },
    {
        "id": "shortest-attack-vector",
        "title": "Shortest Vulnerability Attack Path (minimum exploit hops)",
        "category": "Attack Vectors",
        "description": "Finds the shortest path of least resistance from an attacker to a targeted Crown Jewel.",
        "why_graph_wins": "shortestPath() is a built-in graph algorithm executed in openCypher in O(V+E) time, extremely difficult in SQL.",
        "cypher": """MATCH (src:Attacker {id: $attacker_id}), (tgt:CrownJewel {id: $target_id})
MATCH path = shortestPath((src)-[*1..10]->(tgt))
RETURN path, length(path) AS min_hops""",
        "parameters": {
            "attacker_id": "actor-apt29",
            "target_id": "data-rds-postgres-primary"
        }
    }
]
