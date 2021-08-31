const playTime = document.querySelector(".play-time");
const container = document.querySelector(".image-container");
const startBtn = document.querySelector(".start-button");
const gameText = document.querySelector(".game-text");
const scoreCorrect = document.querySelector(".correct");
const scoreWrong = document.querySelector(".wrong");

const LIST_CNT = 16;
const dragStart = {
    element: undefined,
    idx: undefined,
    className: undefined,
};

let randomImages = undefined;
let timeInterval = undefined;
let time = 0;
let isPlaying = false;

// functions

// 게임 실행
function startGame() {
    isPlaying = true;
    endTimer();
    hideGameText();
    showContainer();
    tiles = placeImage();
    tiles.forEach((x) => container.appendChild(x));
    randomImages = setTimeout(() => {
        shuffle(tiles);
        startTimer();
    }, 4000);
}

// 정답 여부 체크
function checkStatus() {
    const current = Array(...container.children);
    const diffList = current.filter((value, idx) => Number(value.getAttribute("data-index")) !== idx);
    updateScore(diffList);
    if (diffList.length === 0) {
        isPlaying = false;
        showGameText();
        endTimer();
    }
}

// 점수 업데이트
function updateScore(arr) {
    let corr = LIST_CNT - arr.length;
    let wrng = arr.length;
    scoreCorrect.innerText = `${corr}`;
    scoreWrong.innerText = `${wrng}`;
}

// 이미지 초기 배치
function placeImage() {
    time = 0;
    playTime.innerText = time;
    clearContainer();
    const images = [];
    for (let i = 0; i < LIST_CNT; i++) {
        const img = document.createElement("li");
        img.setAttribute("data-index", i);
        img.setAttribute("class", `list${i}`);
        images.push(img);
    }
    return images;
}

// 이미지 랜덤 배치
function shuffle(images) {
    clearContainer();
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
    time = 0;
    timeInterval = setInterval(() => {
        playTime.innerText = time++;
    }, 1000);
}

// 타이머 정지
function endTimer() {
    clearInterval(timeInterval);
}

// 게임 종료 텍스트 출력
function showGameText() {
    startBtn.innerText = "Retry";
    gameText.style.display = "block";
}

// 게임 종료 텍스트 숨기기
function hideGameText() {
    gameText.style.display = "none";
}

// 이미지 컨테이너 출력
function showContainer() {
    container.style.visibility = "visible";
}

// 이미지 컨테이너 초기화
function clearContainer() {
    container.innerHTML = "";
}

// events

// 시작 버튼 이벤트
startBtn.addEventListener("click", () => startGame());

// 이미지 dragstart 이벤트
container.addEventListener("dragstart", (e) => {
    if (!isPlaying) return;
    let obj = e.target;
    dragStart.element = obj;
    dragStart.className = obj.className;
    dragStart.idx = Array(...obj.parentNode.children).indexOf(obj);
});

// 이미지 dragover 중 이벤트 전파 방지
container.addEventListener("dragover", (e) => e.preventDefault());

// 이미지 drop 이벤트. 이미지 퍼즐 교체
container.addEventListener("drop", (e) => {
    if (!isPlaying) return;
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
    checkStatus();
});
