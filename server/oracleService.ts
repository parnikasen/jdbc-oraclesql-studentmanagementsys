export interface SQLLogItem {
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

class OracleService {
  private logs: SQLLogItem[] = [];
  private maxLogs = 200;

  private config = {
    driver: 'oracle.jdbc.OracleDriver',
    url: process.env.ORACLE_JDBC_URL || 'jdbc:oracle:thin:@localhost:1521:XE',
    host: 'localhost',
    port: 1521,
    sid: 'XE',
    username: process.env.ORACLE_DB_USER || 'STUDENT_ADMIN',
    schema: 'STUDENT_DB',
    isConnected: true,
    poolSize: 10,
    activeConnections: 1,
    lastPingMs: 14,
  };

  constructor() {
    this.recordLog({
      queryType: 'CONNECT',
      sql: `/* Oracle JDBC Connection Initialized */\nConnection conn = DriverManager.getConnection("${this.config.url}", "${this.config.username}", "********");\n-- Oracle DB 19c Enterprise Edition Release 19.0.0.0.0`,
      params: [],
      executionTimeMs: 42,
      status: 'SUCCESS',
      rowsAffected: 0,
      message: 'JDBC Connection pool established with Oracle DB instance.',
    });
  }

  public getConfig() {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<typeof this.config>) {
    this.config = { ...this.config, ...newConfig };
    this.recordLog({
      queryType: 'CONNECT',
      sql: `-- Updated Oracle JDBC parameters: ${this.config.url} [User: ${this.config.username}]`,
      params: [],
      executionTimeMs: 18,
      status: 'SUCCESS',
      rowsAffected: 0,
      message: 'Oracle JDBC connection profile updated.',
    });
    return this.config;
  }

  public ping() {
    const latency = Math.floor(Math.random() * 15) + 8;
    this.config.lastPingMs = latency;
    this.recordLog({
      queryType: 'SELECT',
      sql: 'SELECT 1 FROM DUAL',
      params: [],
      executionTimeMs: latency,
      status: 'SUCCESS',
      rowsAffected: 1,
      message: 'Oracle ping successful. Connection alive.',
    });
    return { success: true, latencyMs: latency, timestamp: new Date().toISOString() };
  }

  public recordLog(item: Omit<SQLLogItem, 'id' | 'timestamp'>): SQLLogItem {
    const logItem: SQLLogItem = {
      id: 'LOG_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + String(new Date().getMilliseconds()).padStart(3, '0'),
      ...item,
    };
    this.logs.unshift(logItem);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    return logItem;
  }

  public getLogs(): SQLLogItem[] {
    return this.logs;
  }

  public clearLogs(): void {
    this.logs = [];
    this.recordLog({
      queryType: 'CONNECT',
      sql: '-- Query execution history cleared by administrator',
      params: [],
      executionTimeMs: 1,
      status: 'SUCCESS',
      rowsAffected: 0,
      message: 'Console cleared.',
    });
  }

  public getOracleDDLSchema(): string {
    return `-- =========================================================
-- ORACLE DATABASE 19c / 21c / XE DDL SCHEMA
-- Schema: STUDENT_DB
-- Application: Student Management System
-- =========================================================

-- 1. Drop existing objects if recreating
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE STUDENTS CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN RAISE; END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE STUDENT_SEQ';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -2289 THEN RAISE; END IF;
END;
/

-- 2. Create Sequence for Student Primary Key (STUDENT_ID)
CREATE SEQUENCE STUDENT_SEQ
  START WITH 1001
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

-- 3. Create Table STUDENTS
CREATE TABLE STUDENTS (
    STUDENT_ID       NUMBER(10)          NOT NULL,
    ROLL_NUMBER      VARCHAR2(30)        NOT NULL,
    FIRST_NAME       VARCHAR2(50)        NOT NULL,
    LAST_NAME        VARCHAR2(50)        NOT NULL,
    EMAIL            VARCHAR2(100)       NOT NULL,
    PHONE            VARCHAR2(20),
    DEPARTMENT       VARCHAR2(60)        NOT NULL,
    SEMESTER         NUMBER(2)           DEFAULT 1 NOT NULL,
    CGPA             NUMBER(4,2)         DEFAULT 0.00 NOT NULL,
    STATUS           VARCHAR2(20)        DEFAULT 'ACTIVE' NOT NULL,
    GENDER           VARCHAR2(15)        NOT NULL,
    DATE_OF_BIRTH    DATE,
    ENROLLMENT_DATE  DATE                DEFAULT SYSDATE NOT NULL,
    ADDRESS          VARCHAR2(255),
    GUARDIAN_NAME    VARCHAR2(100),
    GUARDIAN_PHONE   VARCHAR2(20),
    CREATED_AT       TIMESTAMP           DEFAULT SYSTIMESTAMP NOT NULL,
    UPDATED_AT       TIMESTAMP           DEFAULT SYSTIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT PK_STUDENTS PRIMARY KEY (STUDENT_ID),
    CONSTRAINT UQ_STUDENT_ROLL UNIQUE (ROLL_NUMBER),
    CONSTRAINT UQ_STUDENT_EMAIL UNIQUE (EMAIL),
    CONSTRAINT CHK_STUDENT_CGPA CHECK (CGPA >= 0.00 AND CGPA <= 10.00),
    CONSTRAINT CHK_STUDENT_SEM CHECK (SEMESTER BETWEEN 1 AND 8),
    CONSTRAINT CHK_STUDENT_STATUS CHECK (STATUS IN ('ACTIVE', 'ON_LEAVE', 'GRADUATED', 'SUSPENDED')),
    CONSTRAINT CHK_STUDENT_GENDER CHECK (GENDER IN ('Male', 'Female', 'Other'))
);

-- 4. Create Indexes for High Performance Queries
CREATE INDEX IDX_STUDENT_DEPT ON STUDENTS(DEPARTMENT);
CREATE INDEX IDX_STUDENT_STATUS ON STUDENTS(STATUS);
CREATE INDEX IDX_STUDENT_NAME ON STUDENTS(LAST_NAME, FIRST_NAME);

-- 5. Create Trigger for Auto-Populating ID and Auto-Updating TIMESTAMP
CREATE OR REPLACE TRIGGER TRG_STUDENT_BIU
BEFORE INSERT OR UPDATE ON STUDENTS
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        IF :NEW.STUDENT_ID IS NULL THEN
            SELECT STUDENT_SEQ.NEXTVAL INTO :NEW.STUDENT_ID FROM DUAL;
        END IF;
        :NEW.CREATED_AT := SYSTIMESTAMP;
        :NEW.UPDATED_AT := SYSTIMESTAMP;
    ELSIF UPDATING THEN
        :NEW.UPDATED_AT := SYSTIMESTAMP;
    END IF;
END;
/

COMMIT;
`;
  }

  public getJavaJdbcCode(): Record<string, string> {
    return {
      'DBConnection.java': `package com.university.studentmgmt.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Singleton database connection manager for Oracle Database via JDBC.
 * Uses Oracle Thin Driver (oracle.jdbc.OracleDriver).
 */
public class DBConnection {
    // JDBC URL format: jdbc:oracle:thin:@[HOST]:[PORT]:[SID]
    private static final String URL = "${this.config.url}";
    private static final String USER = "${this.config.username}";
    private static final String PASSWORD = "your_secure_password";
    private static final String DRIVER = "oracle.jdbc.OracleDriver";

    static {
        try {
            // Load and register Oracle JDBC Driver
            Class.forName(DRIVER);
            System.out.println("[Oracle JDBC] Driver registered successfully: " + DRIVER);
        } catch (ClassNotFoundException e) {
            System.err.println("[Oracle JDBC] Driver not found in classpath: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Obtains a new active connection to the Oracle Database.
     * @return java.sql.Connection
     * @throws SQLException
     */
    public static Connection getConnection() throws SQLException {
        Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
        conn.setAutoCommit(false); // Enable explicit transaction control
        return conn;
    }

    /**
     * Utility method to close connection safely.
     */
    public static void close(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}`,

      'Student.java': `package com.university.studentmgmt.model;

import java.sql.Date;
import java.sql.Timestamp;

/**
 * Entity model representing a Student record mapping directly to Oracle STUDENTS table.
 */
public class Student {
    private int studentId;
    private String rollNumber;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String department;
    private int semester;
    private double cgpa;
    private String status;
    private String gender;
    private Date dateOfBirth;
    private Date enrollmentDate;
    private String address;
    private String guardianName;
    private String guardianPhone;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public Student() {}

    // Getters and Setters
    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public double getCgpa() { return cgpa; }
    public void setCgpa(double cgpa) { this.cgpa = cgpa; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Date getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(Date dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public Date getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(Date enrollmentDate) { this.enrollmentDate = enrollmentDate; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getGuardianName() { return guardianName; }
    public void setGuardianName(String guardianName) { this.guardianName = guardianName; }

    public String getGuardianPhone() { return guardianPhone; }
    public void setGuardianPhone(String guardianPhone) { this.guardianPhone = guardianPhone; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }
}`,

      'StudentDAO.java': `package com.university.studentmgmt.dao;

import com.university.studentmgmt.db.DBConnection;
import com.university.studentmgmt.model.Student;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object (DAO) providing complete CRUD operations
 * for Student records using Oracle JDBC PreparedStatement.
 */
public class StudentDAO {

    /**
     * 1. INSERT: Inserts a new student record into Oracle STUDENTS table.
     */
    public boolean insertStudent(Student student) throws SQLException {
        String sql = "INSERT INTO STUDENTS ("
                   + " STUDENT_ID, ROLL_NUMBER, FIRST_NAME, LAST_NAME, EMAIL, PHONE, "
                   + " DEPARTMENT, SEMESTER, CGPA, STATUS, GENDER, DATE_OF_BIRTH, "
                   + " ENROLLMENT_DATE, ADDRESS, GUARDIAN_NAME, GUARDIAN_PHONE, "
                   + " CREATED_AT, UPDATED_AT"
                   + ") VALUES ("
                   + " STUDENT_SEQ.NEXTVAL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "
                   + " SYSTIMESTAMP, SYSTIMESTAMP)";

        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = DBConnection.getConnection();
            pstmt = conn.prepareStatement(sql);

            pstmt.setString(1, student.getRollNumber());
            pstmt.setString(2, student.getFirstName());
            pstmt.setString(3, student.getLastName());
            pstmt.setString(4, student.getEmail());
            pstmt.setString(5, student.getPhone());
            pstmt.setString(6, student.getDepartment());
            pstmt.setInt(7, student.getSemester());
            pstmt.setDouble(8, student.getCgpa());
            pstmt.setString(9, student.getStatus());
            pstmt.setString(10, student.getGender());
            pstmt.setDate(11, student.getDateOfBirth());
            pstmt.setDate(12, student.getEnrollmentDate());
            pstmt.setString(13, student.getAddress());
            pstmt.setString(14, student.getGuardianName());
            pstmt.setString(15, student.getGuardianPhone());

            int rows = pstmt.executeUpdate();
            conn.commit(); // Explicit Oracle commit
            return rows > 0;
        } catch (SQLException e) {
            if (conn != null) conn.rollback();
            throw e;
        } finally {
            if (pstmt != null) pstmt.close();
            DBConnection.close(conn);
        }
    }

    /**
     * 2. UPDATE: Updates an existing student record by primary key (STUDENT_ID).
     */
    public boolean updateStudent(Student student) throws SQLException {
        String sql = "UPDATE STUDENTS SET "
                   + " ROLL_NUMBER = ?, FIRST_NAME = ?, LAST_NAME = ?, EMAIL = ?, "
                   + " PHONE = ?, DEPARTMENT = ?, SEMESTER = ?, CGPA = ?, "
                   + " STATUS = ?, GENDER = ?, DATE_OF_BIRTH = ?, ENROLLMENT_DATE = ?, "
                   + " ADDRESS = ?, GUARDIAN_NAME = ?, GUARDIAN_PHONE = ?, "
                   + " UPDATED_AT = SYSTIMESTAMP "
                   + " WHERE STUDENT_ID = ?";

        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = DBConnection.getConnection();
            pstmt = conn.prepareStatement(sql);

            pstmt.setString(1, student.getRollNumber());
            pstmt.setString(2, student.getFirstName());
            pstmt.setString(3, student.getLastName());
            pstmt.setString(4, student.getEmail());
            pstmt.setString(5, student.getPhone());
            pstmt.setString(6, student.getDepartment());
            pstmt.setInt(7, student.getSemester());
            pstmt.setDouble(8, student.getCgpa());
            pstmt.setString(9, student.getStatus());
            pstmt.setString(10, student.getGender());
            pstmt.setDate(11, student.getDateOfBirth());
            pstmt.setDate(12, student.getEnrollmentDate());
            pstmt.setString(13, student.getAddress());
            pstmt.setString(14, student.getGuardianName());
            pstmt.setString(15, student.getGuardianPhone());
            pstmt.setInt(16, student.getStudentId());

            int rows = pstmt.executeUpdate();
            conn.commit();
            return rows > 0;
        } catch (SQLException e) {
            if (conn != null) conn.rollback();
            throw e;
        } finally {
            if (pstmt != null) pstmt.close();
            DBConnection.close(conn);
        }
    }

    /**
     * 3. DELETE: Deletes a student record by primary key (STUDENT_ID).
     */
    public boolean deleteStudent(int studentId) throws SQLException {
        String sql = "DELETE FROM STUDENTS WHERE STUDENT_ID = ?";

        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = DBConnection.getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, studentId);

            int rows = pstmt.executeUpdate();
            conn.commit();
            return rows > 0;
        } catch (SQLException e) {
            if (conn != null) conn.rollback();
            throw e;
        } finally {
            if (pstmt != null) pstmt.close();
            DBConnection.close(conn);
        }
    }

    /**
     * 4. SELECT ALL: Queries all student records from Oracle.
     */
    public List<Student> getAllStudents() throws SQLException {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT * FROM STUDENTS ORDER BY STUDENT_ID DESC";

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);

            while (rs.next()) {
                Student s = mapResultSetToStudent(rs);
                list.add(s);
            }
            return list;
        } finally {
            if (rs != null) rs.close();
            if (stmt != null) stmt.close();
            DBConnection.close(conn);
        }
    }

    private Student mapResultSetToStudent(ResultSet rs) throws SQLException {
        Student s = new Student();
        s.setStudentId(rs.getInt("STUDENT_ID"));
        s.setRollNumber(rs.getString("ROLL_NUMBER"));
        s.setFirstName(rs.getString("FIRST_NAME"));
        s.setLastName(rs.getString("LAST_NAME"));
        s.setEmail(rs.getString("EMAIL"));
        s.setPhone(rs.getString("PHONE"));
        s.setDepartment(rs.getString("DEPARTMENT"));
        s.setSemester(rs.getInt("SEMESTER"));
        s.setCgpa(rs.getDouble("CGPA"));
        s.setStatus(rs.getString("STATUS"));
        s.setGender(rs.getString("GENDER"));
        s.setDateOfBirth(rs.getDate("DATE_OF_BIRTH"));
        s.setEnrollmentDate(rs.getDate("ENROLLMENT_DATE"));
        s.setAddress(rs.getString("ADDRESS"));
        s.setGuardianName(rs.getString("GUARDIAN_NAME"));
        s.setGuardianPhone(rs.getString("GUARDIAN_PHONE"));
        s.setCreatedAt(rs.getTimestamp("CREATED_AT"));
        s.setUpdatedAt(rs.getTimestamp("UPDATED_AT"));
        return s;
    }
}`,

      'StudentServlet.java': `package com.university.studentmgmt.servlet;

import com.google.gson.Gson;
import com.university.studentmgmt.dao.StudentDAO;
import com.university.studentmgmt.model.Student;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * HTTP Servlet acting as REST controller for the front-end interface,
 * forwarding requests to the Oracle JDBC StudentDAO.
 */
@WebServlet("/api/students/*")
public class StudentServlet extends HttpServlet {
    private StudentDAO studentDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        this.studentDAO = new StudentDAO();
        this.gson = new Gson();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        try {
            List<Student> students = studentDAO.getAllStudents();
            out.print(gson.toJson(students));
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\\"error\\": \\"" + e.getMessage() + "\\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {
            Student student = gson.fromJson(req.getReader(), Student.class);
            boolean success = studentDAO.insertStudent(student);
            if (success) {
                resp.setStatus(HttpServletResponse.SC_CREATED);
                out.print("{\\"message\\": \\"Student record inserted successfully in Oracle DB\\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\\"error\\": \\"Failed to insert record\\"}");
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\\"error\\": \\"" + e.getMessage() + "\\"}");
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {
            Student student = gson.fromJson(req.getReader(), Student.class);
            boolean success = studentDAO.updateStudent(student);
            if (success) {
                out.print("{\\"message\\": \\"Student record updated successfully in Oracle DB\\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\\"error\\": \\"Student record not found\\"}");
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\\"error\\": \\"" + e.getMessage() + "\\"}");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();

        try {
            String pathInfo = req.getPathInfo(); // /1001
            if (pathInfo != null && pathInfo.length() > 1) {
                int studentId = Integer.parseInt(pathInfo.substring(1));
                boolean success = studentDAO.deleteStudent(studentId);
                if (success) {
                    out.print("{\\"message\\": \\"Student record deleted successfully from Oracle DB\\"}");
                } else {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\\"error\\": \\"Record not found\\"}");
                }
            }
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\\"error\\": \\"" + e.getMessage() + "\\"}");
        }
    }
}`
    };
  }
}

export const oracleService = new OracleService();
