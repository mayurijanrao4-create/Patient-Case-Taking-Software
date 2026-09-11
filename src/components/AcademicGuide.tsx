import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  CheckCircle,
  Database,
  Layers,
  ChevronDown,
  ChevronRight,
  Download
} from 'lucide-react';

interface Props {
  onOpenCode: (filePath?: string) => void;
}

export const AcademicGuide: React.FC<Props> = ({ onOpenCode }) => {
  const [activeSection, setActiveSection] = useState<'synopsis' | 'architecture' | 'setup' | 'viva'>('synopsis');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const vivaQuestions = [
    {
      q: '1. What is the MVC architecture and how is it implemented in this project?',
      a: 'MVC separates concerns into three layers:\n• Model (model/*): Holds POJO entities (Patient, CaseHistory, Examination, Diagnosis, Prescription, FollowUp) encapsulating clinical data with getters and setters.\n• View (view/*): Swing GUI forms (JFrame, JPanel, JTable, JTabbedPane) providing the user interface and presentation without direct SQL queries.\n• Controller (controller/*): Mediates between UI views and DAO persistence layers (PatientController, CaseController, AuthController), performing validation and handling business logic.\n• DAO (dao/*): Dedicated database access objects executing parameterized SQL via PreparedStatement to prevent SQL injection.'
    },
    {
      q: '2. Why is PreparedStatement used instead of Statement in JDBC?',
      a: 'PreparedStatement offers two critical advantages:\n1. Security (SQL Injection Prevention): User inputs are treated strictly as literal parameter data rather than executable SQL code, neutralizing malicious payload characters like quotes and semicolons.\n2. Performance & Pre-compilation: The database compiles the SQL template query once. Successive calls only transmit the bind variables, reducing database parse and planning overhead.'
    },
    {
      q: '3. How does this project handle relational 1:N multi-visit case histories in MySQL?',
      a: 'A single patient can visit the hospital multiple times over their lifespan. The database normalizes this into separate tables:\n• `patients` (Primary Key: patient_id)\n• `case_history` (Foreign Key: patient_id REFERENCES patients(patient_id))\nEach consultation inserts a new row in `case_history` with its unique `case_id`. Then `examinations`, `diagnoses`, `prescriptions`, and `follow_ups` link directly to that `case_id` with foreign keys, ensuring clinical historical integrity.'
    },
    {
      q: '4. How is ACID transaction management implemented during Case Taking?',
      a: 'When saving a consultation, records must be inserted across 5 tables simultaneously (CaseHistory, Examination, Diagnosis, Prescription with multiple medicines, and FollowUp). If an error occurs midway (e.g. invalid medicine data), we cannot leave partial orphan rows.\nWe handle this using JDBC manual transaction management:\n• `conn.setAutoCommit(false);`\n• Execute all INSERT statements in sequence.\n• If all succeed, call `conn.commit();`\n• In the `catch (SQLException e)` block, call `conn.rollback();` to undo any partial writes.'
    },
    {
      q: '5. Why is SwingUtilities.invokeLater() used in Main.java?',
      a: 'Java Swing is single-threaded and not thread-safe. All GUI modifications, component rendering, and event handling must occur on the Event Dispatch Thread (EDT). `SwingUtilities.invokeLater()` ensures that the initial JFrame creation and display runs safely on the EDT, preventing race conditions, UI freezing, and deadlocks.'
    },
    {
      q: '6. What is the role of the Singleton Pattern in DBConnection.java?',
      a: 'Instantiating a new database connection for every query creates significant socket and handshake overhead. The Singleton pattern ensures a centralized, reusable Connection object with synchronized acquisition, preventing connection leaks and managing credentials in a single source file.'
    },
    {
      q: '7. What validations are performed before saving records?',
      a: 'The application performs defensive multi-layer validations:\n• Empty fields validation for required fields.\n• Age range validation (1 to 125 integer).\n• 10-digit mobile number regex pattern check (`^[0-9]{10}$`).\n• Duplicate Patient ID validation checking `PatientDAO.existsById()` before insertion.\n• Vital signs formats (e.g. BP formatted as systolic/diastolic, temperature range).'
    },
    {
      q: '8. How does the Ward Bed Availability and Allocation system operate during registration?',
      a: 'Hospital operations categorize patient visits into Outpatient (OPD) and Inpatient (IPD):\n• OPD: Direct doctor consultation without ward stay; no bed is reserved.\n• IPD: The patient requires inpatient admission. The system queries normalized `wards` and `beds` tables for available beds (`status = \'Available\'`).\n• During registration, the receptionist/doctor selects an active ward (e.g., ICU, General Ward, Emergency, Pediatric, Private Ward). The system dynamically populates available beds and displays real-time occupancy counts.\n• On saving, a transaction marks the chosen bed as \'Occupied\', records `patient_id` and `allocated_at` timestamp, and updates the patient\'s admission record atomically.'
    },
    {
      q: '9. Can Java Swing run natively on iPhone/iOS or Android? How is Cross-Platform Mobile achieved?',
      a: 'Architectural Explanation:\n• Java Swing is a desktop windowing toolkit compiled to run on standard Java Virtual Machines (JVM) on Windows, macOS, and Linux PCs. Neither iOS (iPhone) nor standard mobile browsers run desktop Java Swing binaries.\n• Modern Production Healthcare Architecture: The core backend logic is exposed as a REST API (using Spring Boot / Java or Node.js) connected to the centralized MySQL database. Multiple clients connect to this single backend:\n  1. Desktop Client: Java Swing / JavaFX application for hospital reception desk and PC workstations.\n  2. Mobile Client: Responsive Web App (PWA) / React Native / Flutter app for doctors and nurses walking rounds with iPhones, iPads, and Android devices.\n• In this project, we provide an interactive iPhone 15 Pro simulator and fluid mobile viewport demonstrating how the exact same database entities and workflows (registration, bed allocation, case taking, prescription) run on mobile devices.'
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-slate-800 font-sans pb-12">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-100 text-sky-800 rounded-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Academic Project Companion & Engineering Manual</h2>
            <p className="text-xs text-slate-500">
              Department of Computer Science & Engineering / Information Technology (3rd Year Capstone)
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveSection('synopsis')}
            className={`px-3 py-1.5 rounded transition ${
              activeSection === 'synopsis' ? 'bg-white text-sky-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Project Synopsis
          </button>
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-3 py-1.5 rounded transition ${
              activeSection === 'architecture' ? 'bg-white text-sky-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            MVC & DB Schema
          </button>
          <button
            onClick={() => setActiveSection('setup')}
            className={`px-3 py-1.5 rounded transition ${
              activeSection === 'setup' ? 'bg-white text-sky-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            IDE Setup Guide
          </button>
          <button
            onClick={() => setActiveSection('viva')}
            className={`px-3 py-1.5 rounded transition ${
              activeSection === 'viva' ? 'bg-white text-sky-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Viva Questions
          </button>
        </div>
      </div>

      {/* SECTION 1: SYNOPSIS */}
      {activeSection === 'synopsis' && (
        <div className="space-y-5">
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-700" />
              1. Project Abstract & Objectives
            </h3>
            <p className="text-xs leading-relaxed text-slate-700">
              In conventional outpatient clinics and teaching hospitals, paper-based case-taking records are vulnerable
              to physical wear, unreadable handwriting, difficult retrieval during emergencies, and lack of historical
              continuity across repeated visits.
            </p>
            <p className="text-xs leading-relaxed text-slate-700">
              The <strong>Patient Case-Taking Software</strong> is a robust desktop clinical information system
              developed in <strong>Java Swing</strong> with a normalized <strong>MySQL</strong> backend connected via
              <strong>JDBC</strong>. The software digitally streamlines end-to-end outpatient workflows: registration,
              longitudinal case history, systematic physical examinations, clinical diagnoses, dynamic multi-medicine
              prescriptions, and follow-up appointment tracking.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-sky-800 mb-2">Key Objectives</h4>
                <ul className="text-xs space-y-1.5 text-slate-700 list-disc list-inside">
                  <li>Digitize patient demographic data with strict front-end validation.</li>
                  <li>Enable multiple case records per patient (1:N relationship).</li>
                  <li>Structured recording of Chief Complaint, Symptoms, and History.</li>
                  <li>Capture vitals: Temperature, BP, Pulse, Weight, and Height.</li>
                  <li>Multi-medicine dynamic prescription formulation.</li>
                  <li>Generate administrative and clinical analytics.</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="text-xs font-bold uppercase text-emerald-800 mb-2">System Specification</h4>
                <div className="text-xs space-y-1 text-slate-700">
                  <div><strong>Programming Language:</strong> Java (JDK 17 or higher)</div>
                  <div><strong>GUI Toolkit:</strong> Java Swing (javax.swing & java.awt)</div>
                  <div><strong>Database:</strong> MySQL Server 8.0+</div>
                  <div><strong>Database Driver:</strong> MySQL Connector/J 8.x</div>
                  <div><strong>Architecture:</strong> Model-View-Controller (MVC) + DAO</div>
                  <div><strong>Supported IDEs:</strong> NetBeans, IntelliJ IDEA, VS Code</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ARCHITECTURE & DATABASE */}
      {activeSection === 'architecture' && (
        <div className="space-y-5">
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-700" />
              2. MVC Architecture Layering
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg">
                <span className="font-bold text-sky-900 block mb-1">Model Layer (model/*)</span>
                <p className="text-slate-600 text-[11px]">
                  Encapsulates raw data attributes with private fields, getters, setters, and constructors.
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <span className="font-bold text-purple-900 block mb-1">View Layer (view/*)</span>
                <p className="text-slate-600 text-[11px]">
                  Pure Swing JFrames & JPanels rendering inputs, JTables, and dialogs.
                </p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="font-bold text-amber-900 block mb-1">Controller Layer (controller/*)</span>
                <p className="text-slate-600 text-[11px]">
                  Validates business rules and coordinates multi-table transactional commits.
                </p>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="font-bold text-emerald-900 block mb-1">DAO Layer (dao/*)</span>
                <p className="text-slate-600 text-[11px]">
                  Executes prepared SQL queries against MySQL database via JDBC connection.
                </p>
              </div>
            </div>

            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider pt-3">
              Normalized MySQL Relational Schema (3NF)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2">Table Name</th>
                    <th className="px-3 py-2">Primary Key</th>
                    <th className="px-3 py-2">Foreign Keys & Relations</th>
                    <th className="px-3 py-2">Clinical Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="px-3 py-2 font-mono font-bold text-sky-800">users</td>
                    <td className="px-3 py-2 font-mono">user_id</td>
                    <td className="px-3 py-2 text-slate-500">None</td>
                    <td className="px-3 py-2">Authentication & Doctor/Admin Role-based access</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono font-bold text-sky-800">patients</td>
                    <td className="px-3 py-2 font-mono">patient_id</td>
                    <td className="px-3 py-2 text-slate-500">None</td>
                    <td className="px-3 py-2">Patient demographics, age, 10-digit mobile, blood group</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono font-bold text-sky-800">case_history</td>
                    <td className="px-3 py-2 font-mono">case_id</td>
                    <td className="px-3 py-2 font-mono text-[11px]">patient_id (FK), doctor_id (FK)</td>
                    <td className="px-3 py-2">1:N Visit record, chief complaint, symptoms, duration</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono font-bold text-sky-800">examinations</td>
                    <td className="px-3 py-2 font-mono">exam_id</td>
                    <td className="px-3 py-2 font-mono text-[11px]">case_id (FK UNIQUE)</td>
                    <td className="px-3 py-2">Vitals: Temp, BP, Pulse, Weight, Height, Observation</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono font-bold text-sky-800">diagnoses</td>
                    <td className="px-3 py-2 font-mono">diagnosis_id</td>
                    <td className="px-3 py-2 font-mono text-[11px]">case_id (FK UNIQUE)</td>
                    <td className="px-3 py-2">Medical assessment, notes, and diagnosis date</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono font-bold text-sky-800">prescriptions</td>
                    <td className="px-3 py-2 font-mono">prescription_id</td>
                    <td className="px-3 py-2 font-mono text-[11px]">case_id (FK UNIQUE)</td>
                    <td className="px-3 py-2">Prescription header linking to case</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono font-bold text-sky-800">prescription_medicines</td>
                    <td className="px-3 py-2 font-mono">item_id</td>
                    <td className="px-3 py-2 font-mono text-[11px]">prescription_id (FK)</td>
                    <td className="px-3 py-2">Multiple drug items: Drug name, dose, freq, duration, notes</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono font-bold text-sky-800">follow_ups</td>
                    <td className="px-3 py-2 font-mono">followup_id</td>
                    <td className="px-3 py-2 font-mono text-[11px]">case_id (FK UNIQUE)</td>
                    <td className="px-3 py-2">Next visit scheduling and review notes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SETUP */}
      {activeSection === 'setup' && (
        <div className="space-y-5">
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-700" />
              3. Step-by-Step Execution Guide (NetBeans / IntelliJ / VS Code)
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Step 1: Setup MySQL Database</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                  <li>Open MySQL Workbench or terminal and connect to MySQL server.</li>
                  <li>
                    Copy the contents of <button onClick={() => onOpenCode('database/schema.sql')} className="text-sky-700 underline font-mono">database/schema.sql</button> and execute it.
                  </li>
                  <li>
                    This creates the database <code>patient_case_db</code> and seeds initial patients and doctor accounts.
                  </li>
                  <li>
                    In <button onClick={() => onOpenCode('database/DBConnection.java')} className="text-sky-700 underline font-mono">database/DBConnection.java</button>, update the password variable if your local MySQL root password is not <code>password</code>.
                  </li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Step 2: Add MySQL Connector/J JAR</h4>
                <p className="text-slate-700 mb-2">
                  JDBC requires the MySQL driver <code>mysql-connector-j-8.x.jar</code> in the Classpath:
                </p>
                <div className="space-y-2">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-bold text-sky-900 block">In NetBeans:</span>
                    Right click <strong>Libraries</strong> folder in your project → Click <strong>Add JAR/Folder</strong> → Select <code>mysql-connector-j-8.x.jar</code>.
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-bold text-sky-900 block">In IntelliJ IDEA:</span>
                    Go to <strong>File → Project Structure → Libraries</strong> → Click <strong>+ (Java)</strong> → Choose the downloaded MySQL Connector JAR → Apply.
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="font-bold text-sky-900 block">In VS Code:</span>
                    Expand the <strong>Java Projects</strong> explorer tab → Scroll to <strong>Referenced Libraries</strong> → Click <strong>+</strong> → Select the JAR.
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Step 3: Run the Application</h4>
                <p className="text-slate-700">
                  Open <button onClick={() => onOpenCode('Main.java')} className="text-sky-700 underline font-mono">Main.java</button> and click <strong>Run</strong> (or press Shift+F6 in NetBeans / Shift+F10 in IntelliJ).
                  The Swing Login dialog will appear with native desktop styling.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: VIVA QUESTIONS */}
      {activeSection === 'viva' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-sky-700" />
              4. External Examiner Viva Voce & Oral Defense Preparation
            </h3>
            <p className="text-xs text-slate-600">
              The following questions are standard questions asked during final year and 3rd year engineering project evaluations:
            </p>

            <div className="space-y-3 pt-2">
              {vivaQuestions.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-xs text-slate-800 transition"
                    >
                      <span>{item.q}</span>
                      {isOpen ? <ChevronDown className="w-4 h-4 text-sky-700" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white text-xs text-slate-700 whitespace-pre-line leading-relaxed border-t border-slate-200">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
