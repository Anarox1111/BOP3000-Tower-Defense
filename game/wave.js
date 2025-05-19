import { rows } from "./grid.js"; 
import { enemies, getRandomEnemyType } from "../entities/enemies/enemy.js";
import { createEnemy } from "../entities/enemies/enemyFactory.js";
import { Enemy } from "../entities/enemies/enemy.js";
import { updateFirebaseStats, gameStats } from "./game.js";

let wave = 0;
let isWaveStarted = false;
let waveInterval;

/**
 * spawnWave function that ensures enemies spawn and walk to a random lane
 *               

 * @param: waves, rows
 * @author:    Anarox
 * @contributor: Randomfevva
 * Created:   11.02.2025
**/
export async function spawnWave() {
    let test = false; // only used for bugfixing, removes wave time limit
    if (isWaveStarted && !test) {
        // Deny starting a new wave before all enemies are cleared
        return;
    };
    
    wave++;
    isWaveStarted = true;

    // Update wave stats
    gameStats.highestWaveReached = Math.max(gameStats.highestWaveReached, wave);
    
    // Check if this is a boss wave (every 5th wave)
    if (wave % 5 === 0) {
        gameStats.totalBossStagesReached++;
    }

    // Set amount of enemies to spawn
    const spawnEnemies = wave * 2;
    for (let i = 0; i < spawnEnemies; i++) {
        // Set random row to spawn the enemy
        let row = Math.floor(Math.random() * rows) + 1;
        // Create new enemy object and define enemy type
        const type = getRandomEnemyType(wave);
        const enemy = createEnemy(row, wave, type);

        // Push the enemy into the game
        enemies.push(enemy);
        // Wait before continue
        await wait(Math.max(100, 1000 - wave));
    }
}

export function startWaveButton() {
    spawnWave();
}

export function tryEndWave() {
    if (enemies.length === 0) {
        // Update stats at the end of each wave
        updateFirebaseStats();
        isWaveStarted = false; // Allow starting a new wave
        return true;
    }
    return false;
}

export function getWave() {
    return wave;
}

async function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
}

window.toggleAutoWave = () => {
    const autoWaveEnabled = document.getElementById('autoWaveCheckbox').checked;

    if (autoWaveEnabled) {
        waveInterval = setInterval(spawnWave, 500);
        console.log("Auto wave enabled");
    } else {
        clearInterval(waveInterval);
        console.log("Auto wave disabled");
    }
}
