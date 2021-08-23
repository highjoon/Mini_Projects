"use strict";
let GAME_DURATION_SEC = 2;
let CHICKEN_COUNT = 6;
let EGG_DURATION = 1000;

const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();

const popUp = document.querySelector(".pop-up");
const popUpRefreshBtn = document.querySelector(".pop-up__refresh");
const popUpMessage = document.querySelector(".pop-up__message");

const icon = gameBtn.querySelector(".fas");
const chickenFarm = document.querySelector(".chicken__farm");
const chicken = document.querySelectorAll(".chicken");
const eggLine = document.querySelector(".egg__line");

const basketLine = document.querySelector(".basket__line");
const basket = document.querySelector(".basket");

const bgSound = new Audio("./sound/background.mp3");
const winSound = new Audio("./sound/game_win.mp3");
const eggCrackSound = new Audio("./sound/egg_crack.mp3");
const eggSpawnSound = new Audio("./sound/egg_spawn.mp3");
const loseSound = new Audio("./sound/game_lose.mp3");
const scoring = new Audio("./sound/scoring.mp3");

let started = false;
let timer = undefined;
let spwaning = undefined;
let drop = undefined;

// 게임 버튼 클릭하여 시작 또는 중지
gameBtn.addEventListener("click", () => {
    if (started) stopGame();
    else startGame();
});

// 게임 재시작 버튼 클릭
popUpRefreshBtn.addEventListener("click", () => {
    startGame();
    showGameButton();
    hidePopUp();
});

// 게임 시작
function startGame() {
    started = true;
    playBgSound();
    showStopButton();
    showChickens();
    spawnEgg();
}

// 게임 중지
function stopGame() {
    started = false;
    stopBgSound();
    stopGameTimer();
    hideGameButton();
    showPopUpWithText();
    hideChickens();
    pauseSpawnEgg();
}

// 타이머 시작
function startGameTimer() {
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(() => {
        if (remainingTimeSec <= 0) {
            clearInterval(timer);
            stopGame();
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000);
}

// 타이머 중지
function stopGameTimer() {
    clearInterval(timer);
}

// 제한시간 업데이트
function updateTimerText(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    gameTimer.innerText = `${minutes}:${seconds}`;
}

// 게임 시작 버튼 표시
function showStartButton() {
    icon.classList.remove("fa-stop");
    icon.classList.add("fa-play");
}

// 게임 버튼 보이기
function showGameButton() {
    gameBtn.classList.remove("hide");
}

// 게임 버튼 숨기기
function hideGameButton() {
    gameBtn.classList.add("hide");
}

// 게임 중지 버튼 표시
function showStopButton() {
    icon.classList.remove("fa-play");
    icon.classList.add("fa-stop");
}

// 팝업창 표시
function showPopUpWithText() {
    popUp.classList.remove("hide");
}

// 팝업창 숨기기
function hidePopUp() {
    popUp.classList.add("hide");
}

// 닭 표시
function showChickens() {
    chickenFarm.classList.remove("hide");
}

// 닭 숨기기
function hideChickens() {
    chickenFarm.classList.add("hide");
}

const eggList = [];
for (let i = 0; i < CHICKEN_COUNT; i++) {
    eggList.push(chicken[i].getBoundingClientRect().x);
}

// 달걀 생성
function createEgg(max, min) {
    let num = Math.floor(Math.random() * (max - min)) + min;
    let egg = document.createElement("img");
    egg.setAttribute("src", "./img/egg.png");
    egg.setAttribute("alt", "egg");
    egg.setAttribute("class", "egg");
    egg.style.position = "absolute";
    egg.style.left = `${eggList[num]}px`;
    egg.style.top = `96px`;
    eggLine.appendChild(egg);
    dropEgg(egg);
}

// 달걀 배치
function spawnEgg() {
    let min = 0;
    let max = CHICKEN_COUNT;
    spwaning = setInterval(() => {
        createEgg(max, min);
        playSpawnEgg();
    }, EGG_DURATION);
}

// 달걀 배치 중지
function pauseSpawnEgg() {
    clearInterval(spwaning);
    while (eggLine.hasChildNodes()) {
        eggLine.removeChild(eggLine.childNodes[0]);
    }
}

// 달걀 떨어지기
function dropEgg(egg) {
    console.log(egg.getBoundingClientRect().y);
    let eggY = egg.getBoundingClientRect().y;
    drop = setInterval(() => {
        egg.style.transform = `
            translateY(${eggY++}px)
        `;
    }, 10);
}

// 바구니 움직이기
const basketLineRect = basketLine.getBoundingClientRect();
const basketSize = 75;
document.addEventListener("mousemove", (e) => {
    const x = e.clientX;

    if (x >= basketLineRect.left + basketSize && x <= basketLineRect.right - basketSize) {
        basket.style.left = `${x - basketLineRect.left}px`;
    }
});

// 배경음악 시작하기
function playBgSound() {
    bgSound.load();
    bgSound.loop = true;
    bgSound.play();
}

// 배경음악 중지하기
function stopBgSound() {
    bgSound.pause();
}

// 달걀 소환 음악 시작하기
function playSpawnEgg() {
    eggSpawnSound.play();
}
