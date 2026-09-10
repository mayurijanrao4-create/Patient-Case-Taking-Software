# Patient Case-Taking Software (Academic Engineering Project)

A complete desktop-based clinical record and case-taking system engineered for outpatient clinics and teaching hospitals.

## Technology Stack
- **Language:** Java (JDK 17 or higher)
- **GUI Toolkit:** Java Swing (`javax.swing`, `java.awt`)
- **Database:** MySQL 8.x
- **Connectivity:** JDBC (MySQL Connector/J 8.x)
- **Architecture:** Model-View-Controller (MVC) with Data Access Object (DAO) pattern
- **Design Pattern:** Singleton (`DBConnection`), Factory, and MVC

---

## Project Structure
```
patient-case-taking-java/
├── database/
│   ├── schema.sql                 # Complete MySQL 3NF normalized tables & seed data
│   └── DBConnection.java          # Thread-safe Singleton JDBC connection manager
├── model/
│   ├── User.java                  # User authentication & role entity
│   ├── Patient.java               # Patient demographic entity
│   ├── CaseHistory.java           # Case record & symptoms entity
│   ├── Examination.java           # Vital signs & physical exam entity
│   ├── Diagnosis.java             # Clinical diagnosis entity
│   ├── Prescription.java          # Prescription master entity
│   ├── PrescriptionMedicine.java  # Drug item detail entity
│   └── FollowUp.java              # Follow-up review scheduling entity
├── dao/
│   ├── UserDAO.java               # PreparedStatements for credentials & roles
│   ├── PatientDAO.java            # CRUD queries for patient master records
│   ├── CaseHistoryDAO.java        # Case history insertion & lookup
│   ├── ExaminationDAO.java        # Physical exam vitals persistence
│   ├── DiagnosisDAO.java          # Diagnosis record persistence
│   ├── PrescriptionDAO.java       # Master-detail prescription queries
│   └── FollowUpDAO.java           # Follow-up schedule persistence
├── controller/
│   ├── AuthController.java        # Session & authentication logic
│   ├── PatientController.java     # Patient validations & CRUD coordination
│   └── CaseController.java        # Multi-table atomic JDBC transaction manager
├── view/
│   ├── LoginView.java             # Swing authentication form
│   ├── DashboardView.java         # Role-based main navigation portal
│   ├── PatientRegistrationView.java # Patient registration & input validation
│   ├── PatientManagementView.java # JTable patient directory, search & edit
│   ├── CaseTakingView.java        # Multi-tab clinical examination & Rx form
│   ├── CaseHistoryView.java       # Historical chronological timeline viewer
│   └── ReportsView.java           # Statistical aggregation & clinical analytics
└── Main.java                      # Event Dispatch Thread entry point
```

---

## How to Set Up and Run

### 1. MySQL Database Setup
1. Open MySQL Command Line or MySQL Workbench.
2. Execute the script in `database/schema.sql`.
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. Update password in `database/DBConnection.java` if needed (default: `password`, port: `3306`).

### 2. NetBeans IDE
1. Open NetBeans -> `File` -> `New Project` -> `Java with Ant` -> `Java Application`.
2. Name the project `PatientCaseTakingSoftware`.
3. Copy all folders (`database`, `model`, `dao`, `controller`, `view`) and `Main.java` into the `src` folder.
4. Right-click on `Libraries` -> `Add JAR/Folder...` -> Select `mysql-connector-j-8.x.jar`.
5. Right-click on `Main.java` -> `Run File` (or press `Shift + F6`).

### 3. IntelliJ IDEA
1. Open IntelliJ IDEA -> `New Project` -> `Java` (Select JDK 17+).
2. Copy the source packages into the `src` directory.
3. Go to `File` -> `Project Structure` -> `Libraries` -> `+` (Java) -> Choose `mysql-connector-j-8.x.jar`.
4. Right-click `Main.java` and click `Run 'Main.main()'`.

### 4. Default Login Credentials
- **Doctor:** Username: `doctor1` | Password: `password123`
- **Admin:** Username: `admin` | Password: `admin123`
