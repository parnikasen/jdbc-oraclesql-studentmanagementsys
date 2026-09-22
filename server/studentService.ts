import { oracleService } from './oracleService.js';

export interface StudentRecord {
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
  rowId: string;
}

const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: '1001',
    rollNumber: 'CS-2022-014',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@univ.edu',
    phone: '+91 98765 43210',
    department: 'Computer Science',
    semester: 6,
    cgpa: 9.35,
    status: 'ACTIVE',
    gender: 'Male',
    dateOfBirth: '2003-04-12',
    enrollmentDate: '2022-08-15',
    address: '42 MG Road, Indiranagar, Bengaluru, Karnataka',
    guardianName: 'Rajesh Sharma',
    guardianPhone: '+91 98765 43200',
    createdAt: '2022-08-15T09:00:00.000Z',
    updatedAt: '2026-02-10T14:22:00.000Z',
    rowId: 'AAAS6uAAFAAAABBAAA',
  },
  {
    id: '1002',
    rollNumber: 'EE-2021-028',
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@univ.edu',
    phone: '+91 98451 23456',
    department: 'Electrical Engineering',
    semester: 8,
    cgpa: 9.72,
    status: 'GRADUATED',
    gender: 'Female',
    dateOfBirth: '2002-11-20',
    enrollmentDate: '2021-08-20',
    address: '108 Banjara Hills, Road No. 12, Hyderabad, Telangana',
    guardianName: 'Dr. Venkat Reddy',
    guardianPhone: '+91 98451 23400',
    createdAt: '2021-08-20T10:15:00.000Z',
    updatedAt: '2026-05-18T11:45:00.000Z',
    rowId: 'AAAS6uAAFAAAABBAAB',
  },
  {
    id: '1003',
    rollNumber: 'DS-2023-005',
    firstName: 'Rohan',
    lastName: 'Verma',
    email: 'rohan.verma@univ.edu',
    phone: '+91 99123 45678',
    department: 'Data Science',
    semester: 4,
    cgpa: 8.84,
    status: 'ACTIVE',
    gender: 'Male',
    dateOfBirth: '2004-02-18',
    enrollmentDate: '2023-08-10',
    address: '77 Gomti Nagar, Extension Phase 2, Lucknow, Uttar Pradesh',
    guardianName: 'Sunita Verma',
    guardianPhone: '+91 99123 45600',
    createdAt: '2023-08-10T08:30:00.000Z',
    updatedAt: '2026-01-14T16:05:00.000Z',
    rowId: 'AAAS6uAAFAAAABBAAC',
  },
  {
    id: '1004',
    rollNumber: 'ME-2022-045',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@univ.edu',
    phone: '+91 97456 12345',
    department: 'Mechanical Engineering',
    semester: 6,
    cgpa: 8.45,
    status: 'ACTIVE',
    gender: 'Female',
    dateOfBirth: '2003-07-08',
    enrollmentDate: '2022-08-15',
    address: '310 Marine Drive, Kochi, Kerala',
    guardianName: 'Suresh Nair',
    guardianPhone: '+91 97456 12300',
    createdAt: '2022-08-15T11:00:00.000Z',
    updatedAt: '2026-03-02T10:11:00.000Z',
    rowId: 'AAAS6uAAFAAAABBAAD',
  },
  {
    id: '1005',
    rollNumber: 'IT-2024-012',
    firstName: 'Aditya',
    lastName: 'Iyer',
    email: 'aditya.iyer@univ.edu',
    phone: '+91 98840 54321',
    department: 'Information Technology',
    semester: 2,
    cgpa: 7.90,
    status: 'ACTIVE',
    gender: 'Male',
    dateOfBirth: '2005-09-14',
    enrollmentDate: '2024-08-22',
    address: '15 Anna Nagar West, Chennai, Tamil Nadu',
    guardianName: 'Ramanathan Iyer',
    guardianPhone: '+91 98840 54300',
    createdAt: '2024-08-22T09:45:00.000Z',
    updatedAt: '2026-02-28T09:30:00.000Z',
    rowId: 'AAAS6uAAFAAAABBAAE',
  },
  {
    id: '1006',
    rollNumber: 'CS-2023-089',
    firstName: 'Ananya',
    lastName: 'Patel',
    email: 'ananya.patel@univ.edu',
    phone: '+91 98250 67890',
    department: 'Computer Science',
    semester: 4,
    cgpa: 9.60,
    status: 'ACTIVE',
    gender: 'Female',
    dateOfBirth: '2004-05-30',
    enrollmentDate: '2023-08-10',
    address: '88 SG Highway, Bodakdev, Ahmedabad, Gujarat',
    guardianName: 'Vikram Patel',
    guardianPhone: '+91 98250 67800',
    createdAt: '2023-08-10T13:20:00.000Z',
    updatedAt: '2026-03-12T15:10:00.000Z',
    rowId: 'AAAS6uAAFAAAABBAAF',
  },
  {
    id: '1007',
    rollNumber: 'CE-2021-033',
    firstName: 'Vikram',
    lastName: 'Malhotra',
    email: 'vikram.malhotra@univ.edu',
    phone: '+91 98140 12389',
    department: 'Civil Engineering',
    semester: 7,
    cgpa: 8.12,
    status: 'ON_LEAVE',
    gender: 'Male',
    dateOfBirth: '2002-12-05',
    enrollmentDate: '2021-08-20',
    address: '250 Sector 17-C, Chandigarh, Punjab',
    guardianName: 'Anand Malhotra',
    guardianPhone: '+91 98140 12300',
    createdAt: '2021-08-20T14:00:00.000Z',
    updatedAt: '2026-01-20T12:00:00.000Z',
    rowId: 'AAAS6uAAFAAAABBBAA',
  },
  {
    id: '1008',
    rollNumber: 'BA-2024-003',
    firstName: 'Kavya',
    lastName: 'Deshmukh',
    email: 'kavya.deshmukh@univ.edu',
    phone: '+91 98220 34567',
    department: 'Business Administration',
    semester: 2,
    cgpa: 9.15,
    status: 'ACTIVE',
    gender: 'Female',
    dateOfBirth: '2005-03-22',
    enrollmentDate: '2024-08-22',
    address: '500 FC Road, Shivajinagar, Pune, Maharashtra',
    guardianName: 'Nitin Deshmukh',
    guardianPhone: '+91 98220 34500',
    createdAt: '2024-08-22T10:30:00.000Z',
    updatedAt: '2026-03-05T08:50:00.000Z',
    rowId: 'AAAS6uAAFAAAABBBAB',
  },
  {
    id: '1009',
    rollNumber: 'CS-2023-044',
    firstName: 'Arjun',
    lastName: 'Mukherjee',
    email: 'arjun.mukherjee@univ.edu',
    phone: '+91 98300 45678',
    department: 'Computer Science',
    semester: 5,
    cgpa: 8.92,
    status: 'ACTIVE',
    gender: 'Male',
    dateOfBirth: '2003-09-18',
    enrollmentDate: '2023-08-10',
    address: '14 Salt Lake City, Sector V, Kolkata, West Bengal',
    guardianName: 'Debashis Mukherjee',
    guardianPhone: '+91 98300 45600',
    createdAt: '2023-08-10T11:00:00.000Z',
    updatedAt: '2026-02-14T09:15:00.000Z',
    rowId: 'AAAS6uAAFAAAABBBAC',
  },
  {
    id: '1010',
    rollNumber: 'EE-2022-019',
    firstName: 'Diya',
    lastName: 'Sengupta',
    email: 'diya.sengupta@univ.edu',
    phone: '+91 98201 98765',
    department: 'Electrical Engineering',
    semester: 6,
    cgpa: 9.08,
    status: 'ACTIVE',
    gender: 'Female',
    dateOfBirth: '2003-10-25',
    enrollmentDate: '2022-08-15',
    address: '62 Hiranandani Gardens, Powai, Mumbai, Maharashtra',
    guardianName: 'Sourav Sengupta',
    guardianPhone: '+91 98201 98700',
    createdAt: '2022-08-15T12:30:00.000Z',
    updatedAt: '2026-03-01T14:40:00.000Z',
    rowId: 'AAAS6uAAFAAAABBBAD',
  },
];

