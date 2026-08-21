import React, { useState } from 'react';
import { X, Database, ExternalLink, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ConnectionStatus } from '../types/graph';
import { testConnection } from '../services/api';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionStatus: ConnectionStatus | null;
  onConnectionUpdated: () => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  connectionStatus,
  onConnectionUpdated,
}) => {
  const [uri, setUri] = useState<string>(connectionStatus?.uri || 'bolt+s://<instance-id>.databases.cognodb.cloud');
  const [user, setUser] = useState<string>('cognodb');
  const [password, setPassword] = useState<string>('');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await testConnection(uri, user, password);
      if (res.success) {
        setTestResult({ success: true, message: res.message || 'Connected to CognoDB Cloud successfully!' });
        onConnectionUpdated();
      } else {
        setTestResult({ success: false, message: res.message || 'Connection failed' });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection failed'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">CognoDB Cloud Configuration</h3>
              <p className="text-xs text-slate-500">Bolt 5.0-5.4 Managed Graph Connection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 60-Second Setup Info Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Get a Free CognoDB Instance (60s)</span>
            <a
              href="https://console.cognodb.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
            >
              <span>console.cognodb.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            CognoDB Cloud free tier provides 0.5 vCPU, 256MB RAM, and Bolt 5.0-5.4 protocol support with no credit card required.
          </p>
        </div>

        {/* Credential Form */}
        <div className="flex flex-col gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-700">Bolt URI:</label>
            <input
              type="text"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              placeholder="bolt+s://<instance-id>.databases.cognodb.cloud"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 font-mono text-[11px]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-700">Username:</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="cognodb"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 font-mono text-[11px]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-slate-700">Instance Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Generated password from CognoDB console"
              className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Test Connection Output */}
        {testResult && (
          <div className={`p-3.5 rounded-2xl border flex items-center gap-2.5 text-xs ${
            testResult.success 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium leading-tight">{testResult.message}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full text-xs font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isTesting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{isTesting ? 'Verifying Bolt...' : 'Test Connection'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
