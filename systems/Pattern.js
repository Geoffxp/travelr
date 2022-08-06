export default class Pattern {
    constructor(x1, y1, game) {
        this.rate = 6.265;
        this.game = game;
        this.factor = 0.25;
        this.x1 = x1;
        this.x2 = game.width + (this.x1 - game.width / 2) * this.factor;
        this.y1 = y1;
        this.y2 = game.height;
        this.offScreen = false;
    }
    update() {
        if (this.x1 < 0) {
            this.offScreen = true
        }
        this.x1 -= this.rate
        this.x2 = this.x1 + (this.x1 - this.game.width / 2) * this.factor
    }
    draw(ctx) {
        const grd = ctx.createRadialGradient(this.game.width / 3, this.game.height, 0, this.game.width / 3, this.game.height, 500)
        grd.addColorStop(0, "rgb(200,200,200)")
        grd.addColorStop(1, "black")
        ctx.strokeStyle = grd
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(this.x1, this.y1)
        ctx.lineTo(this.x2, this.y2)
        ctx.closePath()
        ctx.stroke()
    }
}