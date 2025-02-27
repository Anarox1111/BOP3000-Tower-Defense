import { Tower, towers } from "../entities/tower.js";
import { money, updateMoney } from "./game.js";

export function handleCanvasClick(event) {
    const canvas = document.getElementById("gameCanvas");
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / 50) * 50;
    const y = Math.floor((event.clientY - rect.top) / 50) * 50;

    if (money >= 20) {
        const newLaserTower = new Tower(x, y, "laser"); // Bruker valgt tårntype
        const newRocketTower = new Tower(x, y, "rocket");
        //const newNormalTower = new Tower(x, y, "normal");
        towers.push(newLaserTower, newRocketTower);
        money -= 20;
        moneyDisplay.innerText = money;
    }
    
}

export function  handleCanvasUpgrade(event) {
    const canvas = document.getElementById("contextmenu");
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / gridSize) * gridSize;
    const y = Math.floor((event.clientY - rect.top) / gridSize) * gridSize;
    towers.forEach(tower => {
        if (tower.x === x && tower.y === y) {
            tower.upgrade();
        }
    });
};

