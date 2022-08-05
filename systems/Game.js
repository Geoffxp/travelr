import Player from "../players/Player.js";
import Obstacle from "./Obstacle.js";
import Pattern from "./Pattern.js";

export default class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.state = "MENU";
        this.addTimer = Math.random() * 5;
        this.players = [];
        this.obstacles = [];
        this.score = 0;
        this.patterns = [];
    }
    start() {
        this.state = "PLAY";
        this.addTimer = Math.random() * 5;
        this.players = [new Player(this.width / 3,this.height * 0.85,90, this)];
        this.obstacles = [];
        this.score = 0;
        this.patterns = [];
        let divisions = window.innerWidth;
        let divisor = window.innerWidth / 12;
        while (divisions > 0) {
            divisions -= divisor
            this.patterns.push(new Pattern(divisions, this.height * 0.72))
        }
    }
    addObstacle(game) {
        if (this.addTimer < 0) {
            this.obstacles.push(new Obstacle(game))
            this.addTimer = Math.random() * 5
        }
        this.obstacles = this.obstacles.filter(ob => ob.offscreen === false)
    }
    addPlayer(player) {
        this.players.push(player)
    }
    removePlayer(playerId) {
        this.players.filter(player => player.id != playerId)
    }
    update() {
        if (this.state == "PLAY") {
            this.patterns.forEach(pat => pat.update())
            this.addTimer -= 0.1
            this.addObstacle(this)
            this.obstacles.forEach(ob => this.score += ob.update())
            this.players.forEach(player => player.update());
        }
    }
    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height)
        const grd = ctx.createLinearGradient(0, 0, this.width, this.height)
        grd.addColorStop(0, "darkorange")
        grd.addColorStop(1, "pink")
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, this.width, this.height)
        ctx.fillStyle = "#00DDFF"
        ctx.fillRect(0, this.height * 0.72, this.width, this.height)
        ctx.fillStyle = "pink"
        ctx.font = "50px monospace"
        ctx.fillText(`SCORE: ${this.score}`, 200, 300)
        this.patterns.forEach(pat => pat.draw(ctx))
        this.obstacles.forEach(ob => ob.draw(ctx))
        this.players.forEach(player => player.draw(ctx))
    }
}