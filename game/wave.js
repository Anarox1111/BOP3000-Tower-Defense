import { Enemy, enemies } from "../entities/enemy.js";
import { rows } from "./grid.js";

let wave = 1;

/*"export function spawnWave(waves, rows) {
    for (let i = 0; i < waves * 2; i++) {
        setTimeout(() => {
            let row = Math.floor(Math.random() * rows);
            enemies.push(new Enemy(row, waves));
        }, i * 1000);
    }
}*/
export function spawnWave(waves, rows) {
    for (let i = 0; i < wave * 2; i++) {
        setTimeout(() => {
            let row = Math.floor(Math.random() * rows);
            let type = Math.random() < 0.3 ? "fast" : Math.random() < 0.6 ? "tank" : "normal";
            enemies.push(new Enemy(row, waves, type));
            enemiesLeftDisplay.innerText = enemies.length;
        }, i * 1000);
    }
    wave++;
    waveDisplay.innerText = wave;
    waveInProgress = false;
}

export function startWaveButton() {
    console.log("funker")
    spawnWave(wave, rows);
    wave++;

}
