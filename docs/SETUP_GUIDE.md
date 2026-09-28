# JanSathi Interoperability Platform - Setup & Execution Guide

Follow these steps to run the complete JanSathi system with API Integration Layer, Department Connectors, and Interoperability Hub.

---

## 1. Prerequisites

* **Node.js**: v16+ installed (for Vite web preview server)
* **Java SDK**: JDK 11+ installed (for Java HTTP REST API server & connectors)
* **PHP & MySQL** (Optional for local DB persistence, SQLite fallback built-in)

---

## 2. Directory Structure

```text
JanSathi/
├── backend/
│   └── java/
│       ├── Main.java                        # Server entry point (Port 8080)
│       ├── connectors/
│       │   ├── DepartmentConnector.java     # Base connector interface
│       │   ├── EducationConnector.java      # Education dept connector
│       │   ├── AgricultureConnector.java    # Agriculture dept connector
│       │   ├── HealthcareConnector.java     # Healthcare dept connector
│       │   └── TransportConnector.java      # Transport dept connector
│       └── handlers/
│           └── InteroperabilityApiHandler.java # API REST Controller
├── php_db/
│   ├── config.php                           # Database configuration
│   ├── init_db.php                          # Schema initializer & seed data
│   ├── migrations_interoperability.sql      # DDL SQL migration script
│   └── interoperability_api.php             # PHP REST API endpoints
├── css/
│   └── style.css                            # Modern Vanilla CSS design system
├── js/
│   └── app.js                               # Frontend state & API integration logic
├── docs/                                    # Documentation deliverables
├── index.html                               # Preserved UI with Interoperability Hub
└── vite.config.js                           # Vite dev server configuration
```

---

## 3. Database Initialization (MySQL)

Execute the migration script to create all 8 interoperability tables and seed demo data:

```bash
# Using MySQL Command Line Client or phpMyAdmin:
mysql -u root -p jansathi_db < php_db/migrations_interoperability.sql
```

Alternatively, run the PHP initializer:
```bash
php php_db/init_db.php
```

---

## 4. Compile & Run Java REST API Backend

Compile the Java source files:
```bash
cmd /c javac -d bin backend/java/*.java backend/java/connectors/*.java backend/java/handlers/*.java
```

Start the Java HTTP REST Server on Port 8080:
```bash
cmd /c java -cp bin backend.java.Main
```

You should see:
`[JanSathi Backend] Starting HTTP REST API Server on port 8080...`

---

## 5. Launch Frontend Web App

Install Node dependencies (if not already installed):
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Open your browser and navigate to:
`http://localhost:3000` (or `http://localhost:5173`)

---

## 6. Verifying Interoperability Features

1. Click **"Interoperability Hub"** in the top navigation header.
2. Observe the **Unified Citizen Profile** loaded for `Ramesh Kisanrao Patil (CIT-88902)`.
3. In **Consent Management**, grant or revoke consent for Agriculture/Healthcare depts.
4. Click **"Run Connector 🚀"** under Education, Agriculture, Healthcare, or Transport connectors to trigger mock API communication.
5. Review **Unified Application Tracking** table and test workflow step actions (`UNDER_REVIEW` -> `APPROVED`).
6. View real-time **Audit Logs** and **Integration Monitoring** stats.
