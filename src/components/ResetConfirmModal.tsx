import React from 'react';
import { X, RotateCcw, AlertTriangle } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isResetting?: boolean;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isResetting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <RotateCcw className={`w-6 h-6 ${isResetting ? 'animate-spin' : ''}`} />
          </div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Reset Student Database?
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            This will restore the database to the benchmark dataset containing <strong>10 Indian student records</strong>, reset sequence generators to <code className="text-indigo-500 font-mono">1011</code>, and re-initialize sample tables.
          </p>
        </div>

        {/* Warning Badge */}
        <div className="mx-6 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>Any custom records or modifications made during this session will be replaced by the 10 benchmark records.</span>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isResetting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isResetting}
            className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg shadow-sm transition disabled:opacity-50"
          >
            {isResetting ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Database</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
