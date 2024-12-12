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
    { name: "車", image: "./image/car.png" }
];

let currentIndex = 0;
let resultData = [];

// 通知バナーの表示
function showNotification(message, level) {
    const notification = document.getElementById("notification");
    const colors = {
        1: "#f8f4c8",
        2: "#c8f8dc",
        3: "#f8c8dc"
    };
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
        showResults();
    }
}

// ドラッグ＆ドロップ機能を設定
function setupDragAndDrop() {
    const img = document.getElementById("random-image");
    img.draggable = true;

    img.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", img.dataset.category);
    });

    const zones = document.querySelectorAll(".zone");
    zones.forEach((zone) => {
        zone.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

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

// 振り分け結果を保存
function saveToResults(category, level) {
    const categoryData = categories.find((cat) => cat.name === category);
    resultData.push({ ...categoryData, level });
}

// シャボン玉のような結果表示
function showResults() {
    const bubbleContainer = document.getElementById("bubble-container");

    // コンテナをクリア
    bubbleContainer.innerHTML = "";

    resultData.forEach((item) => {
        const bubble = document.createElement("div");
        bubble.classList.add("bubble");
        bubble.style.backgroundImage = `url(${item.image})`;

        // サイズ設定
        const sizes = {
            1: "50px",  // 普通
            2: "100px", // 好き
            3: "150px"  // 大好き
        };
        bubble.style.width = sizes[item.level];
        bubble.style.height = sizes[item.level];

        // ランダムな位置とアニメーション時間
        const duration = Math.random() * 5 + 5; // 5〜10秒
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.left = `${Math.random() * 100}vw`;

        bubbleContainer.appendChild(bubble);
    });
}

// 初期化
loadImage();
setupDragAndDrop();

