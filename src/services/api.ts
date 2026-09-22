import { Student, StudentFormData, OracleSQLLog, OracleDBConfig } from '../types';

export const api = {
  // --- Students API ---
  async getStudents(filters?: {
    query?: string;
    department?: string;
    semester?: string;
    status?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ students: Student[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.query) params.append('query', filters.query);
    if (filters?.department) params.append('department', filters.department);
    if (filters?.semester) params.append('semester', filters.semester);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.sortField) params.append('sortField', filters.sortField);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const res = await fetch(`/api/students?${params.toString()}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch students from Oracle DB');
    }
    return res.json();
  },

  async getStudentById(id: string): Promise<Student> {
    const res = await fetch(`/api/students/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Student not found in Oracle DB');
    }
    return res.json();
  },

  async createStudent(data: StudentFormData): Promise<{ message: string; student: Student }> {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to insert student into Oracle DB');
    }
    return res.json();
  },

  async updateStudent(id: string, data: Partial<StudentFormData>): Promise<{ message: string; student: Student }> {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update student in Oracle DB');
    }
    return res.json();
  },

  async deleteStudent(id: string): Promise<{ message: string }> {
    const res = await fetch(`/api/students/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete student from Oracle DB');
    }
    return res.json();
  },

  async resetStudents(): Promise<{ message: string }> {
    const res = await fetch('/api/students/reset', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset dataset');
    return res.json();
  },

  // --- Oracle DB / JDBC Diagnostic API ---
  async getOracleConfig(): Promise<OracleDBConfig> {
    const res = await fetch('/api/db/config');
    if (!res.ok) throw new Error('Failed to fetch Oracle configuration');
    return res.json();
  },

  async updateOracleConfig(data: Partial<OracleDBConfig>): Promise<OracleDBConfig> {
    const res = await fetch('/api/db/config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update Oracle configuration');
    return res.json();
  },

  async pingOracle(): Promise<{ success: boolean; latencyMs: number; timestamp: string }> {
    const res = await fetch('/api/db/ping', { method: 'POST' });
    if (!res.ok) throw new Error('Oracle ping failed');
    return res.json();
  },

  async getOracleLogs(): Promise<OracleSQLLog[]> {
    const res = await fetch('/api/db/logs');
    if (!res.ok) throw new Error('Failed to fetch SQL execution logs');
    return res.json();
  },

  async clearOracleLogs(): Promise<{ message: string }> {
    const res = await fetch('/api/db/logs', { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to clear logs');
    return res.json();
  },

  async getOracleSchema(): Promise<{ ddl: string }> {
    const res = await fetch('/api/db/schema');
    if (!res.ok) throw new Error('Failed to fetch Oracle DDL schema');
    return res.json();
  },

  async getJdbcCode(): Promise<{ files: Record<string, string> }> {
    const res = await fetch('/api/db/jdbc-code');
    if (!res.ok) throw new Error('Failed to fetch Java JDBC code');
    return res.json();
  },
};
