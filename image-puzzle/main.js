const container = document.querySelector(".image-container");
const playTime = document.querySelector(".play-time");
const startButton = document.querySelector(".start-button");
const gameText = document.querySelector("game-text");

const tileCount = 16;

function createImageTiles() {
    const tempArray = [];
    Array(tileCount)
        .fill()
        .forEach((_, i) => {
            const li = document.createElement("li");
            li.setAttribute("data-index", i);
            li.setAttribute("draggable", "true");
            li.setAttribute("class", `list${i}`);
            tempArray.push(li);
        });
    return tempArray;
}
console.log(createImageTiles());
