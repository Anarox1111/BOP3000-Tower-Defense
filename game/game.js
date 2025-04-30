import { enemies, setEnemies } from "../entities/enemies/enemy.js";
import { towers } from "../entities/towers/tower.js";
import { projectiles } from "../entities/projectiles/projectiles.js";
import { createGrid, handleGameGrid, topBar } from "./grid.js";
import { startWaveButton } from "./wave.js";
import { collision } from "./hitreg.js";
import { getWave, tryEndWave } from "./wave.js";


export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

export const towerDamageElement = document.querySelector('.tower-damage');
export const towerUpgradePriceElement = document.querySelector('.tower-upgrade-price');
export const towerUpgradeElement = document.querySelector('.tower-upgrade-btn');


window.startWaveButton = startWaveButton;

export let money = 1000;
export let price = 50;
export let resources = 100;
export let gameOver;
export let isUpgradeBtnActive = false;

/**
 * Draw function that updates the grid and UI.
 *               

 *
 * @author:    Anarox
 * Created:   25.01.2025
 **/
export function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Topbar
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffa500';
    ctx.fillRect(0, 0, topBar.width, topBar.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText("💶 " + money, 20, topBar.height / 2);
    ctx.textAlign = 'center';
    ctx.fillText("⚒️ Resources: " + resources, canvas.width / 2, topBar.height / 2);
    ctx.textAlign = 'right';
    ctx.fillText("Wave: " + Math.max(1, getWave()), canvas.width - 20, topBar.height / 2);
    ctx.textAlign = 'center';
    
    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '50px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText("💀 Game Over 💀", canvas.width / 2, canvas.height / 2);
        return;
    }

    createGrid();
    handleGameGrid();

    enemies.forEach(enemy => {
        enemy.draw(ctx);
    });

    towers.forEach((tower) => {
        tower.draw(ctx);
    });

    for (let projectile of projectiles){
        projectile.draw(ctx);
    }
}

/**
 * Update function that updates in-game interactions, movement and stats.
 *               

 *
 * @author:    Anarox
 * Created:   28.01.2025
 **/
export function updateGameState() {
    
    let selectedTower = towers.find(tower => tower.selected);

    const enemiesArray = [];
    for (let enemy of enemies) {
        enemy.move();

        if (enemy.health <= 0) {
            updateMoney('increase', 20);
            updateResources('increase', 1);
            continue;
        }

        if (enemy.x + enemy.width < 0) {
            updateResources('decrease', 10);
            continue;
        }

        enemiesArray.push(enemy);
    }
    setEnemies(enemiesArray);
    tryEndWave();

    towers.forEach((tower, towerIndex) => {
        tower.stopEnemyMovement(enemies)
        tower.updateTowerCollision(enemies, towerIndex)
        tower.attack(enemies, projectiles);
    });
    
    if (resources <= 0) {
        gameOver = true;
    }

    updateTowerStats(selectedTower);
}    

/**
 * Updates money with ("increase"/decrease)
 *               

 * @param: action, amount
 * @author:    Anarox
 * Created:   25.01.2025
 **/
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

}


/**
 * Updates resources with ("increase"/decrease)
 *               

 * @param: action, amount
 * @author:    Anarox
 * Created:   25.01.2025
 **/
export function updateResources(action, amount) {
    if (typeof amount !== "number" || isNaN(amount)) {
        console.error("Invalid amount:", amount);
        return;
    }

    switch (action) {
        case "increase":
            resources += amount;
            break;
        case "decrease":
            resources -= amount;
            break;
        default:
            console.warn(`Unknown action: "${action}". No changes made.`);
            return;
    }

}

/**
 * Updates the tower level with stars instead of a number.
 *               

 * @param: tower (Takes in selectedTower)
 * @author:    Anarox
 * Created:   09.03.2025
**/
export function updateTowerLevel(tower) {
    let stars = "";

    for (let i = 0; i <= tower.upgrades; i++) {
        stars += "⭐";
    }
    return stars;
}

/**
 * Updates the stat-display in Tower-section to show the selected tower and upgrade stats.
 *               

 * @param: tower (Takes in selectedTower)
 * @author:    Anarox
 * Created:   09.03.2025
**/
export function updateTowerStats(tower) {
    if (!tower) return;
    const canUpgrade = tower && money >= tower.upgradeCost;
    const stats = tower.getUpgradeStats();

    document.querySelector(".tower-title-display").textContent = tower.name;
    document.querySelector(".tower-lvl").textContent = updateTowerLevel(tower);

    if (canUpgrade) {
        document.querySelector(".hp-title-display").innerHTML = `${stats.oldStats.health} → ${stats.newStats.health}`;
        document.querySelector(".range-title-display").innerHTML = `${stats.oldStats.range} → ${stats.newStats.range}`;
        document.querySelector(".firerate-title-display").innerHTML = `${stats.oldStats.fireRate} → ${stats.newStats.fireRate}`;
        document.querySelector(".tower-upgrade-price").textContent = tower.upgradeCost;
        towerUpgradeElement.classList.add('upgrade', 'hover-upgrade', 'active');
        towerUpgradeElement.innerText = "UPGRADE ˋ°•*⁀➷";
    } else {
        document.querySelector(".hp-title-display").textContent = stats.oldStats.health;
        document.querySelector(".range-title-display").textContent = stats.oldStats.range;
        document.querySelector(".firerate-title-display").textContent = stats.oldStats.fireRate;
        document.querySelector(".tower-upgrade-price").textContent = stats.oldStats.upgradeCost;
        towerUpgradeElement.classList.remove('upgrade', 'hover-upgrade', 'active');
        towerUpgradeElement.innerText = "Insufficient balance";
    }
}


/**
 * Rewritten Projectile handler
 *               

 * @param: action, amount
 * @author:    Anarox, Quetzalcoatl
 * Created:   09.03.2025
**/
export function projectileHandler(){
    const activeProjectiles = [];

    for (let projectile of projectiles) {
        projectile.move();
        let finalHit = false;

        if (projectile.name === "laser" && projectile.localIframes > 0){
            projectile.localIframes--;
        }

        if (projectile.name === "laser") {
            for (let enemy of enemies) {
                if ( projectile.doesLaserHit(enemy) && projectile.localIframes <= 0 && projectile.lifetime > 0) {
                    projectile.dealDamage(enemy);
                    activeProjectiles.push(projectile);
                }
            }
        } else{

            for (let enemy of enemies) {
                if (collision(enemy, projectile, "boundingBox") && projectile.pierceAmount > 0 && !projectile.hitEnemies.has(enemy)) { // bruker bounding box hot detection for bullets

                    if (projectile.name == "rocket"){
                        projectile.dealDamage(enemy, enemies);
                    } else{
                        projectile.dealDamage(enemy);
                    }
                    if (projectile.pierceAmount <= 0){    // om du mener dette burde være en switch ta det opp med ask så fikser jeg det
                        finalHit = true;
                    }
                    break;
                }
            }
        }

        

        if (!finalHit && projectile.x < canvas.width - 50) {
            activeProjectiles.push(projectile);
        }
    }

    projectiles.length = 0;
    projectiles.push(...activeProjectiles);
}
