import { enemies } from "../entities/enemy.js";
import { towers } from "../entities/tower.js";
import { projectiles } from "../entities/projectiles/projectiles.js";
import { drawGrid } from "./grid.js";
import { spawnWave, startWaveButton } from "./wave.js";
import { collision } from "./hitreg.js";


export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

const moneyDisplay = document.getElementById("money");
window.startWaveButton = startWaveButton;

export let money = 150;

export function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();

    enemies.forEach((enemy, index) => {
        enemy.move();
        enemy.draw(ctx);

        // When enemy dies, it gets removed.
        if (enemy.health <= 0) {
            enemies.splice(index, 1);
            updateMoney("increase", 10);
        }
    });


    towers.forEach(tower => {
        tower.attack(enemies, projectiles);
        tower.draw(ctx);
    });
    
}

export function updateMoney(action, amount) {
    if (typeof amount !== "number" || isNaN(amount)) {
        console.error("Invalid amount:", amount);
        return;
    }

    switch (action) {
        case "increase":
            money += amount;
            break;
        case "decrease":
            money -= amount;
            break;
        default:
            console.warn(`Unknown action: "${action}". No changes made.`);
            return;
    }

    moneyDisplay.innerText = money;
}

export function projHandler(){
    for (let i = 0; i < projectiles.length; i++){
        projectiles[i].move();
        projectiles[i].draw(ctx);
        
        // checks if projectile exists and is colliding with enemy, if true does damage, deletes projectile and reduces i by one to ensure a projectile is not skipped
        for (let j = 0; j < enemies.length; j++) {
            if (enemies[j] && projectiles[i] && collision(enemies[j], projectiles[i]) && !projectiles[i].hitEnemies.has(enemies[j])){
                projectiles[i].dealDamage(enemies[j])
                projectiles[i].hitEnemies.add(enemies[j])
                projectiles[i].pierceAmount--;

                if (projectiles[i].pierceAmount <= 0){
                    projectiles.splice(i, 1);
                    i--  
                    break; // to prevent an edge case that causes crashes
                }

            };
        }
        
        if (projectiles[i] && projectiles[i].x > canvas.width - 50) {
            projectiles.splice(i, 1);
            i--
        }  
    }
}


