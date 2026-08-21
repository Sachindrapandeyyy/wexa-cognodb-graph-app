import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  Clock, 
  Sparkles, 
  Code2,
  Table,
  AlertCircle
} from 'lucide-react';
import { CypherCatalogItem, CypherQueryResult } from '../types/graph';
import { fetchCypherCatalog, executeCypherQuery } from '../services/api';

export const CypherConsole: React.FC = () => {
  const [catalog, setCatalog] = useState<CypherCatalogItem[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<CypherCatalogItem | null>(null);
  const [queryText, setQueryText] = useState<string>('MATCH (n) RETURN labels(n) AS label, count(n) AS count LIMIT 10');
  const [paramsText, setParamsText] = useState<string>('{}');
  const [result, setResult] = useState<CypherQueryResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

  useEffect(() => {
    fetchCypherCatalog()
      .then((data: CypherCatalogItem[]) => {
        setCatalog(data);
        if (data.length > 0) {
          setSelectedPreset(data[0]);
          setQueryText(data[0].cypher);
          setParamsText(JSON.stringify(data[0].parameters || {}, null, 2));
        }
      })
      .catch((err: any) => console.error('Failed to fetch Cypher catalog:', err));
  }, []);

  const handleSelectPreset = (preset: CypherCatalogItem) => {
    setSelectedPreset(preset);
    setQueryText(preset.cypher);
    setParamsText(JSON.stringify(preset.parameters || {}, null, 2));
    setError(null);
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setError(null);

    let parsedParams = {};
    try {
      if (paramsText.trim()) {
        parsedParams = JSON.parse(paramsText);
      }
    } catch (e: any) {
      setError(`Invalid JSON parameters: ${e.message}`);
      setIsExecuting(false);
      return;
    }

    try {
      const res = await executeCypherQuery(queryText, parsedParams);
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Execution error');
    } finally {
      setIsExecuting(false);
    }
  };

  const columns = result?.records && result.records.length > 0 ? Object.keys(result.records[0]) : [];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="w-4 h-4 text-indigo-600" />
            <h3 className="font-extrabold text-base text-slate-900">openCypher Playground & Bolt Console</h3>
          </div>
          <p className="text-xs text-slate-500">
            Execute parameterized graph queries against CognoDB Cloud over Bolt 5.0-5.4.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Table
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              viewMode === 'json' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            JSON
          </button>
        </div>
      </div>

      {/* Preset Queries Horizontal Scroll */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Presets & Benchmarks</label>
        <div className="flex flex-wrap gap-2">
          {catalog.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all text-left ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {preset.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Why Graph Wins Callout */}
      {selectedPreset?.why_graph_wins && (
        <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-purple-950">Why Graph Wins over SQL:</span>
            <p className="text-xs text-purple-900 leading-relaxed">
              {selectedPreset.why_graph_wins}
            </p>
          </div>
        </div>
      )}

      {/* Query & Parameter Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Cypher Query Editor */}
        <div className="lg:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">Cypher Statement:</label>
          <textarea
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            rows={5}
            className="w-full bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700 leading-relaxed resize-none"
            placeholder="MATCH (n) RETURN n LIMIT 25"
          />
        </div>

        {/* Parameters Editor */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700">Query Parameters (JSON):</label>
          <textarea
            value={paramsText}
            onChange={(e) => setParamsText(e.target.value)}
            rows={5}
            className="w-full bg-slate-50 text-slate-800 font-mono text-xs p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 leading-relaxed resize-none"
            placeholder='{ "key": "value" }'
          />
        </div>
      </div>

      {/* Run Action Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleExecute}
          disabled={isExecuting}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>{isExecuting ? 'Executing over Bolt...' : 'Execute openCypher'}</span>
        </button>

        {result && (
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <strong>{result.execution_time_ms} ms</strong>
            </span>
            <span>?</span>
            <span>
              <strong>{result.records?.length || 0}</strong> records returned
            </span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results View */}
      {result && result.records && result.records.length > 0 && (
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Query Output</label>
          
          {viewMode === 'table' ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-200">
                  <tr>
                    {columns.map((col: string) => (
                      <th key={col} className="px-4 py-2.5 font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.records.map((row: any, rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-slate-50/60">
                      {columns.map((col: string) => (
                        <td key={col} className="px-4 py-2 font-mono text-[11px] text-slate-800">
                          {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <pre className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs font-mono overflow-x-auto text-slate-800 max-h-80">
              {JSON.stringify(result.records, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
