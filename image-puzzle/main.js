const playTime = document.querySelector(".play-time");
const container = document.querySelector(".image-container");
const startBtn = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");

const LIST_CNT = 16;
const images = [];

let randomImages = undefined;

// 게임 실행
function startGame() {
    placeImage();
    randomImages = setTimeout(() => {
        shuffle();
    }, 4000);
}

// 이미지 초기 배치
function placeImage() {
    for (let i = 0; i < LIST_CNT; i++) {
        const img = document.createElement("li");
        img.setAttribute("class", `list${i}`);
        images.push(img);
    }
    images.forEach((x) => container.appendChild(x));
}

// 이미지 랜덤 배치
function shuffle() {
    container.innerHTML = "";
    const len = LIST_CNT - 1;
    for (let i = 0; i < len; i++) {
        const randomNumber = Math.floor(Math.random() * (len + 1));
        [images[i], images[randomNumber]] = [images[randomNumber], images[i]];
    }
    images.forEach((x) => container.appendChild(x));
}

startBtn.addEventListener("click", () => startGame());
