# JanSathi Interoperability Platform - API Documentation

## Overview
The JanSathi API Integration Layer provides cross-departmental data exchange, consent management, unified application tracking, workflow engine operations, audit logging, and integration monitoring for government services.

Base URL: `http://localhost:8080/api`

---

## 1. Unified Citizen Profile API

### GET `/api/profile`
* **Purpose:** Fetch the SSO-authenticated Unified Citizen Profile.
* **Authentication:** Bearer Token / Session Cookie
* **Response (200 OK):**
```json
{
  "success": true,
  "profile": {
    "citizenId": "CIT-88902",
    "name": "Ramesh Kisanrao Patil",
    "age": 42,
    "education": "Higher Secondary",
    "category": "OBC",
    "address": "At Post Shivajinagar, Tal. Haveli",
    "state": "Maharashtra",
    "district": "Pune",
    "occupation": "Farmer",
    "mobile": "+91 9823012345",
    "email": "citizen@jansathi.gov.in"
  }
}
```

### POST `/api/profile`
* **Purpose:** Update citizen profile information.
* **Request Body:**
```json
{
  "citizenId": "CIT-88902",
  "name": "Ramesh Kisanrao Patil",
  "age": 43,
  "occupation": "Farmer"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## 2. Consent Management API

### GET `/api/consents?citizenId=CIT-88902`
* **Purpose:** Retrieve all consent records and permissions for a citizen.
* **Response (200 OK):**
```json
{
  "success": true,
  "consents": [
    {
      "id": 1,
      "citizen_id": "CIT-88902",
      "department": "Agriculture",
      "data_requested": "7/12 Land & Crop Details",
      "purpose": "Farmer Subsidy Verification",
      "status": "ALLOWED",
      "created_at": "2026-09-28 10:00:00"
    }
  ]
}
```

### POST `/api/consents`
* **Purpose:** Give, deny, or revoke consent for a department.
* **Request Body:**
```json
{
  "citizenId": "CIT-88902",
  "department": "Agriculture",
  "status": "REVOKED",
  "reason": "User requested privacy revocation"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "message": "Consent status updated to REVOKED"
}
```

---

## 3. Department Connector & Mock API

### GET `/api/connectors`
* **Purpose:** Query status and execute functions on department connectors (`EducationConnector`, `AgricultureConnector`, `HealthcareConnector`, `TransportConnector`).
* **Parameters:** `department=Education&action=getCitizenData`
* **Response (200 OK):**
```json
{
  "success": true,
  "department": "Education",
  "action": "getCitizenData",
  "consentChecked": true,
  "data": {
    "qualification": "Higher Secondary",
    "scholarshipEligible": true,
    "verifiedBy": "Education Dept Mock API"
  }
}
```

### POST `/api/mock-dept/:dept`
* **Purpose:** Direct access to mock government department APIs.
* **Endpoints:** `/api/mock-dept/education`, `/api/mock-dept/agriculture`, `/api/mock-dept/healthcare`, `/api/mock-dept/transport`

---

## 4. Unified Application Tracking API

### GET `/api/applications?citizenId=CIT-88902`
* **Purpose:** Fetch all submitted scheme applications across all integrated government departments.
* **Response (200 OK):**
```json
{
  "success": true,
  "applications": [
    {
      "app_id": "EDU1024",
      "citizen_id": "CIT-88902",
      "department": "Education",
      "service": "Higher Education Scholarship",
      "submitted_date": "2026-09-20",
      "status": "UNDER_REVIEW",
      "last_updated": "2026-09-25"
    }
  ]
}
```

---

## 5. Workflow Engine API

### POST `/api/workflows`
* **Purpose:** Transition application state through defined governance workflow.
* **Request Body:**
```json
{
  "appId": "EDU1024",
  "nextStatus": "APPROVED",
  "officerId": "OFF-302",
  "comments": "All documents verified and approved"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "appId": "EDU1024",
  "previousStatus": "UNDER_REVIEW",
  "currentStatus": "APPROVED",
  "changedAt": "2026-09-28T08:50:00"
}
```

---

## 6. Audit Logging API

### GET `/api/audit`
* **Purpose:** Query system audit logs for administrative oversight.
* **Response (200 OK):**
```json
{
  "success": true,
  "logs": [
    {
      "id": 1,
      "user_id": "CIT-88902",
      "role": "Citizen",
      "action": "Consent Revoked",
      "resource": "ConsentManager",
      "department": "Healthcare",
      "timestamp": "2026-09-28 09:12:00",
      "status": "SUCCESS"
    }
  ]
}
```

---

## 7. Integration Monitoring API

### GET `/api/monitoring`
* **Purpose:** Retrieve live API health, response latencies, connector statuses, and error rates.
* **Response (200 OK):**
```json
{
  "success": true,
  "connectors": {
    "Education": "CONNECTED",
    "Agriculture": "CONNECTED",
    "Healthcare": "CONNECTED",
    "Transport": "CONNECTED"
  },
  "successfulRequests": 1250,
  "failedRequests": 18,
  "pendingRequests": 7,
  "averageLatencyMs": 420
}
```
