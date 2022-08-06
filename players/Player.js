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
        this.left = false;
        this.right = false;
        this.airborne = false;
        this.hangtime = 0;
        this.color = opponent ? "rgba(255, 255, 255, 0.5)" : "white";
        this.velo = 0;
        this.g = 9.8;
        this.floor = game.height * 0.85;
        this.halfG = false;
        this.opponent = opponent;
        if (!opponent) new Input(this, game);
    }
    start() {
        this.x = this.game.width / 3;
        this.y = this.floor;
        this.halfG = false;
        this.velo = 0;
        this.airborne = false;
        this.hangtime = 0;
        this.jump = false;
        this.game.ws.send(JSON.stringify({
            y: this.floor,
            jump: this.jump, 
            score: this.game.score, 
            playerId: this.id,
            halfG: this.halfG,
            airborne: this.airborne,
            hangtime: this.hangtime,
            velo: this.velo
        }))
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
    update() {
        if (this.jump) {
            this.velo = -10
            this.airborne = true
        }
        this.game.ws.send(JSON.stringify({
            jump: this.jump, 
            score: this.game.score, 
            playerId: this.id,
            halfG: this.halfG,
            airborne: this.airborne,
            hangtime: this.hangtime,
            velo: this.velo
        }))
        this.jump = false
        this.gravity()
        this.y += this.velo
        this.center.y = this.y + (this.size / 2)
    }
    draw(ctx) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        const grd = ctx.createRadialGradient(this.x,this.floor+10,5,this.x,this.floor+10,this.size+10);
        grd.addColorStop(0, "rgba(0,0,0,0.5)")
        grd.addColorStop(0.7, "rgba(0,0,0,0)")
        ctx.fillStyle = grd
        ctx.setTransform(new DOMMatrix([1,0,0,0.6,0,0]).translate(0,415,0))
        ctx.beginPath();
        ctx.ellipse(
            this.x, 
            this.floor + 10, 
            this.size + ((this.floor - this.y) * 0.1), 
            this.size - 5 + ((this.floor - this.y) * 0.03), 
            0, 
            0, 
            2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.setTransform(1,0,0,1,0,0)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
}