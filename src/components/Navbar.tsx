import React from 'react';
import { Database, Plus, Code2, Settings2, RefreshCw } from 'lucide-react';
import { OracleDBConfig } from '../types';

interface NavbarProps {
  config: OracleDBConfig | null;
  logCount: number;
  onOpenAddModal: () => void;
  onOpenConsole: () => void;
  onOpenJdbcCode: () => void;
  onOpenSettings: () => void;
  onRefreshData: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  logCount,
  onOpenAddModal,
  onOpenConsole,
  onOpenJdbcCode,
  onOpenSettings,
  onRefreshData,
  isRefreshing = false,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-inner">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">Student Management System</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Refresh Button */}
            <button
              id="btn-refresh-students"
              onClick={onRefreshData}
              title="Refresh database records"
              disabled={isRefreshing}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>

            {/* Java JDBC Code & DDL */}
            <button
              id="btn-open-jdbc-code"
              onClick={onOpenJdbcCode}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              <Code2 className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Oracle JDBC Code</span>
            </button>

            {/* Connection Settings */}
            <button
              id="btn-open-db-settings"
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition"
              title="Database connection settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Add Student CTA */}
            <button
              id="btn-add-student-header"
              onClick={onOpenAddModal}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm hover:shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
