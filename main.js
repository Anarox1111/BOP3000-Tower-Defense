import { drawGrid } from "./game/grid.js";
import { updateGame } from "./game/game.js";
import { handleCanvasClick, handleCanvasUpgrade } from "./game/eventhandler.js";
import { projHandler } from "./game/game.js";
import { towers } from "./entities/tower.js";

const canvas = document.getElementById("gameCanvas");


canvas.addEventListener("click", handleCanvasClick);
canvas.addEventListener("contextmenu", handleCanvasUpgrade); 
function gameLoop() {
    updateGame();
    projHandler();
    console.log("kjører..")
    requestAnimationFrame(gameLoop);
}


gameLoop();
