# JanSathi System Architecture Diagram & Data Flow

## 1. System Architecture Diagram

```text
+-------------------------------------------------------------------------+
|                         JanSathi Frontend Layer                         |
|  [ Schemes Explorer | Eligibility Calc | Interoperability Hub | Admin ] |
+-------------------------------------------------------------------------+
                                    |
                                    v (HTTP REST / JSON Data Exchange)
+-------------------------------------------------------------------------+
|                       JanSathi API Integration Layer                    |
|                                                                         |
|  +--------------------+   +-------------------+   +------------------+  |
|  | SSO / Auth Handler |   | Unified Profile   |   | Consent Engine   |  |
|  +--------------------+   +-------------------+   +------------------+  |
|  | Workflow Engine    |   | Audit Logger      |   | Health Monitor   |  |
|  +--------------------+   +-------------------+   +------------------+  |
+-------------------------------------------------------------------------+
                                    |
                                    v (Department Connectors Layer)
+-------------------------------------------------------------------------+
|                          Department Connectors                          |
|  [EducationConnector | AgricultureConnector | Healthcare | Transport]   |
+-------------------------------------------------------------------------+
                                    |
                                    v (REST APIs / JSON)
+-------------------------------------------------------------------------+
|                       Mock Government Department APIs                   |
|  - Education Dept API: Scholarship & Marksheet Verification             |
|  - Agriculture Dept API: 7/12 Land Registry & Crop Subsidy              |
|  - Healthcare Dept API: ABHA & Ayushman Bharat Insurance                |
|  - Transport Dept API: Driving Licence & Concession Pass                |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                       JanSathi Database (MySQL / SQLite)                |
|  [unified_profiles | consents | applications | workflows | audit_logs]  |
+-------------------------------------------------------------------------+
```

## 2. End-to-End Interoperability Data Flow

```text
Citizen Login (SSO)
       ↓
Unified Citizen Profile Loaded
       ↓
Citizen Selects Scheme Application (e.g. Agriculture Subsidy)
       ↓
System Requests Data from Agriculture Department Connector
       ↓
Consent Engine Checks Table `consents` for (Citizen ID, Department)
       ↓
  ┌─────────────────────────┴─────────────────────────┐
  │                                                   │
  ▼ ALLOWED                                           ▼ DENIED
Fetch Data via Connector                             Prompt Citizen to Grant Consent
  │                                                   │
  └─────────────────────────┬─────────────────────────┘
                            ▼
           Call Mock Government API Endpoint
                            ▼
              Submit Application to Database
                            ▼
            Trigger Workflow Engine Engine Steps:
   [SUBMITTED -> UNDER_VERIFICATION -> REVIEW -> APPROVED]
                            ▼
         Log Transaction in `audit_logs` & `api_logs`
                            ▼
    Display Live Status in Unified Application Tracking & Admin Monitor
```
