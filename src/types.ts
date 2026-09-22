export interface Student {
  id: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  semester: number;
  cgpa: number;
  status: 'ACTIVE' | 'ON_LEAVE' | 'GRADUATED' | 'SUSPENDED';
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  enrollmentDate: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  createdAt: string;
  updatedAt: string;
  rowId?: string;
}

export type StudentFormData = Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'rowId'>;

export interface OracleSQLLog {
  id: string;
  timestamp: string;
  queryType: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT' | 'CONNECT' | 'COMMIT';
  sql: string;
  params: (string | number | boolean | null)[];
  executionTimeMs: number;
  status: 'SUCCESS' | 'ERROR';
  rowsAffected: number;
  message?: string;
}

export interface OracleDBConfig {
  driver: string;
  url: string;
  host: string;
  port: number;
  sid: string;
  username: string;
  schema: string;
  isConnected: boolean;
  poolSize: number;
  activeConnections: number;
  lastPingMs: number;
}
