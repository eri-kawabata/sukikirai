// カテゴリデータ
const categories = [
    { name: "動物", image: "./image/animals.png" },
    { name: "恐竜", image: "./image/dinosaur.png" },
    { name: "昆虫", image: "./image/insect.png" },
    { name: "植物", image: "./image/plant.png" },
    { name: "海の生き物", image: "./image/sea.png" },
    { name: "宇宙", image: "./image/space.png" },
    { name: "実験", image: "./image/experiment.png" },
    { name: "ロボット", image: "./image/robot.png" },
    { name: "絵画", image: "./image/art.png" },
    { name: "楽器の演奏", image: "./image/music.png" },
    { name: "サッカー", image: "./image/soccer.png" },
    { name: "野球", image: "./image/baseball.png" },
    { name: "水泳", image: "./image/swimming.png" },
    { name: "クッキング", image: "./image/cooking.png" },
    { name: "電車", image: "./image/train.png" },
    { name: "飛行機", image: "./image/plane.png" },
    { name: "車", image: "./image/car.png" },
];

let currentIndex = 0;
let resultData = [];

// ローディングスピナーの表示/非表示
function toggleLoadingSpinner(show) {
    const spinner = document.getElementById("loading-spinner");
    spinner.style.display = show ? "block" : "none";
}

// YouTube APIから動画を取得
async function fetchVideos(categoryName) {
    toggleLoadingSpinner(true); // ローディングスピナーを表示
    try {
        const response = await fetch(`./fetch_videos.php?q=${encodeURIComponent(categoryName)}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        const data = await response.json();
        toggleLoadingSpinner(false); // ローディングスピナーを非表示
        return data.items.map((item) => ({
            title: item.snippet.title,
            videoId: item.id.videoId,
        }));
    } catch (error) {
        toggleLoadingSpinner(false);
        console.error("YouTube API Error:", error);
        alert(`動画の取得に失敗しました: ${error.message}`);
        return [];
    }
}

// おすすめ動画の表示
async function showRecommendations() {
    const videoCardsContainer = document.getElementById("video-cards");
    const recommendedVideosSection = document.getElementById("recommended-videos");

    // セクションを非表示に初期化
    recommendedVideosSection.classList.remove("show");
    videoCardsContainer.innerHTML = ""; // 前の結果をクリア

    const lovedCategories = resultData.filter((item) => item.level === 3);

    if (lovedCategories.length === 0) {
        videoCardsContainer.innerHTML = `<p>おすすめ動画が見つかりませんでした。</p>`;
        recommendedVideosSection.classList.add("show"); // フェードイン表示
        return;
    }

    for (const item of lovedCategories) {
        const videos = await fetchVideos(item.name); // カテゴリに対応する動画を取得

        videos.forEach((video, index) => {
            const videoCard = document.createElement("div");
            videoCard.classList.add("video-card");

            // スライドインアニメーションを追加
            videoCard.style.animationDelay = `${index * 0.2}s`;

            videoCard.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${video.videoId}" 
                    allowfullscreen>
                </iframe>
                <div class="video-info">
                    <h3>${video.title}</h3>
                </div>
            `;

            videoCardsContainer.appendChild(videoCard);
        });
    }

    // セクションをフェードイン表示
    recommendedVideosSection.classList.add("show");
}

// 通知バナーの表示
function showNotification(message, level) {
    const notification = document.getElementById("notification");
    const colors = { 1: "#f8f4c8", 2: "#c8f8dc", 3: "#f8c8dc" };
    notification.style.backgroundColor = colors[level] || "#4caf50";
    notification.innerText = message;
    notification.classList.remove("hide");
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
        notification.classList.add("hide");
    }, 2000);
}

// 次の画像を読み込む
function loadImage() {
    const img = document.getElementById("random-image");

    if (currentIndex < categories.length) {
        const currentCategory = categories[currentIndex];
        img.src = currentCategory.image;
        img.setAttribute("data-category", currentCategory.name);
        img.style.display = "block";
    } else {
        img.style.display = "none";
        showRecommendations(); // すべてのカテゴリが評価された後におすすめを表示
    }
}

// ドラッグ＆ドロップのセットアップ
function setupDragAndDrop() {
    const img = document.getElementById("random-image");
    img.draggable = true;

    img.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", img.dataset.category);
    });

    document.querySelectorAll(".zone").forEach((zone) => {
        zone.addEventListener("dragover", (event) => event.preventDefault());
        zone.addEventListener("drop", (event) => {
            event.preventDefault();
            const category = event.dataTransfer.getData("text/plain");
            const level = zone.dataset.level;

            showNotification(`カテゴリ「${category}」をレベル${level}に振り分けました！`, level);
            saveToResults(category, level);
            currentIndex++;
            loadImage();
        });
    });
}

// 結果を保存
function saveToResults(category, level) {
    const categoryData = categories.find((cat) => cat.name === category);
    resultData.push({ ...categoryData, level });
}

// 初期化処理
loadImage();
setupDragAndDrop();
