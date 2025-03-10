import { Enemy } from "./enemy.js";

/**
 * Boss Enemy class
 *
 * @author:    Anarox
 * Created:   25.01.2025
 **/
export class BossEnemy extends Enemy {
    constructor(row, wave) {
        super(row, wave);
        this.type = "boss";
        this.health = 500 + (wave - 1) * 50;
        this.speed = 0.8;
        this.background = "purple";
    }
}
