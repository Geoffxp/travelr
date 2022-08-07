import Player from "../players/Player.js";
import Obstacle from "./Obstacle.js";
import Pattern from "./Pattern.js";
const bg = document.querySelector("#bg")

export default class Game {
    constructor(width, height, ws) {
        this.width = width;
        this.height = height;
        this.state = "MENU";
        this.addTimer = Math.random() * 5;
        this.player;
        this.opponents = [];
        this.obstacles = [];
        this.score = 0;
        this.highScore = 0;
        this.patterns = [];
        this.roadWidth = 2;
        this.connections = 0;
        this.scores = {};
        this.ws = ws;
        ws.addEventListener('message', ({ data }) => {
            const parsedData = JSON.parse(data)
            this.connections = parsedData && parsedData.players ? parsedData.players.length : 0
            if (parsedData && parsedData.players) parsedData.players.forEach(player => this.scores[player.playerId] = player.score)
            // const opponents = parsedData && parsedData.players ? parsedData.players.filter(p => p.playerId !== this.player.id) : []
            // opponents.forEach(p => {
            //     if (!this.opponents.find(player => player.id === p.playerId)) {
            //         this.opponents.push(new Player(this.width / 3, this.height * 0.65, 90, this, p.playerId, true))
            //     }
            //     this.opponents.forEach(player => {
            //         if (player.id === p.playerId) {
            //             if (p.y) player.y = p.y
            //             player.hangtime = p.hangtime
            //             player.velo = p.velo
            //             player.jump = p.jump
            //             player.halfG = p.halfG
            //             player.airborne = p.airborne
            //         }
            //     })
            // })
        })

    }
    start() {
        this.state = "PLAY";
        this.player.start()
        this.obstacles = [];
        this.score = 0;
        this.patterns = [];
        this.patTimer = 0;
    }
    addPattern() {
        if (this.patTimer <= 0) {
            this.patterns.push(new Pattern(this.width, this.height * 0.72, this))
            this.patTimer = this.roadWidth
        }
        this.patterns = this.patterns.filter(pat => pat.offScreen === false)
    }
    addObstacle(game) {
        if (this.addTimer < 0) {
            this.obstacles.push(new Obstacle(game))
            this.addTimer = Math.random() * 5
        }
        this.obstacles = this.obstacles.filter(ob => ob.offscreen === false)
    }
    addPlayer(player) {
        this.player = player
    }
    addOpponent(player) {
        this.opponents.push(player)
    }
    removePlayer(playerId) {
        this.players.filter(player => player.id != playerId)
    }
    update(width, height, canvas) {
        canvas.width = width
        canvas.height = height
        this.width = width
        this.height = height
        if (this.state == "PLAY") {
            this.patterns.forEach(pat => pat.update())
            this.addTimer -= 0.1
            this.patTimer -= 0.1
            this.addPattern()
            this.addObstacle(this)
            this.obstacles.forEach(ob => this.score += ob.update())
        }
        this.player.update()
        this.opponents.forEach(o => o.update())
        this.highScore = Math.max(...Object.values(this.scores))
    }
    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height)
        ctx.filter = "brightness(0.5) blur(2px)"
        ctx.drawImage(bg, 0, 0, this.width, this.height)
        ctx.filter = "none"
        ctx.fillStyle = "rgba(50,180,235, 0.6)"
        const grd = ctx.createLinearGradient(this.width / 2, this.height, this.width / 2, 0)
        grd.addColorStop(0, "rgba(0,50,70,0.6)")
        grd.addColorStop(0.3, "rgba(0,0,0,0.8)")
        ctx.fillStyle = grd
        ctx.fillRect(0, this.height * 0.72, this.width, this.height)
        ctx.fillStyle = "pink"
        ctx.font = "50px monospace"
        ctx.fillText(`SCORE: ${this.score}`, this.width * 0.06, this.height * 0.06)
        ctx.fillText(`ACTIVE USERS: ${this.connections}`, this.width * 0.06, this.height * 0.06 + 52)
        ctx.fillText(`TOP SCORE: ${this.highScore}`, this.width * 0.06, this.height * 0.06 + 104)
        this.patterns.forEach(pat => pat.draw(ctx))
        this.obstacles.forEach(ob => ob.draw(ctx))
        this.player.draw(ctx)
        this.opponents.forEach(o => o.draw(ctx))
    }
}