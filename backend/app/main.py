from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
import os

from app.routes import graph, attack_paths, blast_radius, chokepoints, health, cypher
from app.config import settings
from app.database import graph_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[AegisGraph] FastAPI Server initialized.")
    if graph_service.is_mock:
        print("[AegisGraph] Running in Simulated Graph Demo Mode.")
    else:
        print("[AegisGraph] Connected to CognoDB Bolt Engine.")
    yield
    graph_service.close()

app = FastAPI(
    title="AegisGraph API",
    description="Cloud Security Attack Path & Blast Radius Graph Intelligence Platform backed by CognoDB",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(graph.router)
app.include_router(attack_paths.router)
app.include_router(blast_radius.router)
app.include_router(chokepoints.router)
app.include_router(health.router)
app.include_router(cypher.router)

@app.get("/api/info")
def api_info():
    return {
        "name": "AegisGraph API",
        "version": "1.0.0",
        "description": "Cloud Attack Path & IAM Blast Radius Engine for CognoDB",
        "docs": "/docs",
        "health": "/api/health",
        "status": "COGNODB_CLOUD_CONNECTED" if not graph_service.is_mock else "FALLBACK_DEMO_MODE"
    }

# Mount static frontend if built
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(dist_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
