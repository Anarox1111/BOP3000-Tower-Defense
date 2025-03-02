import { Tower } from "./Tower.js";

export class RocketTower extends Tower {
    constructor(x, y) {
        super(x, y, "rocket");
        this.range = 550;
        this.fireRate = 40;
        this.damage = 10;
        this.background = "darkred";
    }
}
