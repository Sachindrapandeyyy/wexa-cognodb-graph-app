import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, ExternalLink, Zap } from 'lucide-react';
import { testConnection } from '../services/api';
import { ConnectionStatus } from '../types/graph';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ConnectionStatus | null;
  onRefreshHealth: () => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefreshHealth,
}) => {
  const [uri, setUri] = useState('bolt+s://your-instance.databases.cognodb.cloud');
  const [user, setUser] = useState('cognodb');
  const [password, setPassword] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testConnection(uri, user, password);
      setTestResult(res);
      if (res.success) {
        onRefreshHealth();
      }
    } catch (e: any) {
      setTestResult({ success: false, message: e.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-cyber-card border border-cyber-cardBorder rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-cyber-cardBorder pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">CognoDB Cloud Configuration</h2>
              <p className="text-xs text-slate-400">Connect to your managed CognoDB instance via Bolt</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-2">
          <div className="flex items-center justify-between font-bold text-cyan-300">
            <span>Free Tier Provisioning in Under 60 Seconds</span>
            <a
              href="https://console.cognodb.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] text-cyan-400 underline hover:text-cyan-300"
            >
              console.cognodb.com <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
            <li>Log in to CognoDB Cloud console (No credit card needed).</li>
            <li>Create a free database instance (<code className="text-cyan-400">c0</code> plan).</li>
            <li>Copy your <code className="text-cyan-400">bolt+s://</code> URI and generated password.</li>
            <li>Add to <code className="text-cyan-400">.env</code> or test live below!</li>
          </ol>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-mono text-[11px] text-slate-400 block mb-1">BOLT URI</label>
            <input
              type="text"
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              placeholder="bolt+s://instance-id.databases.cognodb.cloud"
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[11px] text-slate-400 block mb-1">USERNAME</label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="font-mono text-[11px] text-slate-400 block mb-1">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="????????????"
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>
        </div>

        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              testResult.success
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40'
                : 'bg-red-950/40 text-red-300 border border-red-500/40'
            }`}
          >
            {testResult.success ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{testResult.message}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleTest}
            disabled={isTesting || !password}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>{isTesting ? 'Verifying...' : 'Test Connection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
