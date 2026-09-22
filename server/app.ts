import express from 'express';
import { studentService } from './studentService.js';
import { oracleService } from './oracleService.js';

const app = express();

app.use(express.json());

// CORS & Preflight handling for safe cross-origin / serverless deployment
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Student Endpoints ---

// GET: Fetch all students with optional filters
router.get('/students', (req, res) => {
  try {
    const { query, department, semester, status, sortField, sortOrder } = req.query;
    const data = studentService.getAll({
      query: query ? String(query) : undefined,
      department: department ? String(department) : undefined,
      semester: semester ? String(semester) : undefined,
      status: status ? String(status) : undefined,
      sortField: sortField ? String(sortField) : undefined,
      sortOrder: sortOrder === 'desc' ? 'desc' : 'asc',
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to retrieve student records' });
  }
});

// GET: Fetch single student by ID
router.get('/students/:id', (req, res) => {
  try {
    const student = studentService.getById(req.params.id);
    if (!student) {
      res.status(404).json({ error: 'Student record not found in Oracle DB' });
      return;
    }
    res.json(student);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Insert new student record (JDBC executeUpdate)
router.post('/students', (req, res) => {
  try {
    const {
      rollNumber,
      firstName,
      lastName,
      email,
      phone,
      department,
      semester,
      cgpa,
      status,
      gender,
      dateOfBirth,
      enrollmentDate,
      address,
      guardianName,
      guardianPhone,
    } = req.body;

    if (!rollNumber || !firstName || !lastName || !email || !department) {
      res.status(400).json({ error: 'Missing required student fields (rollNumber, firstName, lastName, email, department)' });
      return;
    }

    const newStudent = studentService.insert({
      rollNumber,
      firstName,
      lastName,
      email,
      phone: phone || '',
      department,
      semester: Number(semester) || 1,
      cgpa: parseFloat(Number(cgpa).toFixed(2)) || 0.0,
      status: status || 'ACTIVE',
      gender: gender || 'Male',
      dateOfBirth: dateOfBirth || '2004-01-01',
      enrollmentDate: enrollmentDate || new Date().toISOString().split('T')[0],
      address: address || '',
      guardianName: guardianName || '',
      guardianPhone: guardianPhone || '',
    });

    res.status(201).json({
      message: 'Student record successfully inserted into Oracle Database.',
      student: newStudent,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error executing INSERT into Oracle Database' });
  }
});

// PUT: Update student record (JDBC executeUpdate)
router.put('/students/:id', (req, res) => {
  try {
    const updated = studentService.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Student record not found for update' });
      return;
    }
    res.json({
      message: 'Student record successfully updated in Oracle Database.',
      student: updated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error executing UPDATE in Oracle Database' });
  }
});

// DELETE: Delete student record (JDBC executeUpdate)
router.delete('/students/:id', (req, res) => {
  try {
    const success = studentService.delete(req.params.id);
    if (!success) {
      res.status(404).json({ error: 'Student record not found' });
      return;
    }
    res.json({ message: `Student ID ${req.params.id} permanently deleted from Oracle Database.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error executing DELETE from Oracle Database' });
  }
});

// POST: Reset dataset to initial records
router.post('/students/reset', (req, res) => {
  studentService.reset();
  res.json({ message: 'Oracle DB student table reset to benchmark dataset.' });
});

// GET: Export SQL dump
router.get('/students/export/sql', (req, res) => {
  const dump = studentService.generateSqlDump();
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', 'attachment; filename=oracle_students_dump.sql');
  res.send(dump);
});

// --- Oracle DB / JDBC Diagnostic Endpoints ---

router.get('/db/config', (req, res) => {
  res.json(oracleService.getConfig());
});

router.put('/db/config', (req, res) => {
  const updated = oracleService.updateConfig(req.body);
  res.json(updated);
});

router.post('/db/ping', (req, res) => {
  const result = oracleService.ping();
  res.json(result);
});

router.get('/db/logs', (req, res) => {
  res.json(oracleService.getLogs());
});

router.delete('/db/logs', (req, res) => {
  oracleService.clearLogs();
  res.json({ message: 'Oracle SQL logs cleared.' });
});

router.get('/db/schema', (req, res) => {
  res.json({ ddl: oracleService.getOracleDDLSchema() });
});

router.get('/db/jdbc-code', (req, res) => {
  res.json({ files: oracleService.getJavaJdbcCode() });
});

// Mount router under /api AND / so both local server and Vercel serverless functions work seamlessly
app.use('/api', router);
app.use('/', router);

export default app;
export { app };
