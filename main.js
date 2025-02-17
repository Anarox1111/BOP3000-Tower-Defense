import { drawGrid } from "./game/grid.js";
import { updateGame } from "./game/game.js";
import { handleCanvasClick } from "./game/eventhandler.js";
import { projHandler } from "./game/game.js";
import { towers } from "./entities/tower.js";

const canvas = document.getElementById("gameCanvas");

canvas.addEventListener("click", handleCanvasClick);

function gameLoop() {
    updateGame();
    projHandler();
    console.log("kjører..")
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / gridSize) * gridSize;
    const y = Math.floor((event.clientY - rect.top) / gridSize) * gridSize;
    towers.forEach(tower => {
        if (tower.x === x && tower.y === y) {
            tower.upgrade();
        }
    });
});

gameLoop();
