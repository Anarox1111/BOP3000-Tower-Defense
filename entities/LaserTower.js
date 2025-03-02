import { Tower } from "./Tower.js";

export class LaserTower extends Tower {
    constructor(x, y) {
        super(x, y, "laser");
        this.range = 600;
        this.fireRate = 15;
        this.damage = 5;
        this.background = "brown";
    }
}
