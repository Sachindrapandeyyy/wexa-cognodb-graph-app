import React, { useState, useEffect } from 'react';
import { Database, Play, Clock, Code, HelpCircle } from 'lucide-react';
import { CypherCatalogItem, CypherQueryResult } from '../types/graph';
import { fetchCypherCatalog, executeCypherQuery } from '../services/api';

export const CypherConsole: React.FC = () => {
  const [catalog, setCatalog] = useState<CypherCatalogItem[]>([]);
  const [selectedQueryId, setSelectedQueryId] = useState<string>('multi-hop-attack-paths');
  const [queryText, setQueryText] = useState<string>('');
  const [paramsText, setParamsText] = useState<string>('{}');
  const [queryResult, setQueryResult] = useState<CypherQueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCypherCatalog().then((items) => {
      setCatalog(items);
      if (items.length > 0) {
        setQueryText(items[0].cypher);
        setParamsText(JSON.stringify(items[0].parameters, null, 2));
      }
    });
  }, []);

  const handleSelectPreset = (item: CypherCatalogItem) => {
    setSelectedQueryId(item.id);
    setQueryText(item.cypher);
    setParamsText(JSON.stringify(item.parameters, null, 2));
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setErrorMessage(null);
    try {
      let parsedParams = {};
      if (paramsText.trim()) {
        parsedParams = JSON.parse(paramsText);
      }
      const res = await executeCypherQuery(queryText, parsedParams);
      setQueryResult(res);
    } catch (e: any) {
      setErrorMessage(e.message || 'Execution error');
    } finally {
      setIsExecuting(false);
    }
  };

  const activePreset = catalog.find((c) => c.id === selectedQueryId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      <div className="lg:col-span-4 flex flex-col bg-cyber-card border border-cyber-cardBorder rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-cyber-cardBorder bg-slate-900/50">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-400" />
            openCypher Query Catalog
          </h2>
          <p className="text-xs text-slate-400">Pre-built multi-hop & graph-native queries</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {catalog.map((item) => {
            const isSelected = selectedQueryId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectPreset(item)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500/50 shadow-neon-cyan'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200">{item.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="bg-cyber-card border border-cyber-cardBorder rounded-2xl p-4 flex flex-col gap-3">
          {activePreset && (
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Why Graph Databases Win Here Over SQL</span>
              </div>
              <p className="text-slate-400 text-[11px]">{activePreset.why_graph_wins}</p>
            </div>
          )}

          <div>
            <label className="text-[11px] font-mono text-slate-400 block mb-1">OPENCYPHER STATEMENT</label>
            <textarea
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              rows={4}
              className="w-full bg-[#05070c] border border-slate-800 text-cyan-300 font-mono text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <label className="text-[10px] font-mono text-slate-500 block mb-1">QUERY PARAMETERS (JSON)</label>
              <input
                type="text"
                value={paramsText}
                onChange={(e) => setParamsText(e.target.value)}
                className="w-full bg-[#05070c] border border-slate-800 text-slate-200 font-mono text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="self-end px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-neon-cyan transition-all"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isExecuting ? 'Executing...' : 'Run openCypher'}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 bg-cyber-card border border-cyber-cardBorder rounded-2xl p-4 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-cyber-cardBorder">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <Code className="h-3.5 w-3.5 text-cyan-400" />
              Query Results & Diagnostics
            </h3>
            {queryResult && (
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3 text-cyan-400" />
                {queryResult.execution_time_ms} ms
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pt-3">
            {errorMessage ? (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-red-400 text-xs font-mono">
                {errorMessage}
              </div>
            ) : queryResult ? (
              <div className="space-y-2">
                <pre className="p-3 rounded-xl bg-[#05070c] border border-slate-800/80 text-cyan-300 font-mono text-xs overflow-x-auto">
                  {JSON.stringify(queryResult.records, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-slate-500 text-xs font-mono">
                Click "Run openCypher" to execute the query against CognoDB.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
