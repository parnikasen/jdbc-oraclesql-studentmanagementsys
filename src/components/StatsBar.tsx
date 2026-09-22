import React from 'react';
import { Users, GraduationCap, Building2, Activity, Database } from 'lucide-react';
import { Student } from '../types';

interface StatsBarProps {
  students: Student[];
  totalQueries: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({ students, totalQueries }) => {
  const total = students.length;

  const avgCgpa =
    total > 0
      ? (students.reduce((acc, s) => acc + (Number(s.cgpa) || 0), 0) / total).toFixed(2)
      : '0.00';

  const departmentsCount = new Set(students.map((s) => s.department)).size;

  const activeCount = students.filter((s) => s.status === 'ACTIVE').length;
  const activePercent = total > 0 ? Math.round((activeCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {/* Total Students */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Students</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{total}</p>
        </div>
      </div>

      {/* Average CGPA */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Average CGPA</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{avgCgpa}</p>
            <span className="text-xs text-slate-400">/ 10.0</span>
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Departments</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{departmentsCount}</p>
        </div>
      </div>

      {/* Active Rate */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Rate</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {activePercent}% <span className="text-xs font-normal text-slate-400">({activeCount})</span>
          </p>
        </div>
      </div>

      {/* Oracle SQL Queries Executed */}
      <div className="col-span-2 md:col-span-1 bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">SQL Queries Executed</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{totalQueries}</p>
        </div>
      </div>
    </div>
  );
};
