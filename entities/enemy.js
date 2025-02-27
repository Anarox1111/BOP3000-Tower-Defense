import { canvas, ctx } from "../game/game.js";

export class Enemy {
    constructor(row, wave, type = "normal") {
        this.x = canvas.width;
        this.y = row * 50; // maybe set to something like if (wave > 3){this.health = 100 + ((wave - 3) + 10)} + the else ofc. only an example of how to make start rounds easyer if they end up being hard
        this.width = 50;
        this.height = 50;
        this.laneIndex = row;
        if (type === "fast") {
            this.speed = 2;
            this.health = 50;
            this.color = "red";
        } else if (type === "tank") {
            this.speed = 0.5;
            this.health = 200;
            this.color = "orange";
        } else if (type === "boss") {
            this.speed = 0.8;
            this.health = 500;
            this.color = "purple";
        } else {
            this.speed = 1;
            this.health = 100 + (wave * 10);
            this.color = "darkred";
        }
    }

    move() {
        this.x -= this.speed;
        if (this.x <= 0) {
            let index = enemies.indexOf(this);
            if (index !== -1) {
                enemies.splice(index, 1); // Fjern kun denne fienden
                lives--; // Reduser ett liv per fiende
                livesDisplay.innerText = lives;
                if (lives <= 0) restartGame();
            }
        }
        
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.font = '20px Impact';
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30)
    }
    
}

export const enemies = [];
