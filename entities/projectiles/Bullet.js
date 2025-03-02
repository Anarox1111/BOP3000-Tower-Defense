import { cellSize } from "../../game/grid.js";
import { resources } from "../../game/game.js";

/**
 * Enemy class
 *

 * @constructor x, y, row, type = "normal"
 * @author:    Anarox, Randomfevva
 * Created:   02.03.2025
 **/
export class Bullet {
    constructor(x, y, row, type = "normal") {
        this.x = x;
        this.y = y;
        this.speed = type === "laser" ? 10 : type === "explosion" ? 2 : 3;
        this.width = type === "explosion" ? 15 : 5;
        this.height = type === "explosion" ? 15 : 5;
        this.bulletDamage = type === "laser" ? 5 : type === "explosion" ? 10 : 2;
        this.laneIndex = row;
        this.type = type;
    }

    move() {
        this.x += this.speed;
    }

    draw(ctx) {
        if (this.type === "laser") {
            ctx.strokeStyle = "cyan";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.speed * 5, this.y);
            ctx.stroke();
        } else if (this.type === "explosion") {
            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = "black";
            ctx.fillRect(this.x + (cellSize / 2), this.y + (cellSize / 2), this.width, this.height);
        }
    }

    dealDamage(enemy) {
        const actualDamage = Math.max(this.bulletDamage, Math.round(this.bulletDamage * (resources / 200)));
        enemy.health -= actualDamage;
    }
}

export const bullets = [];
