<?php

// config.phpから設定を読み込む
$config = include('config.php');

// YouTube APIキーを取得
$apiKey = $config['YOUTUBE_API_KEY'];

// リクエストがGETの場合に処理
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // クエリパラメータから検索ワードを取得
    $query = htmlspecialchars($_GET['q'], ENT_QUOTES, 'UTF-8');

    // YouTube APIのURLを構築
    $url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q={$query}&type=video&maxResults=3&key={$apiKey}";

    try {
        // YouTube APIにリクエストを送信
        $response = file_get_contents($url);
        // 成功したらそのまま返す
        echo $response;
    } catch (Exception $e) {
        // エラーが発生した場合にエラーメッセージを返す
        echo json_encode(['status' => 'error', 'message' => 'Failed to fetch videos']);
    }
} else {
    // GET以外のリクエストはエラーを返す
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
