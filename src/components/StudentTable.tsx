import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  FileCode,
  RotateCcw,
  Eye,
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  UserCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Student } from '../types';

interface StudentTableProps {
  students: Student[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  selectedSemester: string;
  onSemesterChange: (sem: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onOpenAddModal: () => void;
  onResetData: () => void;
  onExportCsv: () => void;
  onExportSql: () => void;
  isLoading?: boolean;
}

const DEPARTMENTS = [
  'ALL',
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Information Technology',
  'Civil Engineering',
  'Data Science',
  'Business Administration',
];

const SEMESTERS = ['ALL', '1', '2', '3', '4', '5', '6', '7', '8'];

const STATUSES = ['ALL', 'ACTIVE', 'ON_LEAVE', 'GRADUATED', 'SUSPENDED'];

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedSemester,
  onSemesterChange,
  selectedStatus,
  onStatusChange,
  sortField,
  sortOrder,
  onSortChange,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onOpenAddModal,
  onResetData,
  onExportCsv,
  onExportSql,
  isLoading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Pagination calculation
  const totalPages = Math.ceil(students.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = students.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            Active
          </span>
        );
      case 'GRADUATED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60">
            <GraduationCap className="w-3 h-3 mr-1" />
            Graduated
          </span>
        );
      case 'ON_LEAVE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60">
            On Leave
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800/60">
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  const getCgpaBadge = (cgpa: number) => {
    let colorClasses = 'text-slate-700 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 border-slate-200';
    if (cgpa >= 9.0) {
      colorClasses = 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800';
    } else if (cgpa >= 8.0) {
      colorClasses = 'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800';
    } else if (cgpa >= 7.0) {
      colorClasses = 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800';
    } else {
      colorClasses = 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800';
    }

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-bold border ${colorClasses}`}>
        {Number(cgpa).toFixed(2)}
      </span>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 ml-1 inline" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ml-1 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ml-1 inline" />
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
      {/* Control & Filter Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700/80 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-students"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, roll number, email, or dept..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Quick Actions (Export CSV, SQL Dump, Reset DB) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-export-csv"
              onClick={onExportCsv}
              title="Export students table as CSV"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              id="btn-export-sql-dump"
              onClick={onExportSql}
              title="Download Oracle SQL INSERT script"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-500" />
              <span>Oracle SQL Dump</span>
            </button>

            <button
              id="btn-reset-db"
              onClick={onResetData}
              title="Restore standard benchmark students dataset"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by:</span>
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-1">
            <label htmlFor="select-dept" className="text-slate-600 dark:text-slate-400">Department:</label>
            <select
              id="select-dept"
              value={selectedDepartment}
              onChange={(e) => {
                onDepartmentChange(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'ALL' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div className="flex items-center space-x-1">
            <label htmlFor="select-sem" className="text-slate-600 dark:text-slate-400">Semester:</label>
            <select
              id="select-sem"
              value={selectedSemester}
              onChange={(e) => {
                onSemesterChange(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  {sem === 'ALL' ? 'All Semesters' : `Semester ${sem}`}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1">
            <label htmlFor="select-status" className="text-slate-600 dark:text-slate-400">Status:</label>
            <select
              id="select-status"
              value={selectedStatus}
              onChange={(e) => {
                onStatusChange(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter Clear indicator */}
          {(selectedDepartment !== 'ALL' || selectedSemester !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                onDepartmentChange('ALL');
                onSemesterChange('ALL');
                onStatusChange('ALL');
                onSearchChange('');
                setCurrentPage(1);
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium ml-auto"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900/60 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700/80">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                <button
                  onClick={() => onSortChange('rollNumber')}
                  className="group inline-flex items-center hover:text-slate-900 dark:hover:text-white"
                >
                  Roll No
                  {renderSortIndicator('rollNumber')}
                </button>
              </th>
              <th scope="col" className="px-5 py-3.5">
                <button
                  onClick={() => onSortChange('firstName')}
                  className="group inline-flex items-center hover:text-slate-900 dark:hover:text-white"
                >
                  Student Name
                  {renderSortIndicator('firstName')}
                </button>
              </th>
              <th scope="col" className="px-5 py-3.5">
                <button
                  onClick={() => onSortChange('department')}
                  className="group inline-flex items-center hover:text-slate-900 dark:hover:text-white"
                >
                  Department
                  {renderSortIndicator('department')}
                </button>
              </th>
              <th scope="col" className="px-5 py-3.5">
                <button
                  onClick={() => onSortChange('semester')}
                  className="group inline-flex items-center hover:text-slate-900 dark:hover:text-white"
                >
                  Semester
                  {renderSortIndicator('semester')}
                </button>
              </th>
              <th scope="col" className="px-5 py-3.5">
                <button
                  onClick={() => onSortChange('cgpa')}
                  className="group inline-flex items-center hover:text-slate-900 dark:hover:text-white"
                >
                  CGPA
                  {renderSortIndicator('cgpa')}
                </button>
              </th>
              <th scope="col" className="px-5 py-3.5">
                <button
                  onClick={() => onSortChange('status')}
                  className="group inline-flex items-center hover:text-slate-900 dark:hover:text-white"
                >
                  Status
                  {renderSortIndicator('status')}
                </button>
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                  <div className="inline-flex items-center space-x-2">
                    <span className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                    <span>Querying Oracle Database via JDBC...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <div className="max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="text-base font-medium text-slate-800 dark:text-slate-200">No student records found</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Try adjusting your search criteria or insert a new student record into the Oracle database.
                    </p>
                    <button
                      onClick={onOpenAddModal}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Add First Student</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors group"
                >
                  {/* Roll Number */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                      {student.rollNumber}
                    </span>
                  </td>

                  {/* Student Name */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold border border-indigo-200 dark:border-indigo-800/60 shrink-0">
                        {getInitials(student.firstName, student.lastName)}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 font-medium">
                      {student.department}
                    </span>
                  </td>

                  {/* Semester */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Sem {student.semester}
                    </span>
                  </td>

                  {/* CGPA */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    {getCgpaBadge(student.cgpa)}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    {getStatusBadge(student.status)}
                  </td>

                  {/* Actions (View, Edit, Delete) */}
                  <td className="px-5 py-4 whitespace-nowrap text-right text-xs">
                    <div className="flex items-center justify-end space-x-1">
                      {/* View */}
                      <button
                        id={`btn-view-student-${student.id}`}
                        onClick={() => onViewStudent(student)}
                        title="View profile and details"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        id={`btn-edit-student-${student.id}`}
                        onClick={() => onEditStudent(student)}
                        title="Edit student record"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-700 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        id={`btn-delete-student-${student.id}`}
                        onClick={() => onDeleteStudent(student)}
                        title="Delete student record"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div>
          Showing <span className="font-semibold text-slate-900 dark:text-white">{students.length === 0 ? 0 : startIndex + 1}</span> to{' '}
          <span className="font-semibold text-slate-900 dark:text-white">{Math.min(startIndex + itemsPerPage, students.length)}</span> of{' '}
          <span className="font-semibold text-slate-900 dark:text-white">{students.length}</span> records
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Previous
          </button>
          <span className="font-medium text-slate-700 dark:text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
