import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { StudentTable } from './components/StudentTable';
import { StudentFormModal } from './components/StudentFormModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { OracleConsoleDrawer } from './components/OracleConsoleDrawer';
import { OracleJdbcCodeModal } from './components/OracleJdbcCodeModal';
import { DbSettingsModal } from './components/DbSettingsModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { Toast, ToastMessage } from './components/Toast';
import { api } from './services/api';
import { Student, StudentFormData, OracleSQLLog, OracleDBConfig } from './types';
import { Terminal, Database, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // --- Data State ---
  const [students, setStudents] = useState<Student[]>([]);
  const [logs, setLogs] = useState<OracleSQLLog[]>([]);
  const [config, setConfig] = useState<OracleDBConfig | null>(null);
  const [schemaDdl, setSchemaDdl] = useState<string>('');
  const [jdbcFiles, setJdbcFiles] = useState<Record<string, string>>({});

  // --- Filter & Sorting State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // --- Modals State ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isJdbcCodeOpen, setIsJdbcCodeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // --- Loading & Pending State ---
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- Toast Notifications ---
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Load Initial Data ---
  const loadStudents = useCallback(async () => {
    try {
      setIsLoadingStudents(true);
      const res = await api.getStudents({
        query: searchQuery,
        department: selectedDepartment,
        semester: selectedSemester,
        status: selectedStatus,
        sortField,
        sortOrder,
      });
      setStudents(res.students);
    } catch (err: any) {
      addToast('error', 'Oracle Connection Error', err.message);
    } finally {
      setIsLoadingStudents(false);
    }
  }, [searchQuery, selectedDepartment, selectedSemester, selectedStatus, sortField, sortOrder]);

  const loadLogs = async () => {
    try {
      const data = await api.getOracleLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load Oracle logs', err);
    }
  };

  const loadConfigAndCode = async () => {
    try {
      const [cfg, sch, code] = await Promise.all([
        api.getOracleConfig(),
        api.getOracleSchema(),
        api.getJdbcCode(),
      ]);
      setConfig(cfg);
      setSchemaDdl(sch.ddl);
      setJdbcFiles(code.files);
    } catch (err) {
      console.error('Failed to load Oracle config/code', err);
    }
  };

  useEffect(() => {
    loadStudents();
    loadLogs();
    loadConfigAndCode();
  }, [loadStudents]);

  // Periodic subtle refresh for query logs count
  useEffect(() => {
    const interval = setInterval(loadLogs, 6000);
    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    await Promise.all([loadStudents(), loadLogs(), loadConfigAndCode()]);
    setIsRefreshing(false);
    addToast('info', 'Database Refreshed', 'Synced latest state from Oracle Database via JDBC.');
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: StudentFormData) => {
    setIsSubmittingForm(true);
    try {
      if (formMode === 'create') {
        const res = await api.createStudent(formData);
        addToast(
          'success',
          'Student Inserted Successfully',
          `INSERT INTO STUDENTS (ROLL_NUMBER='${res.student.rollNumber}') - 1 row affected`
        );
      } else if (editingStudent) {
        const res = await api.updateStudent(editingStudent.id, formData);
        addToast(
          'success',
          'Student Updated Successfully',
          `UPDATE STUDENTS SET ... WHERE STUDENT_ID=${editingStudent.id} - 1 row affected`
        );
      }
      setIsFormModalOpen(false);
      await loadStudents();
      await loadLogs();
    } catch (err: any) {
      addToast('error', 'Oracle Transaction Failed', err.message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await api.deleteStudent(deletingStudent.id);
      addToast(
        'success',
        'Record Deleted from Oracle DB',
        `DELETE FROM STUDENTS WHERE STUDENT_ID=${deletingStudent.id} - 1 row affected`
      );
      setDeletingStudent(null);
      await loadStudents();
      await loadLogs();
    } catch (err: any) {
      addToast('error', 'Delete Operation Failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetData = () => {
    setIsResetModalOpen(true);
  };

  const handleResetConfirm = async () => {
    setIsResetting(true);
    try {
      await api.resetStudents();
      addToast('info', 'Database Reset Successful', 'Restored 10 benchmark Indian student records to Oracle DB.');
      await loadStudents();
      await loadLogs();
      setIsResetModalOpen(false);
    } catch (err: any) {
      addToast('error', 'Reset Failed', err.message);
    } finally {
      setIsResetting(false);
    }
  };

  const handlePing = async () => {
    setIsPinging(true);
    try {
      const res = await api.pingOracle();
      if (config) {
        setConfig({ ...config, lastPingMs: res.latencyMs });
      }
      addToast(
        'success',
        'Oracle DB Ping Successful',
        `SELECT 1 FROM DUAL executed in ${res.latencyMs}ms. Connection healthy.`
      );
      await loadLogs();
    } catch (err: any) {
      addToast('error', 'Oracle Ping Failed', err.message);
    } finally {
      setIsPinging(false);
    }
  };

  const handleSaveConfig = async (updated: Partial<OracleDBConfig>) => {
    try {
      const newCfg = await api.updateOracleConfig(updated);
      setConfig(newCfg);
      addToast('success', 'Connection Profile Updated', `Oracle target: ${newCfg.url}`);
      await loadLogs();
    } catch (err: any) {
      addToast('error', 'Failed to update config', err.message);
    }
  };

  const handleClearLogs = async () => {
    try {
      await api.clearOracleLogs();
      await loadLogs();
      addToast('info', 'Logs Cleared', 'Oracle query console history cleared.');
    } catch (err: any) {
      addToast('error', 'Failed to clear logs', err.message);
    }
  };

  const handleExportCsv = () => {
    if (students.length === 0) {
      addToast('info', 'No Data', 'No student records available to export.');
      return;
    }

    const headers = [
      'STUDENT_ID',
      'ROLL_NUMBER',
      'FIRST_NAME',
      'LAST_NAME',
      'EMAIL',
      'PHONE',
      'DEPARTMENT',
      'SEMESTER',
      'CGPA',
      'STATUS',
      'GENDER',
      'DATE_OF_BIRTH',
      'ENROLLMENT_DATE',
      'ADDRESS',
      'GUARDIAN_NAME',
      'GUARDIAN_PHONE',
    ];

    const rows = students.map((s) => [
      s.id,
      `"${s.rollNumber}"`,
      `"${s.firstName}"`,
      `"${s.lastName}"`,
      `"${s.email}"`,
      `"${s.phone || ''}"`,
      `"${s.department}"`,
      s.semester,
      Number(s.cgpa).toFixed(2),
      s.status,
      s.gender,
      s.dateOfBirth?.split('T')[0] || '',
      s.enrollmentDate?.split('T')[0] || '',
      `"${(s.address || '').replace(/"/g, '""')}"`,
      `"${(s.guardianName || '').replace(/"/g, '""')}"`,
      `"${s.guardianPhone || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `oracle_students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'CSV Export Complete', `Exported ${students.length} student records.`);
  };

  const handleExportSql = () => {
    window.open('/api/students/export/sql', '_blank');
    addToast('success', 'Oracle SQL Script Generated', 'DML script downloaded.');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation */}
      <Navbar
        config={config}
        logCount={logs.length}
        onOpenAddModal={handleOpenAddModal}
        onOpenConsole={() => setIsConsoleOpen(true)}
        onOpenJdbcCode={() => setIsJdbcCodeOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefreshData={handleRefreshAll}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Banner with Architecture Context */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                DATABASE-DRIVEN ARCHITECTURE
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Schema: <strong className="text-slate-200">STUDENT_DB</strong> • Table: <strong className="text-slate-200">STUDENTS</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Student Records Management Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Front-end interface communicating with an Oracle Database instance using JDBC. Supports complete record
              insertion, query filtering, updates, and permanent deletion with explicit transaction commits.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setIsConsoleOpen(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 transition"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Inspect Live SQL Logs ({logs.length})</span>
            </button>
          </div>
        </div>

        {/* Statistical Overview Bar */}
        <StatsBar students={students} totalQueries={logs.length} />

        {/* Core Student Records Table */}
        <StudentTable
          students={students}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onViewStudent={(student) => setViewingStudent(student)}
          onEditStudent={handleOpenEditModal}
          onDeleteStudent={(student) => setDeletingStudent(student)}
          onOpenAddModal={handleOpenAddModal}
          onResetData={handleResetData}
          onExportCsv={handleExportCsv}
          onExportSql={handleExportSql}
          isLoading={isLoadingStudents}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Oracle JDBC Driver: Type 4 Thin Driver (ojdbc) • Connection Pool Active</span>
          </div>
          <p>© {new Date().getFullYear()} Student Management System • Front-end to Oracle Database Bridge</p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingStudent}
        mode={formMode}
        isSubmitting={isSubmittingForm}
      />

      <StudentDetailModal
        student={viewingStudent}
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        onEdit={(s) => {
          setViewingStudent(null);
          handleOpenEditModal(s);
        }}
        onDelete={(s) => {
          setViewingStudent(null);
          setDeletingStudent(s);
        }}
      />

      <DeleteConfirmModal
        student={deletingStudent}
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      <OracleConsoleDrawer
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        logs={logs}
        onClearLogs={handleClearLogs}
        onRefreshLogs={loadLogs}
        onPing={handlePing}
        isPinging={isPinging}
      />

      <OracleJdbcCodeModal
        isOpen={isJdbcCodeOpen}
        onClose={() => setIsJdbcCodeOpen(false)}
        files={jdbcFiles}
        ddlSchema={schemaDdl}
      />

      <DbSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        onPing={handlePing}
        isPinging={isPinging}
      />

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetConfirm}
        isResetting={isResetting}
      />

      {/* Toast Feed */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
