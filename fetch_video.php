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

        // レスポンスが空の場合
        if ($response === false) {
            throw new Exception('Failed to fetch data from YouTube API.');
        }

        // JSONとして返す
        header('Content-Type: application/json');
        echo $response;
    } catch (Exception $e) {
        // エラーが発生した場合にエラーメッセージを返す
        header('Content-Type: application/json', true, 500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    // GET以外のリクエストはエラーを返す
    header('Content-Type: application/json', true, 405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}

