<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $category = $data['category'] ?? '';
    $level = $data['level'] ?? '';

    if ($category && $level) {
        $entry = [
            'category' => $category,
            'level' => $level,
            'timestamp' => time()
        ];
        file_put_contents('data.json', json_encode($entry) . PHP_EOL, FILE_APPEND);
        echo json_encode(['status' => 'success', 'data' => $entry]); // デバッグ用
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    }
}


