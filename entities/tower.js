import { BasicBullet } from "./projectiles/basicBullet.js";

export class Tower {
    constructor(x, y, row) {
        this.x = x;
        this.y = y;
        this.range = 700;
        this.fireRate = 60;
        this.timer = 0;
        this.laneIndex = row;
    }
    attack(enemies, bullets) {
        if (this.timer <= 0) {
            enemies.forEach(enemy => {
                if (Math.abs(enemy.y - this.y) < 10 && Math.abs(enemy.x - this.x) < this.range) {
                    bullets.push(new BasicBullet(this.x + 25, this.y + 25, this.laneIndex));
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
