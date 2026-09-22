import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, CheckCircle2, Database } from 'lucide-react';

interface OracleJdbcCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: Record<string, string>;
  ddlSchema: string;
}

export const OracleJdbcCodeModal: React.FC<OracleJdbcCodeModalProps> = ({
  isOpen,
  onClose,
  files,
  ddlSchema,
}) => {
  const allTabs = [
    { id: 'schema.sql', label: 'schema.sql (Oracle DDL)', lang: 'sql', content: ddlSchema },
    { id: 'DBConnection.java', label: 'DBConnection.java (JDBC)', lang: 'java', content: files['DBConnection.java'] || '' },
    { id: 'StudentDAO.java', label: 'StudentDAO.java (CRUD)', lang: 'java', content: files['StudentDAO.java'] || '' },
    { id: 'Student.java', label: 'Student.java (Model)', lang: 'java', content: files['Student.java'] || '' },
    { id: 'StudentServlet.java', label: 'StudentServlet.java (REST)', lang: 'java', content: files['StudentServlet.java'] || '' },
  ];

  const [activeTab, setActiveTab] = useState<string>('schema.sql');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeFile = allTabs.find((t) => t.id === activeTab) || allTabs[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([activeFile.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = activeFile.id;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Oracle Database JDBC Source Code & Architecture</span>
              </h2>
              <p className="text-xs text-slate-400">
                Production-grade Java JDBC Data Access Object (DAO) & Oracle DDL scripts
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy File'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="px-6 bg-slate-950/50 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs font-mono">
          {allTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-300 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
          <pre className="whitespace-pre-wrap">{activeFile.content}</pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Target: Oracle 19c Enterprise Edition • Java 11/17/21 • ojdbc8/ojdbc11</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            {activeFile.id} • {activeFile.content.split('\n').length} lines
          </span>
        </div>
      </div>
    </div>
  );
};
