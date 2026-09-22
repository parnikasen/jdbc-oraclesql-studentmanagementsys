import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles, Terminal, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Student, StudentFormData } from '../types';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
  initialData?: Student | null;
  mode: 'create' | 'edit';
  isSubmitting?: boolean;
}

const DEPARTMENTS = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Information Technology',
  'Civil Engineering',
  'Data Science',
  'Business Administration',
];

const GENDERS: Array<'Male' | 'Female' | 'Other'> = ['Male', 'Female', 'Other'];
const STATUSES: Array<'ACTIVE' | 'ON_LEAVE' | 'GRADUATED' | 'SUSPENDED'> = [
  'ACTIVE',
  'ON_LEAVE',
  'GRADUATED',
  'SUSPENDED',
];

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    rollNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    semester: 1,
    cgpa: 8.5,
    status: 'ACTIVE',
    gender: 'Male',
    dateOfBirth: '2004-01-15',
    enrollmentDate: new Date().toISOString().split('T')[0],
    address: '',
    guardianName: '',
    guardianPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSqlPreview, setShowSqlPreview] = useState(true);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        rollNumber: initialData.rollNumber || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department: initialData.department || 'Computer Science',
        semester: initialData.semester || 1,
        cgpa: initialData.cgpa || 8.0,
        status: initialData.status || 'ACTIVE',
        gender: initialData.gender || 'Male',
        dateOfBirth: initialData.dateOfBirth?.split('T')[0] || '2004-01-15',
        enrollmentDate: initialData.enrollmentDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        address: initialData.address || '',
        guardianName: initialData.guardianName || '',
        guardianPhone: initialData.guardianPhone || '',
      });
    } else {
      // Auto-generate fresh roll number suggestion for create mode
      const deptCode = 'CS';
      const year = new Date().getFullYear();
      const randomSuffix = Math.floor(Math.random() * 899) + 100;
      setFormData({
        rollNumber: `${deptCode}-${year}-${randomSuffix}`,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: 'Computer Science',
        semester: 1,
        cgpa: 8.5,
        status: 'ACTIVE',
        gender: 'Male',
        dateOfBirth: '2004-05-12',
        enrollmentDate: new Date().toISOString().split('T')[0],
        address: '',
        guardianName: '',
        guardianPhone: '',
      });
    }
    setErrors({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required (e.g. CS-2024-001)';
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address format';
    }
    if (formData.cgpa < 0 || formData.cgpa > 10) {
      newErrors.cgpa = 'CGPA must be between 0.00 and 10.00';
    }
    if (formData.semester < 1 || formData.semester > 8) {
      newErrors.semester = 'Semester must be between 1 and 8';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(formData);
  };

  const handleGenerateRollNumber = () => {
    const deptPrefixes: Record<string, string> = {
      'Computer Science': 'CS',
      'Electrical Engineering': 'EE',
      'Mechanical Engineering': 'ME',
      'Information Technology': 'IT',
      'Civil Engineering': 'CE',
      'Data Science': 'DS',
      'Business Administration': 'BA',
    };
    const prefix = deptPrefixes[formData.department] || 'STU';
    const year = new Date().getFullYear();
    const randNum = Math.floor(Math.random() * 899) + 100;
    setFormData((prev) => ({
      ...prev,
      rollNumber: `${prefix}-${year}-${randNum}`,
      email: prev.email || `${(prev.firstName || 'student').toLowerCase()}.${(prev.lastName || 'record').toLowerCase()}@univ.edu`,
    }));
  };

  // Generate real-time SQL preview
  const generateSqlPreview = () => {
    if (mode === 'create') {
      return `/* Oracle JDBC PreparedStatement: INSERT */
INSERT INTO STUDENTS (
    STUDENT_ID, ROLL_NUMBER, FIRST_NAME, LAST_NAME,
    EMAIL, PHONE, DEPARTMENT, SEMESTER,
    CGPA, STATUS, GENDER, DATE_OF_BIRTH,
    ENROLLMENT_DATE, ADDRESS, GUARDIAN_NAME, GUARDIAN_PHONE,
    CREATED_AT, UPDATED_AT
) VALUES (
    STUDENT_SEQ.NEXTVAL,
    '${formData.rollNumber || '?' }',
    '${formData.firstName || '?' }',
    '${formData.lastName || '?' }',
    '${formData.email || '?' }',
    '${formData.phone || '?' }',
    '${formData.department}',
    ${formData.semester},
    ${Number(formData.cgpa || 0).toFixed(2)},
    '${formData.status}',
    '${formData.gender}',
    TO_DATE('${formData.dateOfBirth}', 'YYYY-MM-DD'),
    TO_DATE('${formData.enrollmentDate}', 'YYYY-MM-DD'),
    '${formData.address || ''}',
    '${formData.guardianName || ''}',
    '${formData.guardianPhone || ''}',
    SYSTIMESTAMP,
    SYSTIMESTAMP
);
COMMIT;`;
    } else {
      return `/* Oracle JDBC PreparedStatement: UPDATE */
UPDATE STUDENTS SET
    ROLL_NUMBER = '${formData.rollNumber}',
    FIRST_NAME = '${formData.firstName}',
    LAST_NAME = '${formData.lastName}',
    EMAIL = '${formData.email}',
    PHONE = '${formData.phone}',
    DEPARTMENT = '${formData.department}',
    SEMESTER = ${formData.semester},
    CGPA = ${Number(formData.cgpa || 0).toFixed(2)},
    STATUS = '${formData.status}',
    GENDER = '${formData.gender}',
    DATE_OF_BIRTH = TO_DATE('${formData.dateOfBirth}', 'YYYY-MM-DD'),
    ENROLLMENT_DATE = TO_DATE('${formData.enrollmentDate}', 'YYYY-MM-DD'),
    ADDRESS = '${formData.address || ''}',
    GUARDIAN_NAME = '${formData.guardianName || ''}',
    GUARDIAN_PHONE = '${formData.guardianPhone || ''}',
    UPDATED_AT = SYSTIMESTAMP
WHERE STUDENT_ID = ${initialData?.id || '?'};
COMMIT;`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {mode === 'create' ? '+' : '✎'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {mode === 'create' ? 'Insert New Student Record' : `Update Student Record #${initialData?.id}`}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Data will be persisted to Oracle Database via JDBC PreparedStatement
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Academic Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 flex items-center space-x-1.5">
              <span>1. Academic Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Roll Number */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Roll Number / Student ID <span className="text-rose-500">*</span>
                  </label>
                  {mode === 'create' && (
                    <button
                      type="button"
                      onClick={handleGenerateRollNumber}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-Generate</span>
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g. CS-2024-042"
                  className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 ${
                    errors.rollNumber ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                  }`}
                />
                {errors.rollNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.rollNumber}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enrollment Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Department <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Semester (1 - 8) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.semester && <p className="text-[11px] text-rose-500 mt-1">{errors.semester}</p>}
              </div>

              {/* CGPA */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  CGPA (Scale 0.00 - 10.00) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  max={10}
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.cgpa && <p className="text-[11px] text-rose-500 mt-1">{errors.cgpa}</p>}
              </div>

              {/* Enrollment Date */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enrollment Date
                </label>
                <input
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Personal Information */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
              2. Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Aarav"
                  className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                    errors.firstName ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                  }`}
                />
                {errors.firstName && <p className="text-[11px] text-rose-500 mt-1">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Sharma"
                  className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                    errors.lastName ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                  }`}
                />
                {errors.lastName && <p className="text-[11px] text-rose-500 mt-1">{errors.lastName}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  University Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="aarav.sharma@univ.edu"
                  className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 42 MG Road, Indiranagar, Bengaluru"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Guardian Details */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
              3. Emergency & Guardian Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Guardian / Parent Name
                </label>
                <input
                  type="text"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Guardian Phone Number
                </label>
                <input
                  type="text"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                  placeholder="+91 98765 43200"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Real-time Oracle SQL Preview */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setShowSqlPreview(!showSqlPreview)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 py-1"
            >
              <div className="flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span>Live Oracle JDBC SQL Query Preview</span>
              </div>
              {showSqlPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSqlPreview && (
              <div className="mt-2 p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                <pre>{generateSqlPreview()}</pre>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>

            <button
              id="btn-submit-student-form"
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Executing via JDBC...' : mode === 'create' ? 'Insert into Oracle DB' : 'Update in Oracle DB'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
