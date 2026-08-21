import argparse
import sys
import time
from neo4j import GraphDatabase
from app.seed_data import NODES, RELATIONSHIPS, generate_cypher_seed_queries
from app.config import settings

def run_seed(uri: str, user: str, password: str, database: str = "neo4j"):
    print("=" * 70)
    print("          AEGISGRAPH - COGNODB GRAPH DATA SEEDER")
    print("=" * 70)
    print(f"[*] Connecting to CognoDB instance: {uri} (User: {user})")
    
    try:
        driver = GraphDatabase.driver(
            uri,
            auth=(user, password),
            max_connection_lifetime=3600,
            connection_acquisition_timeout=8.0
        )
        
        with driver.session(database=database) as session:
            print("[+] Verifying database connectivity...")
            res = session.run("RETURN 1 AS on").single()
            if not res or res["on"] != 1:
                raise ConnectionError("Unable to receive acknowledgement from CognoDB.")
            print("[+] Connection established successfully!\n")

            statements = generate_cypher_seed_queries()
            print(f"[-] Executing {len(statements)} parameterized openCypher statements...")

            start_time = time.time()
            for i, stmt in enumerate(statements, 1):
                session.run(stmt["query"], stmt["params"])
                if i % max(1, len(statements) // 5) == 0 or i == len(statements):
                    print(f"   -> Progress: {i} of {len(statements)} statements written.")

            duration = time.time() - start_time
            print(f"\n[+] Seeding completed in {duration:.2f}s !\n")

            print("-" * 70)
            print("VERIFICATION & STATISTICS")
            print("-" * 70)
            
            nodes_cnt = session.run("MATCH (n) RETURN count(n) AS c").single()["c"]
            rels_cnt = session.run("MATCH ()-[r]->() RETURN count(r) AS c").single()["c"]
            print(f"[+] Total Nodes Created:          {nodes_cnt}")
            print(f"[+] Total Relationships Created: {rels_cnt}")
            
            path_check = session.run("""
                MATCH p = (src:Attacker {id: 'actor-apt29'})-[*1..5]->(data:DataAsset)
                RETURN count(p) AS path_count
            """).single()
            print(f"[+] Multi-Hop Attack Vectors:    {path_check['path_count']} discovered")
            print("=" * 70)
            print("[SUCCESS] CognoDB database is fully populated and ready for AegisGraph!\n")

        driver.close()

    except Exception as e:
        print(f"\n[ERROR] Could not seed CognoDB Cloud database: {str(e)}")
        print("Please verify your COGNODB_URI and COGNODB_PASSWORD in your .env file.")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Seed CognoDB instance with AegisGraph Cloud Attack Dataset"
    )
    parser.add_argument("--uri", default=settings.COGNODB_URI, help="CognoDB Bolt URI")
    parser.add_argument("--user", default=settings.COGNODB_USER, help="CognoDB Username")
    parser.add_argument("--password", default=settings.COGNODB_PASSWORD, help="CognoDB Password")
    parser.add_argument("--database", default=settings.COGNODB_DATABASE, help="CognoDB Database Name")

    args = parser.parse_args()
    if not args.uri or not args.password:
        print("[ERROR] Missing COGNODB_URI or COGNODB_PASSWORD.")
        print("Example: python seed.py --uri bolt+s://your-instance.databases.cognodb.cloud --password YOUR_PASS")
        sys.exit(1)
    run_seed(args.uri, args.user, args.password, args.database)
