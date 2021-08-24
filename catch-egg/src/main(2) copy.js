"use strict";
let GAME_DURATION_SEC = 60;
let CHICKEN_COUNT = 6;
let EGG_SPAWN_DURATION = 2000;
let EGG_DROP_DURATION = 5;
let CURRENTSCORE = 0;
let LEVEL_SCORE = 3;
let LEVEL = 1;
let FINAL_LEVEL = 10;

const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();

const popUp = document.querySelector(".pop-up");
const popUpRefreshBtn = document.querySelector(".pop-up__refresh");
const popUpLevelUpBtn = document.querySelector(".pop-up__levelUp");
const popUpMessage = document.querySelector(".pop-up__message");

const icon = gameBtn.querySelector(".fas");
const chickenFarm = document.querySelector(".chicken__farm");
const chicken = document.querySelectorAll(".chicken");
let chickenHeight = chicken.y;

const eggLine = document.querySelector(".egg__line");

const basketLine = document.querySelector(".basket__line");
const basket = document.querySelector(".basket");
const basketLineRect = basketLine.getBoundingClientRect();
const basketSize = 75;
const basketY = basket.y;
let basketX = 0;

const bgSound = new Audio("./sound/background.mp3");
const winSound = new Audio("./sound/game_win.mp3");
const eggCrackSound = new Audio("./sound/egg_crack.mp3");
const eggSpawnSound = new Audio("./sound/egg_spawn.mp3");
const loseSound = new Audio("./sound/game_lose.mp3");
const scoreSound = new Audio("./sound/scoring.mp3");
const alertSound = new Audio("./sound/alert.mp3");

let started = false;
let spawned = false;

let timer = undefined;
let spwaning = undefined;
let drop = undefined;
let crack = undefined;

// 게임 버튼 클릭하여 시작 또는 정지
gameBtn.addEventListener("click", () => {
    if (started) stopGame();
    else startGame();
});

// 게임 재시작 버튼 클릭
popUpRefreshBtn.addEventListener("click", () => {
    initGame();
    startGame();
    showGameButton();
    hidePopUp();
});

// 레벨업 버튼 클릭
popUpLevelUpBtn.addEventListener("click", () => {
    levelUp();
    startGame();
    showGameButton();
    hidePopUp();
});

// 게임 설정 초기화
function initGame() {
    GAME_DURATION_SEC = 60;
    CHICKEN_COUNT = 6;
    EGG_SPAWN_DURATION = 1500;
    EGG_DROP_DURATION = 5;
    CURRENTSCORE = 0;
    LEVEL_SCORE = 1;
    LEVEL = 1;
}

// 게임 시작
function startGame() {
    started = true;
    CURRENTSCORE = 0;
    updateScore();
    showBasket();
    playSound(bgSound);
    startGameTimer();
    showStopButton();
    showChickens();
    spawnEgg();
}

// 게임 정지
function stopGame() {
    started = false;
    spawned = false;
    stopSound(bgSound);
    hideBasket();
    stopGameTimer();
    hideGameButton();
    showPopUpWithText("REPLAY ❓");
    hideChickens();
    stopSpawnEgg();
    playSound(alertSound);
}

