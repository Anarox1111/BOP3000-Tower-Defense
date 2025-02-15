import { drawGrid } from "./game/grid.js";
import { enemyHandler, updateGame } from "./game/game.js";
import { handleCanvasClick } from "./game/eventHandler.js";
import { projHandler } from "./game/game.js";

const canvas = document.getElementById("gameCanvas");

canvas.addEventListener("click", handleCanvasClick);

function gameLoop() {
    updateGame();
    projHandler();
    enemyHandler();
    console.log("kjører..")
    requestAnimationFrame(gameLoop);
}

gameLoop();
