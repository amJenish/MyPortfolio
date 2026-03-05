import { Project } from "../interfaces"

export const StudentEnrollmentSystem: Project = 
  {
    id: "3",
    title: "Student Enrollment System",
    description: "A backend-focused web application built with Java, Servlets, and a MySQL database to manage student enrollment, academic programs, and course prerequisites",
    githubUrl: "https://github.com/amJenish/StudentEnrollmentSystem",
    tags: ["Java", "SQL", "Servlets"],
    featured: false,
    content: `

A servlet-based backend application designed to manage academic administration workflows within an educational institution. This system implements a secure, multi-tiered platform supporting three user roles: Student, Professor, and Administrator, each with permissions and specialized functionality.

### **Technical Architecture**

- **Backend Framework**: Java Servlets implementing MVC architecture
- **Database**: MySQL
- **Communication Protocol**: HTTP Servlets
- **Authentication**: Role verification, secure password-hashing and access control
- **Data Layer**: JDBC for database connectivity with prepared statements

### **Role-Based System Design**

#### **Student Interface**
- **Course Enrollment**: Register for available courses with prerequisite validation
- **Program Management**: Select and track academic program requirements
- **Progress Monitoring**:  graphs for academic progress
- **Schedule Management**: View and modify personal course schedules

#### **Professor Interface**
- **Course Dashboard**: View all assigned courses with student rosters

#### **Administrator Interface**
- **Academic Structure Management**: Create and modify academic programs, courses, and prerequisites
- **Faculty Assignment**: Assign professors to courses with teaching load tracking
- **User Administration**: Invite, approve, and remove system users (students, professors, co-admins)
- **System Configuration**: Manage academic terms, enrollment periods, and system parameters

### **Core Functionality**

#### **Data Persistence **
-  All CRUD operations handled through dedicated servlets
- **Database Operations**: MySQL stored procedures for complex queries and data validation

#### **Business Logic Implementation**
- **Enrollment Validation**: Automated prerequisite checking and seat availability verification
- **Conflict Detection**: Schedule collision prevention during course registration


The platform serves as a foundational backend that could be extended with modern frontend frameworks while maintaining the servlet-based core for data integrity and business logic enforcement.
    `
  }