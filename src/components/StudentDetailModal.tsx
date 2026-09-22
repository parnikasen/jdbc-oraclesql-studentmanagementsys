import React from 'react';
import { X, Edit2, Trash2, Database, Calendar, Mail, Phone, MapPin, User, GraduationCap, Shield } from 'lucide-react';
import { Student } from '../types';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
              {student.firstName[0]}
              {student.lastName[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {student.firstName} {student.lastName}
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono">
                  {student.rollNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {student.department} • Semester {student.semester}
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Cumulative GPA</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                {Number(student.cgpa).toFixed(2)}
              </p>
              <span className="text-[10px] text-slate-400">Scale of 10.0</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Enrollment Status</p>
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider">
                {student.status.replace('_', ' ')}
              </p>
              <span className="text-[10px] text-slate-400">Official Register</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/60 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Gender / DOB</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {student.gender}
              </p>
              <span className="text-[10px] text-slate-400">{student.dateOfBirth?.split('T')[0]}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono text-xs truncate">{student.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono text-xs">{student.phone || 'No phone recorded'}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 sm:col-span-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs">{student.address || 'Address not registered'}</span>
              </div>
            </div>
          </div>

          {/* Guardian Details */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Guardian / Emergency</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-medium">{student.guardianName || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono text-xs">{student.guardianPhone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Oracle DB Internal Record Metadata */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>Oracle Database 19c Row Metadata</span>
            </div>

            <div className="p-3 bg-slate-900 text-slate-300 rounded-xl font-mono text-xs space-y-1.5 border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500">PRIMARY KEY (STUDENT_ID):</span>
                <span className="text-emerald-400 font-bold">{student.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ORACLE ROWID:</span>
                <span className="text-amber-400">{student.rowId || 'AAAS6uAAFAAAABBAAA'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CREATED_AT (SYSTIMESTAMP):</span>
                <span className="text-slate-300">{student.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UPDATED_AT (SYSTIMESTAMP):</span>
                <span className="text-slate-300">{student.updatedAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onDelete(student);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Record</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
