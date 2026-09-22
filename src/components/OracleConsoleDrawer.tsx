import React, { useState } from 'react';
import { X, Terminal, Trash2, Copy, Check, Filter, RefreshCw, Zap, Database } from 'lucide-react';
import { OracleSQLLog } from '../types';

interface OracleConsoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: OracleSQLLog[];
  onClearLogs: () => void;
  onRefreshLogs: () => void;
  onPing: () => void;
  isPinging?: boolean;
}

export const OracleConsoleDrawer: React.FC<OracleConsoleDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
  onRefreshLogs,
  onPing,
  isPinging = false,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'ALL') return true;
    return log.queryType === filterType;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getQueryBadge = (type: OracleSQLLog['queryType']) => {
    switch (type) {
      case 'INSERT':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'UPDATE':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'DELETE':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'SELECT':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'CONNECT':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'COMMIT':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 text-slate-200 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Oracle JDBC Query Console</span>
                <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  LIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Real-time stream of SQL queries, execution latency & commits
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Ping Test */}
            <button
              onClick={onPing}
              disabled={isPinging}
              title="Ping Oracle database (SELECT 1 FROM DUAL)"
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              <Zap className={`w-3.5 h-3.5 text-amber-400 ${isPinging ? 'animate-bounce' : ''}`} />
              <span>Ping DB</span>
            </button>

            {/* Refresh */}
            <button
              onClick={onRefreshLogs}
              title="Refresh log stream"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Clear */}
            <button
              onClick={onClearLogs}
              title="Clear query logs"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center space-x-1.5 text-xs overflow-x-auto">
          {['ALL', 'INSERT', 'UPDATE', 'DELETE', 'SELECT', 'CONNECT'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold transition ${
                filterType === tab
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
          <span className="text-[11px] text-slate-500 font-mono ml-auto">
            {filteredLogs.length} events
          </span>
        </div>

        {/* Logs Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="py-20 text-center text-slate-500 space-y-2">
              <Database className="w-8 h-8 mx-auto opacity-30" />
              <p>No query executions recorded yet.</p>
              <p className="text-[11px]">Perform student insert, update, or delete operations to view the JDBC stream.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition"
              >
                {/* Meta Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getQueryBadge(
                        log.queryType
                      )}`}
                    >
                      {log.queryType}
                    </span>
                    <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px]">
                    <span className="text-emerald-400 font-bold">{log.executionTimeMs}ms</span>
                    {log.rowsAffected !== undefined && (
                      <span className="text-slate-400">
                        {log.rowsAffected} row{log.rowsAffected === 1 ? '' : 's'}
                      </span>
                    )}
                    <button
                      onClick={() => handleCopy(log.id, log.sql)}
                      title="Copy SQL statement"
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                      {copiedId === log.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* SQL Code Block */}
                <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto p-2 bg-slate-900/80 rounded border border-slate-800/50 whitespace-pre-wrap">
                  {log.sql}
                </pre>

                {/* Bound Parameters if applicable */}
                {log.params && log.params.length > 0 && (
                  <div className="mt-2 text-[10px] text-slate-400">
                    <span className="text-slate-500">Bound JDBC Parameters: </span>
                    <span className="text-indigo-300 font-mono">
                      [{log.params.map((p) => (typeof p === 'string' ? `"${p}"` : String(p))).join(', ')}]
                    </span>
                  </div>
                )}

                {/* Message */}
                {log.message && (
                  <p className="mt-1 text-[10px] text-slate-500 italic">
                    ↳ {log.message}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Driver: <span className="text-slate-300">oracle.jdbc.OracleDriver</span></span>
          <span className="text-emerald-400">Auto-commit: Disabled (Explicit Transactional COMMIT)</span>
        </div>
      </div>
    </div>
  );
};