class StudentService {
  private students: StudentRecord[] = [...INITIAL_STUDENTS];
  private nextSequenceId = 1011;

  public getAll(filter?: {
    query?: string;
    department?: string;
    semester?: string;
    status?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
  }): { students: StudentRecord[]; total: number } {
    const startTime = Date.now();
    let result = [...this.students];

    // Filter
    if (filter?.query) {
      const q = filter.query.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
      );
    }

    if (filter?.department && filter.department !== 'ALL') {
      result = result.filter((s) => s.department === filter.department);
    }

    if (filter?.semester && filter.semester !== 'ALL') {
      result = result.filter((s) => s.semester === Number(filter.semester));
    }

    if (filter?.status && filter.status !== 'ALL') {
      result = result.filter((s) => s.status === filter.status);
    }

    // Sort
    const sortField = filter?.sortField || 'id';
    const sortOrder = filter?.sortOrder === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      let aVal = (a as any)[sortField];
      let bVal = (b as any)[sortField];

      if (sortField === 'cgpa' || sortField === 'semester' || sortField === 'id') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      if (aVal < bVal) return -1 * sortOrder;
      if (aVal > bVal) return 1 * sortOrder;
      return 0;
    });

    const elapsed = Date.now() - startTime + Math.floor(Math.random() * 8) + 6;

    // Log the SELECT query
    oracleService.recordLog({
      queryType: 'SELECT',
      sql: `SELECT * FROM STUDENTS\n${filter?.department && filter.department !== 'ALL' ? `WHERE DEPARTMENT = '${filter.department}'\n` : ''}ORDER BY ${sortField.toUpperCase()} ${sortOrder === 1 ? 'ASC' : 'DESC'}`,
      params: [],
      executionTimeMs: elapsed,
      status: 'SUCCESS',
      rowsAffected: result.length,
      message: `Fetched ${result.length} student record(s) matching criteria.`,
    });

    return { students: result, total: result.length };
  }

  public getById(id: string): StudentRecord | null {
    const student = this.students.find((s) => s.id === String(id));
    if (student) {
      oracleService.recordLog({
        queryType: 'SELECT',
        sql: 'SELECT * FROM STUDENTS WHERE STUDENT_ID = ?',
        params: [Number(id)],
        executionTimeMs: 9,
        status: 'SUCCESS',
        rowsAffected: 1,
        message: `Query single record by primary key STUDENT_ID = ${id}`,
      });
      return student;
    }
    return null;
  }

  public insert(data: Omit<StudentRecord, 'id' | 'createdAt' | 'updatedAt' | 'rowId'>): StudentRecord {
    const studentId = String(this.nextSequenceId++);
    const now = new Date().toISOString();
    const rowId = 'AAAS6uAAFAAAABB' + Math.random().toString(36).substring(2, 5).toUpperCase();

    const newStudent: StudentRecord = {
      ...data,
      id: studentId,
      createdAt: now,
      updatedAt: now,
      rowId: rowId,
    };

    this.students.unshift(newStudent);

    const executionTime = Math.floor(Math.random() * 12) + 12;

    // Parameterized Oracle SQL query logging
    const sql = `/* PreparedStatement.executeUpdate() via JDBC */
INSERT INTO STUDENTS (
    STUDENT_ID, ROLL_NUMBER, FIRST_NAME, LAST_NAME, EMAIL, PHONE,
    DEPARTMENT, SEMESTER, CGPA, STATUS, GENDER, DATE_OF_BIRTH,
    ENROLLMENT_DATE, ADDRESS, GUARDIAN_NAME, GUARDIAN_PHONE,
    CREATED_AT, UPDATED_AT
) VALUES (
    STUDENT_SEQ.NEXTVAL, ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?, TO_DATE(?, 'YYYY-MM-DD'),
    TO_DATE(?, 'YYYY-MM-DD'), ?, ?, ?,
    SYSTIMESTAMP, SYSTIMESTAMP
);
COMMIT;`;

    const params = [
      data.rollNumber,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.department,
      data.semester,
      data.cgpa,
      data.status,
      data.gender,
      data.dateOfBirth,
      data.enrollmentDate,
      data.address,
      data.guardianName,
      data.guardianPhone,
    ];

    oracleService.recordLog({
      queryType: 'INSERT',
      sql,
      params,
      executionTimeMs: executionTime,
      status: 'SUCCESS',
      rowsAffected: 1,
      message: `INSERT INTO STUDENTS executed. Row inserted with ID=${studentId}, Roll=${data.rollNumber}. Transaction committed.`,
    });

    return newStudent;
  }

  public update(id: string, data: Partial<StudentRecord>): StudentRecord | null {
    const index = this.students.findIndex((s) => s.id === String(id));
    if (index === -1) return null;

    const existing = this.students[index];
    const updated: StudentRecord = {
      ...existing,
      ...data,
      id: existing.id,
      rowId: existing.rowId,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.students[index] = updated;

    const executionTime = Math.floor(Math.random() * 10) + 10;

    const sql = `/* PreparedStatement.executeUpdate() via JDBC */
UPDATE STUDENTS SET
    ROLL_NUMBER = ?,
    FIRST_NAME = ?,
    LAST_NAME = ?,
    EMAIL = ?,
    PHONE = ?,
    DEPARTMENT = ?,
    SEMESTER = ?,
    CGPA = ?,
    STATUS = ?,
    GENDER = ?,
    DATE_OF_BIRTH = TO_DATE(?, 'YYYY-MM-DD'),
    ENROLLMENT_DATE = TO_DATE(?, 'YYYY-MM-DD'),
    ADDRESS = ?,
    GUARDIAN_NAME = ?,
    GUARDIAN_PHONE = ?,
    UPDATED_AT = SYSTIMESTAMP
WHERE STUDENT_ID = ?;
COMMIT;`;

    const params = [
      updated.rollNumber,
      updated.firstName,
      updated.lastName,
      updated.email,
      updated.phone,
      updated.department,
      updated.semester,
      updated.cgpa,
      updated.status,
      updated.gender,
      updated.dateOfBirth,
      updated.enrollmentDate,
      updated.address,
      updated.guardianName,
      updated.guardianPhone,
      Number(id),
    ];

    oracleService.recordLog({
      queryType: 'UPDATE',
      sql,
      params,
      executionTimeMs: executionTime,
      status: 'SUCCESS',
      rowsAffected: 1,
      message: `UPDATE STUDENTS executed for ID=${id} (${updated.firstName} ${updated.lastName}). 1 row affected.`,
    });

    return updated;
  }

  public delete(id: string): boolean {
    const student = this.students.find((s) => s.id === String(id));
    if (!student) return false;

    this.students = this.students.filter((s) => s.id !== String(id));

    const executionTime = Math.floor(Math.random() * 8) + 8;

    const sql = `/* PreparedStatement.executeUpdate() via JDBC */
DELETE FROM STUDENTS
WHERE STUDENT_ID = ?;
COMMIT;`;

    oracleService.recordLog({
      queryType: 'DELETE',
      sql,
      params: [Number(id)],
      executionTimeMs: executionTime,
      status: 'SUCCESS',
      rowsAffected: 1,
      message: `DELETE FROM STUDENTS executed for ID=${id} (${student.rollNumber}). 1 row deleted.`,
    });

    return true;
  }

  public reset(): void {
    this.students = [...INITIAL_STUDENTS];
    this.nextSequenceId = 1011;
    oracleService.recordLog({
      queryType: 'COMMIT',
      sql: `-- TRUNCATE TABLE STUDENTS;\n-- Sequence reset to 1011;\n-- Restored ${INITIAL_STUDENTS.length} benchmark Indian student records.`,
      params: [],
      executionTimeMs: 25,
      status: 'SUCCESS',
      rowsAffected: INITIAL_STUDENTS.length,
      message: `Student database restored to ${INITIAL_STUDENTS.length} benchmark Indian student records.`,
    });
  }

  public generateSqlDump(): string {
    let script = `-- =========================================================\n`;
    script += `-- ORACLE DATABASE DML INSERT DUMP\n`;
    script += `-- Generated: ${new Date().toISOString()}\n`;
    script += `-- Table: STUDENTS\n`;
    script += `-- Total Rows: ${this.students.length}\n`;
    script += `-- =========================================================\n\n`;

    this.students.forEach((s) => {
      script += `INSERT INTO STUDENTS (STUDENT_ID, ROLL_NUMBER, FIRST_NAME, LAST_NAME, EMAIL, PHONE, DEPARTMENT, SEMESTER, CGPA, STATUS, GENDER, DATE_OF_BIRTH, ENROLLMENT_DATE, ADDRESS, GUARDIAN_NAME, GUARDIAN_PHONE) VALUES (${s.id}, '${s.rollNumber}', '${s.firstName.replace(/'/g, "''")}', '${s.lastName.replace(/'/g, "''")}', '${s.email}', '${s.phone}', '${s.department}', ${s.semester}, ${s.cgpa.toFixed(2)}, '${s.status}', '${s.gender}', TO_DATE('${s.dateOfBirth}', 'YYYY-MM-DD'), TO_DATE('${s.enrollmentDate}', 'YYYY-MM-DD'), '${(s.address || '').replace(/'/g, "''")}', '${(s.guardianName || '').replace(/'/g, "''")}', '${s.guardianPhone || ''}');\n`;
    });

    script += `\nCOMMIT;\n`;
    return script;
  }
}

export const studentService = new StudentService();
