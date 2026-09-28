-- php_db/migrations_interoperability.sql
-- JanSathi System Integration & Interoperability Database Schema Migration

USE `jansathi_db`;

-- 1. Unified Profiles Table (SIR-02)
CREATE TABLE IF NOT EXISTS `unified_profiles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `citizen_id` VARCHAR(50) UNIQUE NOT NULL,
    `user_id` INT DEFAULT NULL,
    `name` VARCHAR(100) NOT NULL,
    `age` INT NOT NULL,
    `education` VARCHAR(100) NOT NULL,
    `category_caste` VARCHAR(50) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `state` VARCHAR(50) NOT NULL DEFAULT 'Maharashtra',
    `district` VARCHAR(50) NOT NULL DEFAULT 'Pune',
    `occupation` VARCHAR(100) NOT NULL,
    `mobile` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `annual_income` INT DEFAULT 150000,
    `land_holding` FLOAT DEFAULT 0.0,
    `aadhaar_verified` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Consents Table (SIR-03)
CREATE TABLE IF NOT EXISTS `consents` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `citizen_id` VARCHAR(50) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `data_requested` TEXT NOT NULL,
    `purpose` VARCHAR(255) NOT NULL,
    `status` ENUM('ALLOWED', 'NOT_ALLOWED', 'REVOKED') DEFAULT 'ALLOWED',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `revoked_at` TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Multilingual Scheme Translations Table
CREATE TABLE IF NOT EXISTS `scheme_translations` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `scheme_id` VARCHAR(50) NOT NULL,
    `language_code` VARCHAR(10) NOT NULL,
    `scheme_name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `eligibility` TEXT NOT NULL,
    `benefits` TEXT NOT NULL,
    `documents` TEXT NOT NULL,
    `application_process` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `scheme_lang_idx` (`scheme_id`, `language_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Department Connections Table (SIR-05)
CREATE TABLE IF NOT EXISTS `department_connections` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) UNIQUE NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `endpoint` VARCHAR(255) NOT NULL,
    `auth_type` VARCHAR(50) DEFAULT 'Bearer OAuth2',
    `status` ENUM('CONNECTED', 'DEGRADED', 'DISCONNECTED') DEFAULT 'CONNECTED',
    `latency_ms` INT DEFAULT 45,
    `last_ping` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Unified Applications Table (SIR-06)
CREATE TABLE IF NOT EXISTS `applications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `application_id` VARCHAR(50) UNIQUE NOT NULL,
    `citizen_id` VARCHAR(50) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `scheme_service` VARCHAR(255) NOT NULL,
    `submission_date` DATE NOT NULL,
    `status` ENUM('SUBMITTED', 'UNDER_VERIFICATION', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED') DEFAULT 'SUBMITTED',
    `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Application Workflows Table (SIR-07)
CREATE TABLE IF NOT EXISTS `application_workflows` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `application_id` VARCHAR(50) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `current_status` VARCHAR(50) NOT NULL,
    `previous_status` VARCHAR(50) DEFAULT NULL,
    `changed_by` VARCHAR(100) NOT NULL,
    `changed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `comments` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Audit Logs Table (SIR-08)
CREATE TABLE IF NOT EXISTS `audit_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(50) DEFAULT 'SYSTEM',
    `role` VARCHAR(50) NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `resource` VARCHAR(100) NOT NULL,
    `resource_id` VARCHAR(100) DEFAULT NULL,
    `department` VARCHAR(100) DEFAULT NULL,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `status` VARCHAR(50) DEFAULT 'SUCCESS',
    `details` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. API Logs Table (SIR-01)
CREATE TABLE IF NOT EXISTS `api_logs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `endpoint` VARCHAR(255) NOT NULL,
    `method` VARCHAR(10) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `request_payload` TEXT DEFAULT NULL,
    `response_code` INT NOT NULL,
    `response_time_ms` INT NOT NULL,
    `retry_count` INT DEFAULT 0,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Integration Status Table (SIR-09)
CREATE TABLE IF NOT EXISTS `integration_status` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `metric_name` VARCHAR(100) UNIQUE NOT NULL,
    `metric_value` VARCHAR(255) NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED SEED DATA FOR DEMO
INSERT INTO `unified_profiles` (`citizen_id`, `user_id`, `name`, `age`, `education`, `category_caste`, `address`, `state`, `district`, `occupation`, `mobile`, `email`, `annual_income`, `land_holding`) VALUES
('CIT-1001', 2, 'Sunita Kamble', 34, '12th Pass', 'SC', 'Ward No 3, Janpuri', 'Maharashtra', 'Solapur', 'Citizen / Self-Employed', '9812345678', 'sunita.citizen@jansathi.in', 120000, 0.0),
('CIT-1002', 1, 'Aniket Patil', 20, 'Graduate (BE Computer)', 'OBC', 'Main Road, Janpuri', 'Maharashtra', 'Latur', 'Student', '9422188990', 'aniket.student@jansathi.in', 150000, 0.0),
('CIT-1003', 1, 'Ganesh Deshmukh', 42, '10th Pass', 'General', 'Farm Sector 4, Janpuri', 'Maharashtra', 'Yavatmal', 'Farmer', '9822011223', 'ganesh.farmer@jansathi.in', 180000, 3.5)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `consents` (`citizen_id`, `department`, `data_requested`, `purpose`, `status`) VALUES
('CIT-1001', 'Education Department', 'Name, Age, Annual Income, Education', 'Scholarship eligibility verification', 'ALLOWED'),
('CIT-1001', 'Agriculture Department', 'Name, Address, Land Holding', 'PM-Kisan & Fasal Bima Subsidy', 'ALLOWED'),
('CIT-1001', 'Healthcare Department', 'Name, Age, Gender, Mobile', 'Ayushman Bharat ABHA Health Card', 'ALLOWED'),
('CIT-1001', 'Transport Department', 'Name, Age, Education Proof', 'MSRTC Bus Concession Pass', 'ALLOWED')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

INSERT INTO `department_connections` (`code`, `name`, `endpoint`, `auth_type`, `status`, `latency_ms`) VALUES
('EducationConnector', 'Education Department', 'https://api.education.gov.in/v1', 'Bearer OAuth2', 'CONNECTED', 45),
('AgricultureConnector', 'Agriculture Department', 'https://api.krishi.gov.in/v2', 'Bearer OAuth2', 'CONNECTED', 62),
('HealthcareConnector', 'Healthcare Department', 'https://api.health.abdm.gov.in/v1', 'Bearer OAuth2', 'CONNECTED', 38),
('TransportConnector', 'Transport Department', 'https://api.sarathi.parivahan.gov.in/v1', 'Bearer OAuth2', 'CONNECTED', 51)
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

INSERT INTO `applications` (`application_id`, `citizen_id`, `department`, `scheme_service`, `submission_date`, `status`) VALUES
('EDU1024', 'CIT-1001', 'Education Department', 'Post-Matric Scholarship', '2026-09-15', 'UNDER_REVIEW'),
('AGR2045', 'CIT-1001', 'Agriculture Department', 'PM-Kisan Samman Nidhi', '2026-09-10', 'APPROVED'),
('HLT3056', 'CIT-1001', 'Healthcare Department', 'Ayushman Bharat Card', '2026-09-20', 'SUBMITTED'),
('TRP4088', 'CIT-1001', 'Transport Department', 'MSRTC Concession Pass', '2026-09-18', 'COMPLETED')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

INSERT INTO `application_workflows` (`application_id`, `department`, `current_status`, `previous_status`, `changed_by`, `comments`) VALUES
('EDU1024', 'Education Department', 'SUBMITTED', NULL, 'Sunita Kamble', 'Submitted online via JanSathi Portal'),
('EDU1024', 'Education Department', 'UNDER_VERIFICATION', 'SUBMITTED', 'Automated Verification Engine', 'Verified Aadhaar and Income Certificate'),
('EDU1024', 'Education Department', 'UNDER_REVIEW', 'UNDER_VERIFICATION', 'Nodal Officer (Higher Ed)', 'College income endorsement verified')
ON DUPLICATE KEY UPDATE `current_status` = VALUES(`current_status`);

INSERT INTO `audit_logs` (`user_id`, `role`, `action`, `resource`, `resource_id`, `department`, `status`, `details`) VALUES
('CIT-1001', 'Citizen', 'Login', 'Auth', 'SSO-SESSION-1001', 'JanSathi SSO', 'SUCCESS', 'Single Sign-On login via JanSathi Credential Manager'),
('CIT-1001', 'Citizen', 'Consent Given', 'Consent', 'CNS-101', 'Education Department', 'SUCCESS', 'Granted data access for Post-Matric Scholarship'),
('CIT-1001', 'Citizen', 'Application Submitted', 'Application', 'EDU1024', 'Education Department', 'SUCCESS', 'Submitted Post-Matric Scholarship application via EducationConnector')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);
