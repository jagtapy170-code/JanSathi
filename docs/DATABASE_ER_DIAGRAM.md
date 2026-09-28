# JanSathi Database ER Diagram & Schema Specification

## Entity Relationship Overview

```text
       +-----------------------+
       |         users         |
       +-----------------------+
       | id (PK)               |
       | email                 |
       | full_name             |
       +-----------------------+
                   | 1
                   |
                   | 1
       +-----------------------+
       |   unified_profiles    |
       +-----------------------+
       | citizen_id (PK/FK)    |
       | name, age, education  |
       | category, occupation  |
       | state, district       |
       +-----------------------+
                   |
        +----------+----------+
        | 1                   | 1
        v M                   v M
+---------------+     +-----------------------+
|   consents    |     |     applications      |
+---------------+     +-----------------------+
| id (PK)       |     | app_id (PK)           |
| citizen_id(FK)|     | citizen_id (FK)       |
| department    |     | department            |
| status        |     | service               |
| created_at    |     | status                |
+---------------+     +-----------------------+
                                  | 1
                                  |
                                  | M
                      +-----------------------+
                      | application_workflows |
                      +-----------------------+
                      | id (PK)               |
                      | app_id (FK)           |
                      | previous_status       |
                      | current_status        |
                      | changed_by            |
                      | changed_at            |
                      +-----------------------+

        +-----------------------+         +-----------------------+
        |      audit_logs       |         |       api_logs        |
        +-----------------------+         +-----------------------+
        | id (PK)               |         | id (PK)               |
        | user_id, action       |         | endpoint, status_code |
        | department, status    |         | latency_ms, timestamp |
        +-----------------------+         +-----------------------+
```

## Database Tables & Field Descriptions

### 1. `unified_profiles`
* `citizen_id` (VARCHAR(50), PRIMARY KEY): Unique citizen identifier (e.g. `CIT-88902`).
* `name` (VARCHAR(150)): Full legal name.
* `age` (INT): Citizen age.
* `education` (VARCHAR(100)): Highest educational qualification.
* `category` (VARCHAR(50)): Caste / Social category (General, OBC, SC, ST).
* `address` (TEXT): Full residential address.
* `state` (VARCHAR(100)): State of domicile.
* `district` (VARCHAR(100)): District name.
* `occupation` (VARCHAR(100)): Primary occupation.
* `mobile` (VARCHAR(20)): Contact mobile number.
* `email` (VARCHAR(100)): Email address.

### 2. `consents`
* `id` (INT AUTO_INCREMENT, PRIMARY KEY)
* `citizen_id` (VARCHAR(50)): Reference to citizen profile.
* `department` (VARCHAR(100)): Target department (`Education`, `Agriculture`, `Healthcare`, `Transport`).
* `data_requested` (TEXT): Scope of requested data.
* `purpose` (TEXT): Stated administrative purpose.
* `status` (ENUM('ALLOWED', 'DENIED', 'REVOKED')): Consent permission status.
* `created_at` (DATETIME): Timestamp when consent granted/denied.

### 3. `department_connections`
* `id` (INT AUTO_INCREMENT, PRIMARY KEY)
* `department_name` (VARCHAR(100)): Connector target name.
* `endpoint_url` (VARCHAR(255)): Mock API URL.
* `status` (VARCHAR(20)): `CONNECTED` or `DISCONNECTED`.
* `last_ping` (DATETIME): Last health check timestamp.

### 4. `applications`
* `app_id` (VARCHAR(50), PRIMARY KEY): Application ID (e.g., `EDU1024`, `AGR2045`).
* `citizen_id` (VARCHAR(50)): Applicant citizen ID.
* `department` (VARCHAR(100)): Managing department.
* `service` (VARCHAR(150)): Scheme or service title.
* `submitted_date` (DATE): Submission date.
* `status` (ENUM('SUBMITTED', 'UNDER_VERIFICATION', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED')): Current state.

### 5. `application_workflows`
* `id` (INT AUTO_INCREMENT, PRIMARY KEY)
* `app_id` (VARCHAR(50)): Reference to application.
* `previous_status` (VARCHAR(50)): State prior to transition.
* `current_status` (VARCHAR(50)): State after transition.
* `changed_by` (VARCHAR(100)): Officer / User ID making change.
* `changed_at` (DATETIME): Transition timestamp.
* `comments` (TEXT): Remarks or approval notes.

### 6. `audit_logs`
* `id` (INT AUTO_INCREMENT, PRIMARY KEY)
* `user_id` (VARCHAR(50)): User performing action.
* `role` (VARCHAR(50)): User role (`Citizen`, `Officer`, `Admin`).
* `action` (VARCHAR(100)): Action description.
* `resource` (VARCHAR(100)): Target module/resource.
* `department` (VARCHAR(100)): Affected department.
* `timestamp` (DATETIME): Event timestamp.
* `status` (VARCHAR(20)): `SUCCESS` or `FAILURE`.
* `details` (TEXT): Additional context or payload info.

### 7. `integration_status`
* `id` (INT AUTO_INCREMENT, PRIMARY KEY)
* `successful_requests` (INT): Cumulative successful requests.
* `failed_requests` (INT): Cumulative failed/retried requests.
* `pending_requests` (INT): In-flight active requests.
* `avg_latency_ms` (INT): Average latency in milliseconds.
* `last_updated` (DATETIME): Timestamp.
