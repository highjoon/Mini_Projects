const playTime = document.querySelector(".play-time");
const container = document.querySelector(".image-container");
const startBtn = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");

const LIST_CNT = 16;
const images = [];
const dragStart = {
    element: undefined,
    idx: undefined,
    className: undefined,
};

let randomImages = undefined;
let timeInterval = undefined;

// 게임 실행
function startGame() {
    placeImage();
    randomImages = setTimeout(() => {
        shuffle();
        startTimer();
    }, 500);
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
    images.forEach((x) => {
        x.setAttribute("draggable", "true");
        container.appendChild(x);
    });
}

// 타이머 작동
function startTimer() {
    let time = 0;
    timeInterval = setInterval(() => {
        playTime.innerText = time++;
    }, 1000);
}

// 시작 버튼 이벤트
startBtn.addEventListener("click", () => startGame());

// 이미지 dragstart 이벤트
container.addEventListener("dragstart", (e) => {
    let obj = e.target;
    dragStart.element = obj;
    dragStart.className = obj.className;
    dragStart.idx = Array(...obj.parentNode.children).indexOf(obj);
});

// 이미지 dragover 중 이벤트 전파 방지
container.addEventListener("dragover", (e) => e.preventDefault());

// 이미지 drop 이벤트. 이미지 퍼즐 교체
container.addEventListener("drop", (e) => {
    let obj = e.target;
    if (dragStart !== obj.className) {
        let originPlace = undefined;
        let isLast = false;

        if (dragStart.element.nextSibling) {
            originPlace = dragStart.element.nextSibling;
        } else {
            originPlace = dragStart.element.previousSibling;
            isLast = true;
        }

        const droppedIdx = Array(...obj.parentNode.children).indexOf(obj);
        dragStart.idx > droppedIdx ? obj.before(dragStart.element) : obj.after(dragStart.element);
        isLast ? originPlace.after(obj) : originPlace.before(obj);
    }
});