// 게임 종료
function finishGame(win) {
    started = false;
    spawned = false;
    stopSound(bgSound);
    stopGameTimer();
    hideGameButton();
    hideBasket();
    hideChickens();
    stopSpawnEgg();
    if (LEVEL === FINAL_LEVEL) {
        allClear();
    } else if (win) {
        showPopUpWithText("CONGRATULATIONS 👏👏👏", win);
        playSound(winSound);
    } else {
        showPopUpWithText("YOU LOST 💥💥💥", win);
        playSound(loseSound);
    }
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

// 타이머 정지
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

// 게임 정지 버튼 표시
function showStopButton() {
    icon.classList.remove("fa-play");
    icon.classList.add("fa-stop");
}

// 팝업창 표시
function showPopUpWithText(text, win) {
    if (win) {
        let NextLevel = LEVEL + 1;
        let NextScore = LEVEL_SCORE + 3;
        popUpMessage.innerHTML = text + "<br/>" + "Next Level : " + NextLevel + "<br/>" + "Next Score : " + NextScore;
    } else {
        popUpLevelUpBtn.classList.add("hide");
        popUpMessage.innerHTML = text + "<br/>" + "Current Level : " + LEVEL;
    }
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

// 바구니 표시
function showBasket() {
    basket.classList.remove("hide");
}

// 바구니 숨기기
function hideBasket() {
    basket.classList.add("hide");
}

const eggList = [];
for (let i = 0; i < CHICKEN_COUNT; i++) {
    eggList.push(chicken[i].getBoundingClientRect().x);
}

// 달걀 생성 및 떨어지기
function placeAndDropEgg(max, min) {
    let num = Math.floor(Math.random() * (max - min)) + min;
    let egg = document.createElement("img");
    egg.setAttribute("src", "./img/egg.png");
    egg.setAttribute("alt", "egg");
    egg.setAttribute("class", "egg");
    egg.style.position = "absolute";
    egg.style.left = `${eggList[num]}px`;
    egg.style.top = `${96}px`;
    eggLine.appendChild(egg);
    spawned = true;
    // dropEgg(egg);
}

// 달걀 배치 및 떨어지기
function spawnEgg() {
    let min = 0;
    let max = CHICKEN_COUNT;
    spwaning = setInterval(() => {
        placeAndDropEgg(max, min);
        playSound(eggSpawnSound);
    }, EGG_SPAWN_DURATION);
}

// 달걀 배치 정지
function stopSpawnEgg() {
    clearInterval(spwaning);
    while (eggLine.hasChildNodes()) {
        eggLine.removeChild(eggLine.childNodes[0]);
    }
}

// 달걀 떨어지기
function dropEgg(egg) {
    let eggX = egg.getBoundingClientRect().x;
    let eggY = egg.getBoundingClientRect().y;
    drop = setInterval(() => {
        egg.style.transform = `
            translateY(${eggY++}px)
        `;
        if (eggY === basketY - basketSize * 2) {
            if (started && spawned) {
                if (eggX >= basketX - Math.floor(basketSize / 2) && eggX <= basketX + (basketSize + Math.floor(basketSize / 2))) {
                    playSound(scoreSound);
                    egg.remove();
                    increaseScore();
                    updateScore();
                    if (CURRENTSCORE === LEVEL_SCORE) {
                        spawned = false;
                        finishGame(true, LEVEL);
                    }
                } else {
                    egg.remove();
                    crackEgg(eggX, eggY);
                    decreaseScore();
                    updateScore();
                    if (CURRENTSCORE === 0) {
                        spawned = false;
                        finishGame(false, LEVEL);
                    }
                }
            }
        }
    }, EGG_DROP_DURATION);
}

// 달걀 깨지기
function crackEgg(eggX, eggY) {
    let cracekdEgg = document.createElement("img");
    cracekdEgg.setAttribute("src", "./img/cracked-egg.png");
    cracekdEgg.setAttribute("alt", "crackedEgg");
    cracekdEgg.setAttribute("class", "crackedEgg");
    cracekdEgg.style.position = "absolute";
    cracekdEgg.style.left = `${eggX - 25}px`;
    cracekdEgg.style.top = `${eggY + 75}px`;
    if (started && spawned) {
        playSound(eggCrackSound);
        basketLine.appendChild(cracekdEgg);
        setTimeout(() => {
            cracekdEgg.remove();
        }, 200);
    } else {
        stopSound(eggCrackSound);
    }
}

// 점수 증가
function increaseScore() {
    if (started && spawned) CURRENTSCORE++;
    else return;
}

// 점수 감소
function decreaseScore() {
    if (CURRENTSCORE > 0 && started && spawned) CURRENTSCORE--;
    else return;
}

// 점수 갱신
function updateScore() {
    gameScore.innerText = CURRENTSCORE;
}

// 바구니 움직이기
document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    if (x >= basketLineRect.left + basketSize && x <= basketLineRect.right - basketSize) {
        basket.style.left = `${x - basketLineRect.left}px`;
        basketX = basket.getBoundingClientRect().x;
    }
});

// 레벨업
function levelUp() {
    LEVEL++;
    LEVEL_SCORE += 3;
    GAME_DURATION_SEC += 20;
    EGG_SPAWN_DURATION -= 160;
}

// 최종 승리
function allClear() {
    popUpLevelUpBtn.classList.add("hide");
    popUpMessage.innerHTML = `All Stage Clear 👍`;
    popUp.classList.remove("hide");
}

// 음악 시작하기
function playSound(sound) {
    sound.load();
    if (sound === bgSound) {
        sound.loop = true;
    }
    sound.play();
}

// 음악 정지하기
function stopSound(sound) {
    sound.pause();
}
