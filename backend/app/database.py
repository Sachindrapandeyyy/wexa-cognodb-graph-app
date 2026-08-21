import time
from typing import List, Dict, Any, Optional
from neo4j import GraphDatabase, Driver, Session
from app.config import settings
import logging

neo4j_logger = logging.getLogger('neo4j')
neo4j_logger.setLevel(logging.WARNING)

class GraphService:
    def __init__(self):
        self._driver: Optional[Driver] = None
        self._is_mock: bool = True
        self._last_error: Optional[str] = None
        self._init_connection()

    def _init_connection(self):
        if not settings.COGNODB_URI or not settings.COGNODB_PASSWORD:
            self._is_mock = True
            self._last_error = "CognoDB URI or Password not set in environment."
            return

        try:
            self._driver = GraphDatabase.driver(
                settings.COGNODB_URI,
                auth=(settings.COGNODB_USER, settings.COGNODB_PASSWORD),
                max_connection_lifetime=3600,
                max_connection_pool_size=50,
                connection_acquisition_timeout=4.0
            )
            with self._driver.session(database=settings.COGNODB_DATABASE) as session:
                res = session.run("RETURN 1 AS check")
                rec = res.single()
                if rec and rec["check"] == 1:
                    self._is_mock = False
                    self._last_error = None
        except Exception as e:
            self._is_mock = True
            self._last_error = str(e)

    @property
    def is_mock(self) -> bool:
        return self._is_mock

    @property
    def last_error(self) -> Optional[str]:
        return self._last_error

    def execute_query(self, query_str: str, params: Optional[Dict[str, Any]] = None):
        if params is None:
            params = {}
        if self._is_mock:
            from app.mock_engine import run_mock_query
            return run_mock_query(query_str, params)
        try:
            with self._driver.session(database=settings.COGNODB_DATABASE) as session:
                result = session.run(query_str, params)
                return [record.data() for record in result]
        except Exception as e:
            if settings.DEMO_MODE_FALLBACK:
                from app.mock_engine import run_mock_query
                return run_mock_query(query_str, params)
            raise

    def close(self):
        if self._driver:
            self._driver.close()

graph_service = GraphService()
