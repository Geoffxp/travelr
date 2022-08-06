import Input from "../systems/Input.js";

function toDegrees(radians) {
    const pi = Math.PI;
    return radians * (180/pi);
}
function toRadians(degrees) {
    const pi = Math.PI;
    return degrees * (pi/180);
}

export default class Player {
    constructor(x, y, rotation, game, id, opponent) {
        this.id = id;
        this.size = 10;
        this.game = game;
        this.x = x;
        this.y = y;
        this.lastY = y;
        this.center = {
            x: x + (this.size / 2),
            y:0
        }
        this.rotation = rotation;
        this.moving = false;
        this.speed = 0;
        this.maxSpeed = 5;
        this.left = false;
        this.right = false;
        this.airborne = false;
        this.hangtime = 0;
        this.color = opponent ? "rgba(255, 255, 255, 0.5)" : "white";
        this.velo = 0;
        this.spawned = false;
        this.g = 9.8;
        this.floor = game.height * 0.85;
        this.halfG = false;
        if (!opponent) new Input(this, game);
    }
    start() {
        this.x = x;
        this.y = this.height * 0.85
        this.speed = 0;
        this.maxSpeed = 5;
        this.halfG = false;
        this.velo = 0;
        this.spawned = false;
        this.airborne = false;
        this.hangtime = 0;
    }
    accelerate() {
        if (this.speed < this.maxSpeed) this.speed += 0.1
    }
    gravity() {
        const gravity = this.halfG ? this.g / 4 : this.g
        if (this.airborne) {
            this.hangtime += 0.01;
            if (this.y + (this.velo + gravity * this.hangtime) > this.floor) {
                this.y = this.floor
                this.airborne = false;
                this.velo = 0;
                this.hangtime = 0
            } else {
                this.velo += gravity * this.hangtime
            }
        }
    }
    turn() {
        if (this.left) this.rotation -= 5
        if (this.right) this.rotation += 5
    }
    spawn() {
        this.spawned = true
    }
    update(ws) {
        this.floor = this.game.height * 0.85;
        if (this.jump) {
            this.velo = -10
            this.jump = false
            this.airborne = true
        }
        this.gravity()
        this.y += this.velo
        if (this.lastY != this.y) {
            this.lastY = this.y
            ws.send(JSON.stringify({currentY: this.y, score: this.game.score, playerId: this.id}))
        }
        this.center.y = this.y + (this.size / 2)
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
}