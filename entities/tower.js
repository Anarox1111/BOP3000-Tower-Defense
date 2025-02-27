import { BasicBullet } from "./projectiles/basicBullet.js";
import { eventHandler } from "../game/eventhandler.js";

export class Tower {
    constructor(x, y, row, type) {
        this.x = x;
        this.y = y;
        this.range = 700;
        this.fireRate = 60;
        this.timer = 0;
        this.laneIndex = row;
        this.type = type;
    }
    attack() {
        if (this.timer <= 0) {
            enemies.forEach(enemy => {
                if (Math.abs(enemy.y - this.y) < gridSize && Math.abs(enemy.x - this.x) < this.range) {
                    if (this.type === "laser") {
                        ctx.strokeStyle = "cyan";
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.moveTo(this.x + gridSize / 2, this.y + gridSize / 2);
                        ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
                        ctx.stroke();
                        enemy.health -= 30 * this.level;
                    } else if (this.type === "rocket") {
                        ctx.fillStyle = "red";
                        ctx.beginPath();
                        ctx.arc(this.x + gridSize / 2, this.y + gridSize / 2, 5, 0, Math.PI * 2);
                        ctx.fill();
                        bullets.push(new Bullet(this.x + gridSize / 2, this.y + gridSize / 2, this.level, "explosion"));
                        ctx.fillStyle = "orange";
                        ctx.beginPath();
                        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 15, 0, Math.PI * 2);
                        ctx.fill();
                        enemy.health -= 10 * this.level;
                    } else {
                        bullets.push(new Bullet(this.x + gridSize / 2, this.y + gridSize / 2, this.level));
                        enemy.health -= 20 * this.level;
                    }
                }
            });
            this.timer = this.fireRate;
        } else {
            this.timer--;
        }
    }

    upgrade() {
        if (money >= 30) {
            this.level++;
            this.range += 50;
            this.fireRate = Math.max(10, this.fireRate - 10);
            money -= 30;
            moneyDisplay.innerText = money;
        }
    }

    draw(ctx) {
        let towerColor = "blue";
        if (this.level >= 4) {
            towerColor = "purple";
        } else if (this.level >= 2) {
            towerColor = "green";
        }
        
        ctx.fillStyle = towerColor;
        ctx.fillRect(this.x, this.y, 50, 50);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.level, this.x + 50 / 2, this.y + 50 / 2 + 5);
    }
}
export function upgradeSelectedTower() {
    if (selectedTower) {
        selectedTower.upgrade();
    }
}

export const towers = [];
