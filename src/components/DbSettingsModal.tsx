import React, { useState } from 'react';
import { X, Settings, Zap, CheckCircle2, Database, Shield, Server, RefreshCw } from 'lucide-react';
import { OracleDBConfig } from '../types';

interface DbSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OracleDBConfig | null;
  onSaveConfig: (updated: Partial<OracleDBConfig>) => Promise<void>;
  onPing: () => Promise<void>;
  isPinging?: boolean;
}

export const DbSettingsModal: React.FC<DbSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onPing,
  isPinging = false,
}) => {
  const [formData, setFormData] = useState({
    url: config?.url || 'jdbc:oracle:thin:@localhost:1521:XE',
    username: config?.username || 'STUDENT_ADMIN',
    driver: config?.driver || 'oracle.jdbc.OracleDriver',
    schema: config?.schema || 'STUDENT_DB',
    poolSize: config?.poolSize || 10,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveConfig(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Oracle Database & JDBC Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure connection profile and connection pool parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Status & Ping Bar */}
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                  Oracle Connection Active
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Latency: {config?.lastPingMs || 14}ms • Oracle 19c Enterprise Edition
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onPing}
              disabled={isPinging}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-900/60 hover:bg-emerald-200 transition"
            >
              <Zap className={`w-3.5 h-3.5 ${isPinging ? 'animate-bounce' : ''}`} />
              <span>{isPinging ? 'Pinging...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* Driver Class */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Oracle JDBC Driver Class
            </label>
            <input
              type="text"
              value={formData.driver}
              onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Default: oracle.jdbc.OracleDriver (Type 4 Thin Driver)</p>
          </div>

          {/* JDBC URL */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              JDBC Connection URL
            </label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Format: jdbc:oracle:thin:@[HOST]:[PORT]:[SID] or service name</p>
          </div>

          {/* Username & Schema */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Database User
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Default Schema
              </label>
              <input
                type="text"
                value={formData.schema}
                onChange={(e) => setFormData({ ...formData, schema: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Connection Pool Size */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Max Pool Connections
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.poolSize}
                onChange={(e) => setFormData({ ...formData, poolSize: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Active Connections
              </label>
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900/80 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                {config?.activeConnections || 1} active / {config?.poolSize || 10} pool
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Oracle JDBC configuration updated and validated successfully.</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSaving ? 'Updating...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
