import { Cell } from "./cell.js";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 300;

// Global variables for gameboard
export const cellSize = 50;
export const cellGap = 3;
export const gameGrid = [];



// Topbar-controls + shop
export const topBar = {
    width: canvas.width,
    height: cellSize,
}
export let rows = Math.floor((canvas.height - topBar.height) / cellSize);

export function createGrid() {
    gameGrid.length = 0;
    for (let y = cellSize; y < canvas.height; y += cellSize) {
        for (let x = 0; x < canvas.width; x += cellSize) {
            gameGrid.push(new Cell(x, y));
        }
    }
}

export function handleGameGrid() {
    for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
    }
    // console.log(Math.floor((canvas.height - topBar.height) / cellSize));
}


 


 // const cols = 9;
// const gridSize = 50; 

// // Updates canvas size based on rows and columns
// canvas.width = cols * gridSize;
// canvas.height = rows * gridSize;

// export function drawGrid() {
//     ctx.strokeStyle = "gray";
//     ctx.lineWidth = 2;
    
//     for (let x = 0; x <= canvas.width; x += gridSize) {
//         ctx.beginPath();
//         ctx.moveTo(x, 0);
//         ctx.lineTo(x, canvas.height);
//         ctx.stroke();
//     }
//     for (let y = 0; y <= canvas.height; y += gridSize) {
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(canvas.width, y);
//         ctx.stroke();
//     }
// }
