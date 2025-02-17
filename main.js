import { drawGrid } from "./game/grid.js";
import { updateGame } from "./game/game.js";
import { handleCanvasClick } from "./game/eventhandler.js";
import { projHandler } from "./game/game.js";

const canvas = document.getElementById("gameCanvas");

canvas.addEventListener("click", handleCanvasClick);

function gameLoop() {
    updateGame();
    projHandler();
    console.log("kjører..")
    requestAnimationFrame(gameLoop);
}

gameLoop();
