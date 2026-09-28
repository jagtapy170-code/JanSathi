<?php
// php_db/init_db.php - Database Initialization & Seeding for JanSathi Interoperability Platform
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');

try {
    $pdo = getDBConnection();

    // Re-create core tables
    $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(100) NOT NULL,
        `email` VARCHAR(100) UNIQUE NOT NULL,
        `phone` VARCHAR(20) NOT NULL,
        `password` VARCHAR(255) NOT NULL,
        `role` ENUM('citizen', 'admin', 'student', 'farmer') DEFAULT 'citizen',
        `user_type` ENUM('student', 'farmer', 'citizen', 'admin') DEFAULT 'citizen',
        `aadhaar` VARCHAR(20) DEFAULT NULL,
        `state` VARCHAR(50) DEFAULT 'Maharashtra',
        `district` VARCHAR(50) DEFAULT 'Pune',
        `caste_category` VARCHAR(50) DEFAULT 'General',
        `gender` VARCHAR(20) DEFAULT 'All',
        `land_holding` FLOAT DEFAULT 0,
        `income` INT DEFAULT 0,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `schemes` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `scheme_id` VARCHAR(100) UNIQUE NOT NULL,
        `official_scheme_code` VARCHAR(50) UNIQUE DEFAULT NULL,
        `title` VARCHAR(255) NOT NULL,
        `normalized_name` VARCHAR(255) UNIQUE NOT NULL,
        `category` VARCHAR(100) NOT NULL,
        `sector` VARCHAR(100) NOT NULL,
        `govt_level` ENUM('Central', 'State/UT', 'Local') DEFAULT 'Central',
        `state_ut` VARCHAR(100) DEFAULT 'All India',
        `min_age` INT DEFAULT 0,
        `max_age` INT DEFAULT 120,
        `max_income` INT DEFAULT 1000000,
        `target_gender` VARCHAR(20) DEFAULT 'all',
        `target_occupation` VARCHAR(100) DEFAULT 'all',
        `description` TEXT NOT NULL,
        `benefits` TEXT NOT NULL,
        `documents` TEXT NOT NULL,
        `link` VARCHAR(255) DEFAULT '#',
        `source_url` VARCHAR(255) DEFAULT '#',
        `helpline` VARCHAR(50) DEFAULT '1800-111-555',
        `status` ENUM('active', 'upcoming', 'closed') DEFAULT 'active',
        `opening_date` DATE DEFAULT '2026-01-01',
        `closing_date` DATE DEFAULT '2026-12-31',
        `last_verified_date` DATE DEFAULT '2026-09-28',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `grievances` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `tracking_id` VARCHAR(50) UNIQUE NOT NULL,
        `user_id` INT DEFAULT NULL,
        `name` VARCHAR(100) NOT NULL,
        `phone` VARCHAR(20) NOT NULL,
        `category` VARCHAR(100) NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `description` TEXT NOT NULL,
        `location` VARCHAR(255) NOT NULL,
        `status` ENUM('Pending', 'In Progress', 'Under Action', 'Resolved') DEFAULT 'Pending',
        `remarks` TEXT DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `announcements` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(255) NOT NULL,
        `category` VARCHAR(100) NOT NULL,
        `date` VARCHAR(50) NOT NULL,
        `content` TEXT NOT NULL,
        `link` VARCHAR(255) DEFAULT '#',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // INTEROPERABILITY TABLES (SIR-01 through SIR-09)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `unified_profiles` (
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
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `consents` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `citizen_id` VARCHAR(50) NOT NULL,
        `department` VARCHAR(100) NOT NULL,
        `data_requested` TEXT NOT NULL,
        `purpose` VARCHAR(255) NOT NULL,
        `status` ENUM('ALLOWED', 'NOT_ALLOWED', 'REVOKED') DEFAULT 'ALLOWED',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `revoked_at` TIMESTAMP NULL DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `department_connections` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `code` VARCHAR(50) UNIQUE NOT NULL,
        `name` VARCHAR(100) NOT NULL,
        `endpoint` VARCHAR(255) NOT NULL,
        `auth_type` VARCHAR(50) DEFAULT 'Bearer OAuth2',
        `status` ENUM('CONNECTED', 'DEGRADED', 'DISCONNECTED') DEFAULT 'CONNECTED',
        `latency_ms` INT DEFAULT 45,
        `last_ping` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `applications` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `application_id` VARCHAR(50) UNIQUE NOT NULL,
        `citizen_id` VARCHAR(50) NOT NULL,
        `department` VARCHAR(100) NOT NULL,
        `scheme_service` VARCHAR(255) NOT NULL,
        `submission_date` DATE NOT NULL,
        `status` ENUM('SUBMITTED', 'UNDER_VERIFICATION', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED') DEFAULT 'SUBMITTED',
        `last_updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `application_workflows` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `application_id` VARCHAR(50) NOT NULL,
        `department` VARCHAR(100) NOT NULL,
        `current_status` VARCHAR(50) NOT NULL,
        `previous_status` VARCHAR(50) DEFAULT NULL,
        `changed_by` VARCHAR(100) NOT NULL,
        `changed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `comments` TEXT DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `audit_logs` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `api_logs` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `endpoint` VARCHAR(255) NOT NULL,
        `method` VARCHAR(10) NOT NULL,
        `department` VARCHAR(100) NOT NULL,
        `request_payload` TEXT DEFAULT NULL,
        `response_code` INT NOT NULL,
        `response_time_ms` INT NOT NULL,
        `retry_count` INT DEFAULT 0,
        `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `integration_status` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `metric_name` VARCHAR(100) UNIQUE NOT NULL,
        `metric_value` VARCHAR(255) NOT NULL,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `chat_sessions` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `citizen_id` VARCHAR(50) DEFAULT 'CIT-1001',
        `session_id` VARCHAR(100) NOT NULL,
        `language` VARCHAR(10) DEFAULT 'en',
        `last_message` TEXT DEFAULT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `scheme_translations` (
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
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // SEED 569 SCHEMES FROM SEED JSON
    $seedJsonPath = __DIR__ . '/schemes_seed.json';
    if (file_exists($seedJsonPath)) {
        $schemesSeed = json_decode(file_get_contents($seedJsonPath), true);
        if (is_array($schemesSeed) && count($schemesSeed) > 0) {
            $stmtCount = $pdo->query("SELECT COUNT(*) FROM `schemes`");
            $existingDbCount = $stmtCount->fetchColumn();

            if ($existingDbCount < 500) {
                $stmtInsert = $pdo->prepare("INSERT INTO `schemes` (`scheme_id`, `official_scheme_code`, `title`, `normalized_name`, `category`, `sector`, `govt_level`, `state_ut`, `min_age`, `max_age`, `max_income`, `target_gender`, `target_occupation`, `description`, `benefits`, `documents`, `link`, `source_url`, `helpline`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `title` = VALUES(`title`)");

                $stmtTrans = $pdo->prepare("INSERT INTO `scheme_translations` (`scheme_id`, `language_code`, `scheme_name`, `description`, `eligibility`, `benefits`, `documents`) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `scheme_name` = VALUES(`scheme_name`)");

                foreach ($schemesSeed as $s) {
                    $schId = $s['scheme_id'] ?? $s['slug'];
                    $code = $s['officialSchemeCode'] ?? $s['official_scheme_code'];
                    $title = $s['nameEn'] ?? $s['title'];
                    $norm = strtolower(preg_replace('/[^a-z0-9]/', '', $title));
                    $cat = $s['category'] ?? 'General';
                    $govt = $s['govtLevel'] ?? $s['govt_level'] ?? 'Central';
                    $st = $s['stateUt'] ?? $s['state_ut'] ?? 'All India';
                    $minAge = intval($s['eligibilityCriteria']['minAge'] ?? $s['min_age'] ?? 18);
                    $maxAge = intval($s['eligibilityCriteria']['maxAge'] ?? $s['max_age'] ?? 75);
                    $maxInc = intval($s['eligibilityCriteria']['maxIncome'] ?? $s['max_income'] ?? 500000);
                    $gender = $s['eligibilityCriteria']['gender'] ?? $s['target_gender'] ?? 'All';
                    $targetRole = $s['targetUser'] ?? $s['target_occupation'] ?? 'citizen';
                    $descEn = $s['descriptionEn'] ?? $s['description'] ?? '';
                    $benefitsEn = $s['benefitsEn'] ?? $s['benefits'] ?? '';
                    $docsEn = is_array($s['requiredDocumentsEn'] ?? null) ? implode(', ', $s['requiredDocumentsEn']) : ($s['documents'] ?? '');
                    $link = $s['officialUrl'] ?? $s['link'] ?? '#';

                    try {
                        $stmtInsert->execute([$schId, $code, $title, $norm, $cat, $cat, $govt, $st, $minAge, $maxAge, $maxInc, $gender, $targetRole, $descEn, $benefitsEn, $docsEn, $link, $link, '1800-111-555']);

                        // Insert translations
                        $stmtTrans->execute([$schId, 'en', $title, $descEn, $s['eligibilityTextEn'] ?? $descEn, $benefitsEn, $docsEn]);
                        if (!empty($s['nameMr'])) {
                            $stmtTrans->execute([$schId, 'mr', $s['nameMr'], $s['descriptionMr'] ?? $descEn, $s['eligibilityTextMr'] ?? $descEn, $s['benefitsMr'] ?? $benefitsEn, is_array($s['requiredDocumentsMr'] ?? null) ? implode(', ', $s['requiredDocumentsMr']) : $docsEn]);
                        }
                        if (!empty($s['nameHi'])) {
                            $stmtTrans->execute([$schId, 'hi', $s['nameHi'], $s['descriptionHi'] ?? $descEn, $s['eligibilityTextHi'] ?? $descEn, $s['benefitsHi'] ?? $benefitsEn, is_array($s['requiredDocumentsHi'] ?? null) ? implode(', ', $s['requiredDocumentsHi']) : $docsEn]);
                        }
                    } catch (Exception $ex) {
                        // ignore duplicate rows
                    }
                }
            }
        }
    }

    // SEED INITIAL USERS
    $pdo->exec("INSERT INTO `users` (`name`, `email`, `phone`, `password`, `role`, `user_type`, `state`, `district`, `income`) VALUES
    ('Admin Official', 'admin@jansathi.gov.in', '9876543210', 'admin123', 'admin', 'admin', 'Maharashtra', 'Mumbai', 500000),
    ('Demo Citizen', 'citizen@jansathi.gov.in', '9812345678', 'password123', 'citizen', 'citizen', 'Maharashtra', 'Pune', 180000)
    ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);");

    // SEED UNIFIED PROFILES
    $pdo->exec("INSERT INTO `unified_profiles` (`citizen_id`, `user_id`, `name`, `age`, `education`, `category_caste`, `address`, `state`, `district`, `occupation`, `mobile`, `email`, `annual_income`, `land_holding`) VALUES
    ('CIT-1001', 2, 'Sunita Kamble', 34, '12th Pass', 'SC', 'Ward No 3, Janpuri', 'Maharashtra', 'Solapur', 'Citizen / Self-Employed', '9812345678', 'sunita.citizen@jansathi.in', 120000, 0.0),
    ('CIT-1002', 1, 'Aniket Patil', 20, 'Graduate (BE Computer)', 'OBC', 'Main Road, Janpuri', 'Maharashtra', 'Latur', 'Student', '9422188990', 'aniket.student@jansathi.in', 150000, 0.0),
    ('CIT-1003', 1, 'Ganesh Deshmukh', 42, '10th Pass', 'General', 'Farm Sector 4, Janpuri', 'Maharashtra', 'Yavatmal', 'Farmer', '9822011223', 'ganesh.farmer@jansathi.in', 180000, 3.5)
    ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);");

    // SEED CONSENTS
    $pdo->exec("INSERT INTO `consents` (`citizen_id`, `department`, `data_requested`, `purpose`, `status`) VALUES
    ('CIT-1001', 'Education Department', 'Name, Age, Annual Income, Education', 'Scholarship eligibility verification', 'ALLOWED'),
    ('CIT-1001', 'Agriculture Department', 'Name, Address, Land Holding', 'PM-Kisan & Fasal Bima Subsidy', 'ALLOWED'),
    ('CIT-1001', 'Healthcare Department', 'Name, Age, Gender, Mobile', 'Ayushman Bharat ABHA Health Card', 'ALLOWED'),
    ('CIT-1001', 'Transport Department', 'Name, Age, Education Proof', 'MSRTC Bus Concession Pass', 'ALLOWED')
    ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);");

    // SEED DEPARTMENT CONNECTIONS
    $pdo->exec("INSERT INTO `department_connections` (`code`, `name`, `endpoint`, `auth_type`, `status`, `latency_ms`) VALUES
    ('EducationConnector', 'Education Department', 'https://api.education.gov.in/v1', 'Bearer OAuth2', 'CONNECTED', 45),
    ('AgricultureConnector', 'Agriculture Department', 'https://api.krishi.gov.in/v2', 'Bearer OAuth2', 'CONNECTED', 62),
    ('HealthcareConnector', 'Healthcare Department', 'https://api.health.abdm.gov.in/v1', 'Bearer OAuth2', 'CONNECTED', 38),
    ('TransportConnector', 'Transport Department', 'https://api.sarathi.parivahan.gov.in/v1', 'Bearer OAuth2', 'CONNECTED', 51)
    ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);");

    // SEED APPLICATIONS
    $pdo->exec("INSERT INTO `applications` (`application_id`, `citizen_id`, `department`, `scheme_service`, `submission_date`, `status`) VALUES
    ('EDU1024', 'CIT-1001', 'Education Department', 'Post-Matric Scholarship', '2026-09-15', 'UNDER_REVIEW'),
    ('AGR2045', 'CIT-1001', 'Agriculture Department', 'PM-Kisan Samman Nidhi', '2026-09-10', 'APPROVED'),
    ('HLT3056', 'CIT-1001', 'Healthcare Department', 'Ayushman Bharat Card', '2026-09-20', 'SUBMITTED'),
    ('TRP4088', 'CIT-1001', 'Transport Department', 'MSRTC Concession Pass', '2026-09-18', 'COMPLETED')
    ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);");

    // SEED WORKFLOWS
    $pdo->exec("INSERT INTO `application_workflows` (`application_id`, `department`, `current_status`, `previous_status`, `changed_by`, `comments`) VALUES
    ('EDU1024', 'Education Department', 'SUBMITTED', NULL, 'Sunita Kamble', 'Submitted online via JanSathi Portal'),
    ('EDU1024', 'Education Department', 'UNDER_VERIFICATION', 'SUBMITTED', 'Automated Verification Engine', 'Verified Aadhaar and Income Certificate'),
    ('EDU1024', 'Education Department', 'UNDER_REVIEW', 'UNDER_VERIFICATION', 'Nodal Officer (Higher Ed)', 'College income endorsement verified')
    ON DUPLICATE KEY UPDATE `current_status` = VALUES(`current_status`);");

    // SEED AUDIT LOGS
    $pdo->exec("INSERT INTO `audit_logs` (`user_id`, `role`, `action`, `resource`, `resource_id`, `department`, `status`, `details`) VALUES
    ('CIT-1001', 'Citizen', 'Login', 'Auth', 'SSO-SESSION-1001', 'JanSathi SSO', 'SUCCESS', 'Single Sign-On login via JanSathi Credential Manager'),
    ('CIT-1001', 'Citizen', 'Consent Given', 'Consent', 'CNS-101', 'Education Department', 'SUCCESS', 'Granted data access for Post-Matric Scholarship'),
    ('CIT-1001', 'Citizen', 'Application Submitted', 'Application', 'EDU1024', 'Education Department', 'SUCCESS', 'Submitted Post-Matric Scholarship application via EducationConnector')
    ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);");

    echo json_encode(["status" => "success", "message" => "Database tables and interoperability schema initialized successfully."]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database init failed: " . $e->getMessage()]);
}
?>
