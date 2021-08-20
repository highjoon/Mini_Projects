"use strict";
let GAME_DURATION_SEC = 2;

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
const chicken = document.querySelector(".chicken");

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
}

// 게임 중지
function stopGame() {
    started = false;
    stopBgSound();
    stopGameTimer();
    hideGameButton();
    showPopUpWithText();
    hideChickens();
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
