import time
from typing import List, Dict, Any, Optional, Set
from app.seed_data import NODES, RELATIONSHIPS, generate_cypher_seed_queries
from app.models import (
    GraphNode, GraphEdge, GraphData,
    AttackPathResult, AttackPathStep,
    BlastRadiusResult, ChokepointItem
)

class InMemoryGraphEngine:
    def __init__(self):
        self.node_map = {n["id"]: n for n in NODES}
        self.relationships = RELATIONSHIPS
        self._build_adjacency()

    def _build_adjacency(self):
        self.outgoing = {n_id: [] for n_id in self.node_map}
        self.incoming = {n_id: [] for n_id in self.node_map}
        for rel in self.relationships:
            src, dst = rel["source"], rel["target"]
            if src in self.outgoing:
                self.outgoing[src].append(rel)
            if dst in self.incoming:
                self.incoming[dst].append(rel)

    def get_full_graph(self) -> GraphData:
        nodes = [GraphNode(id=n["id"], label=n["labels"][0], labels=n["labels"], properties=n["properties"]) for n in self.node_map.values()]
        edges = [GraphEdge(id=r["id"], source=r["source"], target=r["target"], type=r["type"], properties=r["properties"]) for r in self.relationships]
        stats = {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "crown_jewels": sum(1 for n in NODES if n.get("properties", {}).get("is_crown_jewel")),
            "chokepoints": sum(1 for n in NODES if n.get("properties", {}).get("is_chokepoint")),
            "vulnerabilities": sum(1 for n in NODES if "Vulnerability" in n["labels"])
        }
        return GraphData(nodes=nodes, edges=edges, stats=stats)

    def find_attack_paths(self, source_id: Optional[str] = None, target_id: Optional[str] = None, max_hops: int = 5) -> List[AttackPathResult]:
        sources = [source_id] if source_id else [n["id"] for n in NODES if "Attacker" in n["labels"] or n.get("properties", {}).get("is_internet_facing")]
        targets = [target_id] if target_id else [n["id"] for n in NODES if n.get("properties", {}).get("is_crown_jewel")]
        
        results = []
        path_counter = 1

        for src in sources:
            for dst in targets:
                if src == dst:
                    continue
                paths = self._dfs_paths(src, dst, max_hops)
                for path_nodes, path_rels in paths:
                    steps = []
                    for i in range(len(path_nodes)):
                        nstep = self.node_map.get(path_nodes[i], {})
                        props = nstep.get("properties", {})
                        rel_type = path_rels[i - 1].get("type") if i > 0 else None
                        step_desc = f"Step {i + 1}: Access {props.get('name', path_nodes[i])} via {rel_type}" if rel_type else f"Entrypoint: {props.get('name', path_nodes[i])}"
                        steps.append(AttackPathStep(
                            node_id=path_nodes[i],
                            node_name=props.get("name", path_nodes[i]),
                            node_label=nstep.get("labels", ["Asset"])[0],
                            relationship=rel_type,
                            step_description=step_desc
                        ))
                    
                    graph_nodes = [GraphNode(id=nid, label=self.node_map[nid]["labels"][0], labels=self.node_map[nid]["labels"], properties=self.node_map[nid]["properties"]) for nid in path_nodes]
                    graph_edges = [GraphEdge(id=r["id"], source=r["source"], target=r["target"], type=r["type"], properties=r["properties"]) for r in path_rels]
                    
                    src_name = self.node_map[src]["properties"].get("name", src)
                    dst_name = self.node_map[dst]["properties"].get("name", dst)
                    
                    results.append(AttackPathResult(
                        path_id=f"path-{path_counter}",
                        source_name=src_name,
                        target_name=dst_name,
                        hop_count=len(path_rels),
                        threat_score=round(max(85.0, 100.0 - (len(path_rels) * 2.5)), 1),
                        steps=steps,
                        nodes=graph_nodes,
                        edges=graph_edges,
                        cypher_query=f"MATCH p = (src:{self.node_map[src]['labels'][0]} {{id: '{src}'}})-[*1..5]->(dst:{self.node_map[dst]['labels'][0]} {{id: '{dst}'}}) RETURN p"
                    ))
                    path_counter += 1

        results.sort(key=lambda x: x.hop_count)
        return results

    def _dfs_paths(self, current: str, target: str, max_hops: int, visited_nodes: Optional[Set] = None) -> List:
        if visited_nodes is None:
            visited_nodes = set()
        if current == target:
            return [([current], [])]
        if max_hops <= 0:
            return []

        paths = []
        visited_nodes.add(current)
        
        for rel in self.outgoing.get(current, []):
            nxt = rel["target"]
            if nxt not in visited_nodes:
                sub_paths = self._dfs_paths(nxt, target, max_hops - 1, visited_nodes.copy())
                for sub_nodes, sub_rels in sub_paths:
                    paths.append(([current] + sub_nodes, [rel] + sub_rels))
        
        return paths

    def calculate_blast_radius(self, origin_id: str, max_hops: int = 3) -> BlastRadiusResult:
        if origin_id not in self.node_map:
            origin_id = "iam-role-cross-account-db"
        
        origin = self.node_map[origin_id]
        tiers = {1: set(), 2: set(), 3: set()}
        visited = {origin_id}
        queue = [(origin_id, 0)]
        collected_edges = []

        while queue:
            curr_id, depth = queue.pop(0)
            if depth >= max_hops:
                continue
            for rel in self.outgoing.get(curr_id, []) + self.incoming.get(curr_id, []):
                nbh = rel["target"] if rel["source"] == curr_id else rel["source"]
                if rel not in collected_edges:
                    collected_edges.append(rel)
                if nbh not in visited:
                    visited.add(nbh)
                    next_depth = depth + 1
                    if next_depth <= 3:
                        tiers[next_depth].add(nbh)
                    queue.append((nbh, next_depth))

        t1 = [GraphNode(id=nid, label=self.node_map[nid]["labels"][0], labels=self.node_map[nid]["labels"], properties=self.node_map[nid]["properties"]) for nid in tiers[1]]
        t2 = [GraphNode(id=nid, label=self.node_map[nid]["labels"][0], labels=self.node_map[nid]["labels"], properties=self.node_map[nid]["properties"]) for nid in tiers[2]]
        t3 = [GraphNode(id=nid, label=self.node_map[nid]["labels"][0], labels=self.node_map[nid]["labels"], properties=self.node_map[nid]["properties"]) for nid in tiers[3]]
        
        all_affected = tiers[1] | tiers[2] | tiers[3]
        crown_jewels = [GraphNode(id=nid, label=self.node_map[nid]["labels"][0], labels=self.node_map[nid]["labels"], properties=self.node_map[nid]["properties"]) for nid in all_affected if self.node_map[nid]["properties"].get("is_crown_jewel")]
        
        graph_nodes = [GraphNode(id=nid, label=self.node_map[nid]["labels"][0], labels=self.node_map[nid]["labels"], properties=self.node_map[nid]["properties"]) for nid in visited]
        graph_edges = [GraphEdge(id=r["id"], source=r["source"], target=r["target"], type=r["type"], properties=r["properties"]) for r in collected_edges]
        
        return BlastRadiusResult(
            origin_node_id=origin_id,
            origin_name=origin["properties"].get("name", origin_id),
            total_impacted_assets=len(all_affected),
            compromise_tier_1=t1,
            compromise_tier_2=t2,
            compromise_tier_3=t3,
            threatened_crown_jewels=crown_jewels,
            graph=GraphData(nodes=graph_nodes, edges=graph_edges),
            cypher_query=f"MATCH (origin {{id: '{origin_id}'}})-[r*1..{max_hops}]-(affected) RETURN origin, r, affected"
        )

    def get_chokepoints(self) -> List[ChokepointItem]:
        all_paths = self.find_attack_paths(max_hops=5)
        node_hits_x_paths = {}
        for p in all_paths:
            for step in p.steps[1:-1]:
                node_hits_x_paths[step.node_id] = node_hits_x_paths.get(step.node_id, 0) + 1

        chokepoints_list = []
        for nid, hits in node_hits_x_paths.items():
            node = self.node_map.get(nid)
            if not node:
                continue
            props = node["properties"]
            rec = "Enforce Least Privilege & Add Conditional MFA"
            if "KMSKey" in node["labels"]:
                rec = "Rotate KMS Master Key & Restrict Decrypt Policy to Specific Roles"
            elif "Compute" in node["labels"]:
                rec = "Apply Immediate Security Patch & Isolate Subnet Ingress"
            risk_red = min(98.0, round((hits / max(1, len(all_paths))) * 85.0 + 15.0, 1))
            
            chokepoints_list.append(ChokepointItem(
                node_id=nid,
                name=props.get("name", nid),
                type=props.get("type", node["labels"][0]),
                labels=node["labels"],
                paths_intercepted=hits,
                exposed_entrypoints=2,
                threatened_targets=2,
                remediation_recommendation=rec,
                estimated_risk_reduction_pct=risk_red
            ))

        chokepoints_list.sort(key=lambda x: x.paths_intercepted, reverse=True)
        return chokepoints_list

_mock_engine = InMemoryGraphEngine()

def run_mock_query(cypher_query: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    if params is None:
        params = {}
    q = cypher_query.upper()
    if "COUNT(" in q or "COUNT(N)" in q:
        return [{"total_nodes": len(NODES), "total_relationships": len(RELATIONSHIPS)}]
    if "(SOURCE)-[*1..5]->(TARGET)" in q or "PATH" in q:
        paths = _mock_engine.find_attack_paths()
        return [{"path_id": p.path_id, "hops": p.hop_count, "source": p.source_name, "target": p.target_name} for p in paths]
    if "BLAST" in q or "RADIUS" in q or "(COMPROMISED)-[" in q:
        br = _mock_engine.calculate_blast_radius("actor-apt29")
        return [{"origin": br.origin_name, "affected_count": br.total_impacted_assets}]
    return [{"message": "Cypher query executed successfully in AegisGraph mock engine.", "nodes_affected": len(NODES)}]
