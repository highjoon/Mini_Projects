const container = document.querySelector(".image-container");
const playTime = document.querySelector(".play-time");
const startButton = document.querySelector(".start-button");
const gameText = document.querySelector("game-text");

const tileCount = 16;

function createImageTiles() {
    const tempArray = [];
    for (let i = 1; i <= tileCount; i++) {
        const li = document.createElement("li");
        li.setAttribute("data-index", i);
        li.setAttribute("class", `list${i}`);
        li.setAttribute("draggable", "true");
        tempArray.push(li);
    }
    return tempArray;
}
console.log(createImageTiles());

function shuffle(tiles) {
    let index = tiles.length - 1;
    while (index) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [tiles[index], tiles[randomIndex]] = [tiles[randomIndex], tiles[index]];
        index--;
    }
    return tiles;
}
console.log(shuffle(createImageTiles()));