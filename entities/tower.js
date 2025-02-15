import { BasicBullet } from "./projectiles/basicBullet.js";
import { BasicPierce } from "./projectiles/basicPierce.js";

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
                    bullets.push(new BasicPierce(this.x + 25, this.y + 25, this.laneIndex));
                }
            });
            this.timer = this.fireRate;
        } else {
            this.timer--;
        }
    }
    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, 50, 50);
    }
}

export const towers = [];
