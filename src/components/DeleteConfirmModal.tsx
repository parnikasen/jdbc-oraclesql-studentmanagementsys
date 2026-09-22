import React from 'react';
import { AlertTriangle, Trash2, X, Terminal } from 'lucide-react';
import { Student } from '../types';

interface DeleteConfirmModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  student,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Student Record
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Are you sure you want to permanently remove this student record from the Oracle Database?
              </p>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200">
              <span>{student.firstName} {student.lastName}</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">{student.rollNumber}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">{student.department} • Semester {student.semester}</p>
          </div>

          {/* Oracle SQL Query Execution Preview */}
          <div className="mt-4">
            <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <Terminal className="w-3.5 h-3.5 text-rose-500" />
              <span>Target Oracle SQL Statement</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg text-[11px] font-mono text-rose-400 border border-slate-800">
              <p>DELETE FROM STUDENTS</p>
              <p>WHERE STUDENT_ID = {student.id};</p>
              <p className="text-slate-500">COMMIT;</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-delete"
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isDeleting ? 'Deleting via JDBC...' : 'Confirm Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
