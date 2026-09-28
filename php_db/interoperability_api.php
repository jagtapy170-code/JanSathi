<?php
// php_db/interoperability_api.php - Interoperability API Endpoints for JanSathi
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = $_GET['action'] ?? '';

try {
    $pdo = getDBConnection();

    switch ($action) {
        // --- 1. UNIFIED CITIZEN PROFILE (SIR-02) ---
        case 'get_profile':
            $citizen_id = $_GET['citizen_id'] ?? 'CIT-1001';
            $stmt = $pdo->prepare("SELECT * FROM `unified_profiles` WHERE `citizen_id` = ?");
            $stmt->execute([$citizen_id]);
            $profile = $stmt->fetch();
            if (!$profile) {
                $profile = [
                    "citizen_id" => "CIT-1001",
                    "name" => "Sunita Kamble",
                    "age" => 34,
                    "education" => "12th Pass",
                    "category_caste" => "SC",
                    "address" => "Ward No 3, Janpuri",
                    "state" => "Maharashtra",
                    "district" => "Solapur",
                    "occupation" => "Citizen",
                    "mobile" => "9812345678",
                    "email" => "sunita.citizen@jansathi.in",
                    "annual_income" => 120000,
                    "land_holding" => 0
                ];
            }
            echo json_encode(["status" => "success", "profile" => $profile]);
            break;

        case 'update_profile':
            $input = json_decode(file_get_contents('php://input'), true);
            $citizen_id = $input['citizen_id'] ?? 'CIT-1001';
            $name = $input['name'] ?? '';
            $age = $input['age'] ?? 30;
            $income = $input['annual_income'] ?? 150000;

            $stmt = $pdo->prepare("UPDATE `unified_profiles` SET `name` = ?, `age` = ?, `annual_income` = ? WHERE `citizen_id` = ?");
            $stmt->execute([$name, $age, $income, $citizen_id]);
            echo json_encode(["status" => "success", "message" => "Unified profile updated"]);
            break;

        // --- 2. CONSENT MANAGEMENT (SIR-03) ---
        case 'get_consents':
            $citizen_id = $_GET['citizen_id'] ?? 'CIT-1001';
            $stmt = $pdo->prepare("SELECT * FROM `consents` WHERE `citizen_id` = ?");
            $stmt->execute([$citizen_id]);
            $consents = $stmt->fetchAll();
            echo json_encode(["status" => "success", "consents" => $consents]);
            break;

        case 'update_consent':
            $input = json_decode(file_get_contents('php://input'), true);
            $consent_id = $input['id'] ?? 0;
            $status = $input['status'] ?? 'ALLOWED';

            $revoked_at = ($status === 'REVOKED' || $status === 'NOT_ALLOWED') ? date('Y-m-d H:i:s') : null;
            $stmt = $pdo->prepare("UPDATE `consents` SET `status` = ?, `revoked_at` = ? WHERE `id` = ?");
            $stmt->execute([$status, $revoked_at, $consent_id]);
            echo json_encode(["status" => "success", "message" => "Consent updated to " . $status]);
            break;

        // --- 3. UNIFIED APPLICATION TRACKING (SIR-06) ---
        case 'get_applications':
            $citizen_id = $_GET['citizen_id'] ?? 'CIT-1001';
            $stmt = $pdo->prepare("SELECT * FROM `applications` WHERE `citizen_id` = ? ORDER BY `id` DESC");
            $stmt->execute([$citizen_id]);
            $apps = $stmt->fetchAll();
            echo json_encode(["status" => "success", "applications" => $apps]);
            break;

        case 'submit_application':
            $input = json_decode(file_get_contents('php://input'), true);
            $app_id = $input['application_id'] ?? ('APP-' . rand(1000, 9999));
            $citizen_id = $input['citizen_id'] ?? 'CIT-1001';
            $dept = $input['department'] ?? 'Education Department';
            $service = $input['scheme_service'] ?? 'Scholarship';

            $stmt = $pdo->prepare("INSERT INTO `applications` (`application_id`, `citizen_id`, `department`, `scheme_service`, `submission_date`, `status`) VALUES (?, ?, ?, ?, CURDATE(), 'SUBMITTED')");
            $stmt->execute([$app_id, $citizen_id, $dept, $service]);

            // Add workflow entry
            $wf = $pdo->prepare("INSERT INTO `application_workflows` (`application_id`, `department`, `current_status`, `changed_by`, `comments`) VALUES (?, ?, 'SUBMITTED', 'Citizen Portal', 'Submitted online')");
            $wf->execute([$app_id, $dept]);

            echo json_encode(["status" => "success", "application_id" => $app_id, "message" => "Application submitted"]);
            break;

        // --- 4. WORKFLOW MANAGEMENT (SIR-07) ---
        case 'get_workflows':
            $app_id = $_GET['application_id'] ?? 'EDU1024';
            $stmt = $pdo->prepare("SELECT * FROM `application_workflows` WHERE `application_id` = ? ORDER BY `id` ASC");
            $stmt->execute([$app_id]);
            $wfs = $stmt->fetchAll();
            echo json_encode(["status" => "success", "workflows" => $wfs]);
            break;

        case 'update_workflow':
            $input = json_decode(file_get_contents('php://input'), true);
            $app_id = $input['application_id'] ?? '';
            $dept = $input['department'] ?? 'Department';
            $new_status = $input['status'] ?? 'UNDER_REVIEW';
            $comments = $input['comments'] ?? 'Workflow step triggered';
            $changed_by = $input['changed_by'] ?? 'Nodal Officer';

            $stmtPrev = $pdo->prepare("SELECT `status` FROM `applications` WHERE `application_id` = ?");
            $stmtPrev->execute([$app_id]);
            $prev = $stmtPrev->fetchColumn() ?: 'SUBMITTED';

            $stmtUpd = $pdo->prepare("UPDATE `applications` SET `status` = ? WHERE `application_id` = ?");
            $stmtUpd->execute([$new_status, $app_id]);

            $stmtIns = $pdo->prepare("INSERT INTO `application_workflows` (`application_id`, `department`, `current_status`, `previous_status`, `changed_by`, `comments`) VALUES (?, ?, ?, ?, ?, ?)");
            $stmtIns->execute([$app_id, $dept, $new_status, $prev, $changed_by, $comments]);

            echo json_encode(["status" => "success", "message" => "Workflow status updated to " . $new_status]);
            break;

        // --- 5. AUDIT LOGS (SIR-08) ---
        case 'get_audit_logs':
            $stmt = $pdo->query("SELECT * FROM `audit_logs` ORDER BY `id` DESC LIMIT 50");
            $logs = $stmt->fetchAll();
            echo json_encode(["status" => "success", "audit_logs" => $logs]);
            break;

        // --- 6. INTEGRATION MONITORING (SIR-09) ---
        case 'get_monitoring':
            $stmtCon = $pdo->query("SELECT * FROM `department_connections`");
            $connectors = $stmtCon->fetchAll();
            echo json_encode([
                "status" => "success",
                "metrics" => [
                    "availability" => "99.85%",
                    "avg_response_ms" => 42,
                    "total_requests" => 1250,
                    "successful_requests" => 1232,
                    "failed_requests" => 18,
                    "pending_requests" => 7,
                    "connectors" => $connectors
                ]
            ]);
            break;

        // --- 7. MOCK GOVERNMENT DEPARTMENT APIS (SIR-01 & SIR-05) ---
        case 'mock_education':
            echo json_encode([
                "department" => "Education Department",
                "api" => "MahADBT / Scholarship API Gateway",
                "status" => 200,
                "data" => [
                    "verified" => true,
                    "enrollment_no" => "EDU-BE-2024-991",
                    "scholarship_eligible" => true,
                    "max_reimbursement" => "100% Tuition Fee Waiver"
                ]
            ]);
            break;

        case 'mock_agriculture':
            echo json_encode([
                "department" => "Agriculture Department",
                "api" => "PM-Kisan & Krishi DBT Gateway",
                "status" => 200,
                "data" => [
                    "verified" => true,
                    "kisan_id" => "PMK-9921-MAH",
                    "land_record_712" => "Verified 3.5 Acres in Sector 4",
                    "dbt_installment" => "17th Installment Credited"
                ]
            ]);
            break;

        case 'mock_healthcare':
            echo json_encode([
                "department" => "Healthcare Department",
                "api" => "ABHA / Ayushman Bharat PM-JAY Gateway",
                "status" => 200,
                "data" => [
                    "verified" => true,
                    "abha_id" => "sunita@abha",
                    "health_cover" => "₹5,00,000 Annual Family Insurance Cover Active"
                ]
            ]);
            break;

        case 'mock_transport':
            echo json_encode([
                "department" => "Transport Department",
                "api" => "Sarathi / MSRTC Bus Concession Gateway",
                "status" => 200,
                "data" => [
                    "verified" => true,
                    "concession_pass_no" => "TRP-MSRTC-4410",
                    "discount" => "100% Free Travel Pass for Female Citizens"
                ]
            ]);
            break;

        default:
            echo json_encode(["status" => "success", "message" => "JanSathi Interoperability API Gateway Active"]);
            break;
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
