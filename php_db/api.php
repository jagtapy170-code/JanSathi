<?php
// php_db/api.php - PHP MySQL REST Data API for Java Backend & JanSathi Frontend (SRS 3.0)
require_once __DIR__ . '/config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$pdo = getDBConnection();
$action = $_GET['action'] ?? $_POST['action'] ?? '';

$inputRaw = @file_get_contents('php://input');
$data = !empty($inputRaw) ? json_decode($inputRaw, true) : $_POST;

try {
    switch ($action) {
        // --- AUTH API (SRS 3.1) ---
        case 'login':
            $email = trim($data['email'] ?? '');
            $password = trim($data['password'] ?? '');
            
            $stmt = $pdo->prepare("SELECT * FROM `users` WHERE `email` = ? AND `password` = ?");
            $stmt->execute([$email, $password]);
            $user = $stmt->fetch();
            
            if ($user) {
                unset($user['password']);
                echo json_encode(["status" => "success", "user" => $user]);
            } else {
                http_response_code(401);
                echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
            }
            break;

        case 'register':
            $name = trim($data['name'] ?? '');
            $email = trim($data['email'] ?? '');
            $phone = trim($data['phone'] ?? '');
            $password = trim($data['password'] ?? 'user123');
            $user_type = trim($data['user_type'] ?? $data['role'] ?? 'citizen');
            $aadhaar = trim($data['aadhaar'] ?? '');
            $state = trim($data['state'] ?? 'Maharashtra');
            $district = trim($data['district'] ?? 'Pune');
            $caste_category = trim($data['caste_category'] ?? 'General');
            $gender = trim($data['gender'] ?? 'All');
            $income = intval($data['income'] ?? 0);
            
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM `users` WHERE `email` = ?");
            $stmt->execute([$email]);
            if ($stmt->fetchColumn() > 0) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "An account with this email already exists."]);
                exit;
            }
            
            $stmt = $pdo->prepare("INSERT INTO `users` (`name`, `email`, `phone`, `password`, `role`, `user_type`, `aadhaar`, `state`, `district`, `caste_category`, `gender`, `income`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$name, $email, $phone, $password, $user_type, $user_type, $aadhaar, $state, $district, $caste_category, $gender, $income]);
            $newId = $pdo->lastInsertId();
            
            echo json_encode([
                "status" => "success",
                "message" => "Registration successful",
                "user" => [
                    "id" => $newId,
                    "name" => $name,
                    "email" => $email,
                    "phone" => $phone,
                    "role" => $user_type,
                    "user_type" => $user_type,
                    "state" => $state,
                    "district" => $district
                ]
            ]);
            break;

        case 'reset_password':
            $email = trim($data['email'] ?? '');
            $new_password = trim($data['new_password'] ?? 'user123');
            
            $stmt = $pdo->prepare("UPDATE `users` SET `password` = ? WHERE `email` = ?");
            $stmt->execute([$new_password, $email]);
            if ($stmt->rowCount() > 0) {
                echo json_encode(["status" => "success", "message" => "Password reset successfully."]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "User account with this email not found."]);
            }
            break;

        // --- SCHEMES API (SRS 3.3 - Central vs State/UT Classification & 500+ Unique Schemes) ---
        case 'get_schemes':
            $category = $_GET['category'] ?? '';
            $govt_level = $_GET['govt_level'] ?? '';
            $state_ut = $_GET['state_ut'] ?? '';
            $search = $_GET['search'] ?? '';
            $lang = $_GET['language'] ?? $_GET['lang'] ?? 'mr';
            $limit = intval($_GET['limit'] ?? 1000);
            $offset = intval($_GET['offset'] ?? 0);
            
            $query = "SELECT s.*, COALESCE(st.scheme_name, s.title) as title, COALESCE(st.description, s.description) as description, COALESCE(st.eligibility, s.description) as eligibility_text FROM `schemes` s LEFT JOIN `scheme_translations` st ON s.scheme_id = st.scheme_id AND st.language_code = ? WHERE 1=1";
            $params = [$lang];
            
            if (!empty($category) && strtolower($category) !== 'all') {
                $query .= " AND s.`category` LIKE ?";
                $params[] = "%$category%";
            }
            if (!empty($govt_level) && strtolower($govt_level) !== 'all') {
                $query .= " AND s.`govt_level` LIKE ?";
                $params[] = "%$govt_level%";
            }
            if (!empty($state_ut) && strtolower($state_ut) !== 'all india' && strtolower($state_ut) !== 'all') {
                $query .= " AND (s.`state_ut` LIKE ? OR s.`state_ut` = 'All India')";
                $params[] = "%$state_ut%";
            }
            if (!empty($search)) {
                $query .= " AND (s.`title` LIKE ? OR s.`description` LIKE ? OR s.`sector` LIKE ? OR st.`scheme_name` LIKE ? OR s.`normalized_name` LIKE ?)";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
                $params[] = "%$search%";
            }
            
            $query .= " ORDER BY s.`id` ASC LIMIT $limit OFFSET $offset";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            $schemes = $stmt->fetchAll();
            
            echo json_encode(["status" => "success", "language" => $lang, "count" => count($schemes), "data" => $schemes]);
            break;

        case 'check_duplicates':
            $name = trim($data['title'] ?? $data['nameEn'] ?? $_GET['name'] ?? '');
            $code = trim($data['official_scheme_code'] ?? $data['officialSchemeCode'] ?? $_GET['code'] ?? '');
            $norm = strtolower(preg_replace('/[^a-z0-9]/', '', $name));

            $duplicates = [];
            
            if (!empty($norm)) {
                $stmt = $pdo->prepare("SELECT * FROM `schemes` WHERE `normalized_name` = ? OR `official_scheme_code` = ?");
                $stmt->execute([$norm, $code]);
                $exact = $stmt->fetchAll();
                foreach ($exact as $item) {
                    $duplicates[] = ["scheme" => $item, "similarity" => 100, "reason" => "Exact Match"];
                }

                if (empty($duplicates)) {
                    $stmt = $pdo->query("SELECT * FROM `schemes` LIMIT 1000");
                    $all = $stmt->fetchAll();
                    foreach ($all as $item) {
                        $itemNorm = $item['normalized_name'] ?? strtolower(preg_replace('/[^a-z0-9]/', '', $item['title']));
                        if (!empty($itemNorm) && !empty($norm)) {
                            similar_text($norm, $itemNorm, $percent);
                            if ($percent >= 85) {
                                $duplicates[] = ["scheme" => $item, "similarity" => round($percent), "reason" => "Similar Name Match"];
                            }
                        }
                    }
                }
            }

            echo json_encode([
                "status" => "success",
                "is_duplicate" => count($duplicates) > 0,
                "count" => count($duplicates),
                "duplicates" => $duplicates
            ]);
            break;

        case 'add_scheme':
            $title = trim($data['title'] ?? $data['nameEn'] ?? '');
            $norm = strtolower(preg_replace('/[^a-z0-9]/', '', $title));
            $scheme_id = trim($data['scheme_id'] ?? $data['slug'] ?? ('sch-' . time()));
            $official_scheme_code = trim($data['official_scheme_code'] ?? $data['officialSchemeCode'] ?? ('SCH-' . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT)));
            
            // Level 1 Duplicate Prevention
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM `schemes` WHERE `normalized_name` = ? OR `scheme_id` = ? OR `official_scheme_code` = ?");
            $stmt->execute([$norm, $scheme_id, $official_scheme_code]);
            if ($stmt->fetchColumn() > 0) {
                http_response_code(409);
                echo json_encode(["status" => "error", "message" => "Duplicate scheme detected! Scheme with this name or code already exists."]);
                exit;
            }

            $category = trim($data['category'] ?? 'General');
            $sector = trim($data['sector'] ?? 'Welfare');
            $govt_level = trim($data['govt_level'] ?? $data['govtLevel'] ?? 'Central');
            $state_ut = trim($data['state_ut'] ?? $data['stateUt'] ?? 'All India');
            $min_age = intval($data['min_age'] ?? $data['minAge'] ?? 18);
            $max_age = intval($data['max_age'] ?? $data['maxAge'] ?? 60);
            $max_income = intval($data['max_income'] ?? $data['maxIncome'] ?? 500000);
            $target_gender = trim($data['target_gender'] ?? $data['gender'] ?? 'all');
            $target_occupation = trim($data['target_occupation'] ?? $data['targetUser'] ?? 'all');
            $description = trim($data['description'] ?? $data['descriptionEn'] ?? '');
            $benefits = trim($data['benefits'] ?? $data['benefitsEn'] ?? '');
            $documents = trim(is_array($data['documents'] ?? null) ? implode(', ', $data['documents']) : ($data['documents'] ?? ''));
            $link = trim($data['link'] ?? $data['officialUrl'] ?? '#');
            $source_url = trim($data['source_url'] ?? $data['sourceUrl'] ?? $link);
            $helpline = trim($data['helpline'] ?? '1800-111-555');
            $opening_date = trim($data['opening_date'] ?? date('Y-01-01'));
            $closing_date = trim($data['closing_date'] ?? date('Y-12-31'));
            $last_verified_date = date('Y-m-d');
            
            $stmt = $pdo->prepare("INSERT INTO `schemes` (`scheme_id`, `official_scheme_code`, `title`, `normalized_name`, `category`, `sector`, `govt_level`, `state_ut`, `min_age`, `max_age`, `max_income`, `target_gender`, `target_occupation`, `description`, `benefits`, `documents`, `link`, `source_url`, `helpline`, `opening_date`, `closing_date`, `last_verified_date`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$scheme_id, $official_scheme_code, $title, $norm, $category, $sector, $govt_level, $state_ut, $min_age, $max_age, $max_income, $target_gender, $target_occupation, $description, $benefits, $documents, $link, $source_url, $helpline, $opening_date, $closing_date, $last_verified_date]);
            
            echo json_encode(["status" => "success", "message" => "Scheme added successfully", "scheme_id" => $scheme_id, "official_scheme_code" => $official_scheme_code]);
            break;

        case 'bulk_import':
            $items = $data['schemes'] ?? [];
            if (!is_array($items) || empty($items)) {
                echo json_encode(["status" => "error", "message" => "No schemes provided for bulk import."]);
                exit;
            }

            $imported = 0;
            $skipped = 0;
            $reports = [];

            foreach ($items as $item) {
                $title = trim($item['title'] ?? $item['nameEn'] ?? '');
                $norm = strtolower(preg_replace('/[^a-z0-9]/', '', $title));
                $scheme_id = trim($item['scheme_id'] ?? $item['slug'] ?? ('sch-' . uniqid()));
                $code = trim($item['official_scheme_code'] ?? $item['officialSchemeCode'] ?? ('SCH-' . str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT)));

                if (empty($title) || empty($norm)) {
                    $skipped++;
                    continue;
                }

                // Check duplicate in DB
                $stmt = $pdo->prepare("SELECT COUNT(*) FROM `schemes` WHERE `normalized_name` = ? OR `official_scheme_code` = ?");
                $stmt->execute([$norm, $code]);
                if ($stmt->fetchColumn() > 0) {
                    $skipped++;
                    $reports[] = ["title" => $title, "status" => "SKIPPED_DUPLICATE"];
                    continue;
                }

                $category = trim($item['category'] ?? 'General');
                $sector = trim($item['sector'] ?? 'Welfare');
                $govt_level = trim($item['govt_level'] ?? $item['govtLevel'] ?? 'Central');
                $state_ut = trim($item['state_ut'] ?? $item['stateUt'] ?? 'All India');
                $min_age = intval($item['min_age'] ?? $item['minAge'] ?? 18);
                $max_age = intval($item['max_age'] ?? $item['maxAge'] ?? 60);
                $max_income = intval($item['max_income'] ?? $item['maxIncome'] ?? 500000);
                $target_gender = trim($item['target_gender'] ?? $item['gender'] ?? 'all');
                $target_occupation = trim($item['target_occupation'] ?? $item['targetUser'] ?? 'all');
                $description = trim($item['description'] ?? $item['descriptionEn'] ?? '');
                $benefits = trim($item['benefits'] ?? $item['benefitsEn'] ?? '');
                $documents = trim(is_array($item['documents'] ?? null) ? implode(', ', $item['documents']) : ($item['documents'] ?? ''));
                $link = trim($item['link'] ?? $item['officialUrl'] ?? '#');

                try {
                    $stmt = $pdo->prepare("INSERT INTO `schemes` (`scheme_id`, `official_scheme_code`, `title`, `normalized_name`, `category`, `sector`, `govt_level`, `state_ut`, `min_age`, `max_age`, `max_income`, `target_gender`, `target_occupation`, `description`, `benefits`, `documents`, `link`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                    $stmt->execute([$scheme_id, $code, $title, $norm, $category, $sector, $govt_level, $state_ut, $min_age, $max_age, $max_income, $target_gender, $target_occupation, $description, $benefits, $documents, $link]);
                    $imported++;
                    $reports[] = ["title" => $title, "status" => "IMPORTED"];
                } catch (Exception $e) {
                    $skipped++;
                }
            }

            echo json_encode([
                "status" => "success",
                "total_rows" => count($items),
                "imported" => $imported,
                "duplicates_skipped" => $skipped,
                "report" => $reports
            ]);
            break;

        case 'delete_scheme':
            $scheme_id = trim($data['scheme_id'] ?? $_GET['scheme_id'] ?? '');
            $stmt = $pdo->prepare("DELETE FROM `schemes` WHERE `scheme_id` = ?");
            $stmt->execute([$scheme_id]);
            echo json_encode(["status" => "success", "message" => "Scheme $scheme_id deleted successfully."]);
            break;

        // --- ELIGIBILITY CHECKER (SRS 3.2) ---
        case 'check_eligibility':
            $age = intval($data['age'] ?? 25);
            $income = intval($data['income'] ?? 150000);
            $gender = strtolower(trim($data['gender'] ?? 'all'));
            $occupation = strtolower(trim($data['occupation'] ?? 'all'));

            $stmt = $pdo->query("SELECT * FROM `schemes` WHERE `status` = 'active'");
            $allSchemes = $stmt->fetchAll();
            $eligibleList = [];

            foreach ($allSchemes as $sch) {
                $score = 100;
                $reasons = [];

                if ($age < $sch['min_age'] || $age > $sch['max_age']) {
                    $score -= 40;
                    $reasons[] = "Age criteria ({$sch['min_age']}-{$sch['max_age']} yrs) adjustment needed.";
                }
                if ($income > $sch['max_income']) {
                    $score -= 40;
                    $reasons[] = "Annual income exceeds threshold of ₹" . number_format($sch['max_income']);
                }
                if ($sch['target_gender'] !== 'all' && strtolower($sch['target_gender']) !== $gender) {
                    $score -= 30;
                    $reasons[] = "Gender requirement applies for {$sch['target_gender']}.";
                }

                if ($score >= 60) {
                    $sch['match_score'] = max(60, $score);
                    $sch['remarks'] = empty($reasons) ? "Fully Eligible" : implode(" ", $reasons);
                    $eligibleList[] = $sch;
                }
            }

            echo json_encode(["status" => "success", "count" => count($eligibleList), "data" => $eligibleList]);
            break;

        // --- GRIEVANCE API (SRS 3.7) ---
        case 'get_grievances':
            $user_id = $_GET['user_id'] ?? null;
            $tracking_id = $_GET['tracking_id'] ?? null;
            
            if ($tracking_id) {
                $stmt = $pdo->prepare("SELECT * FROM `grievances` WHERE `tracking_id` = ?");
                $stmt->execute([$tracking_id]);
                $item = $stmt->fetch();
                if ($item) {
                    echo json_encode(["status" => "success", "data" => $item]);
                } else {
                    http_response_code(404);
                    echo json_encode(["status" => "error", "message" => "Grievance ticket not found."]);
                }
            } else if ($user_id) {
                $stmt = $pdo->prepare("SELECT * FROM `grievances` WHERE `user_id` = ? ORDER BY `id` DESC");
                $stmt->execute([$user_id]);
                echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
            } else {
                $stmt = $pdo->query("SELECT * FROM `grievances` ORDER BY `id` DESC");
                echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
            }
            break;

        case 'submit_grievance':
            $tracking_id = 'GRV-' . date('Y') . '-' . rand(1000, 9999);
            $user_id = $data['user_id'] ?? null;
            $name = trim($data['name'] ?? 'Citizen');
            $phone = trim($data['phone'] ?? '');
            $category = trim($data['category'] ?? 'General');
            $scheme_name = trim($data['scheme_name'] ?? 'General');
            $title = trim($data['title'] ?? '');
            $description = trim($data['description'] ?? '');
            $location = trim($data['location'] ?? 'India');

            $stmt = $pdo->prepare("INSERT INTO `grievances` (`tracking_id`, `user_id`, `name`, `phone`, `category`, `scheme_name`, `title`, `description`, `location`, `status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')");
            $stmt->execute([$tracking_id, $user_id, $name, $phone, $category, $scheme_name, $title, $description, $location]);

            echo json_encode([
                "status" => "success",
                "message" => "Grievance registered successfully",
                "tracking_id" => $tracking_id
            ]);
            break;

        case 'update_grievance':
            $tracking_id = trim($data['tracking_id'] ?? '');
            $status = trim($data['status'] ?? 'In Progress');
            $remarks = trim($data['remarks'] ?? '');

            $stmt = $pdo->prepare("UPDATE `grievances` SET `status` = ?, `remarks` = ? WHERE `tracking_id` = ?");
            $stmt->execute([$status, $remarks, $tracking_id]);

            echo json_encode(["status" => "success", "message" => "Grievance ticket $tracking_id updated successfully."]);
            break;

        // --- ANNOUNCEMENTS (SRS 3.11) ---
        case 'get_announcements':
            $stmt = $pdo->query("SELECT * FROM `announcements` ORDER BY `id` DESC");
            echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
            break;

        // --- NOTIFICATIONS (SRS 3.5) ---
        case 'get_notifications':
            $stmt = $pdo->query("SELECT * FROM `notifications` ORDER BY `id` DESC");
            echo json_encode(["status" => "success", "data" => $stmt->fetchAll()]);
            break;

        // --- ADMIN STATS (SRS 3.9) ---
        case 'get_admin_stats':
            $totalUsers = $pdo->query("SELECT COUNT(*) FROM `users`")->fetchColumn();
            $totalSchemes = $pdo->query("SELECT COUNT(*) FROM `schemes`")->fetchColumn();
            $totalGrievances = $pdo->query("SELECT COUNT(*) FROM `grievances`")->fetchColumn();
            $resolvedGrievances = $pdo->query("SELECT COUNT(*) FROM `grievances` WHERE `status` = 'Resolved'")->fetchColumn();

            echo json_encode([
                "status" => "success",
                "data" => [
                    "totalUsers" => intval($totalUsers),
                    "totalSchemes" => intval($totalSchemes),
                    "totalGrievances" => intval($totalGrievances),
                    "resolvedGrievances" => intval($resolvedGrievances),
                    "pendingGrievances" => intval($totalGrievances - $resolvedGrievances),
                    "resolutionRate" => $totalGrievances > 0 ? round(($resolvedGrievances / $totalGrievances) * 100, 1) : 100
                ]
            ]);
            break;

        default:
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Unknown or missing action parameter."]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "API Exception: " . $e->getMessage()]);
}
?>
