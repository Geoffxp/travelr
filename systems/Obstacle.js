export default class Obstacle {
    constructor(game) {
        this.shape = "triangle"
        this.size = 40
        this.x = game.width + 50
        this.y = game.height * 0.85 + (game.player.size)
        this.rate = 7
        this.passed = false
        this.offscreen = false
        this.center = {x:0,y:0}
        this.game = game
        this.ball = game.player
    }
    calculateCollision() {
        const dx = Math.abs(this.center.x - this.ball.center.x)
        const dy = Math.abs(this.center.y - this.ball.center.y)
        const distance = Math.sqrt(dx**2 + dy**2)
        if (distance < 20) return true
        return false
    }
    update() {
        if (this.calculateCollision()) {
            this.game.state = "MENU"
        }
        if (this.x > -10) {
            this.x -= this.rate
            this.center = {
                x: this.x - (this.size / 2),
                y: this.y - ((this.size * 0.8) / 2)
            }
        } else {
            this.offscreen = true
        }
        if (this.x < this.game.width / 3 && !this.passed) {
            this.passed = true
            return 1
        }
        return 0
    }
    draw(ctx) {
        ctx.fillStyle = "rgba(0,220,250,0.8)"
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x - this.size, this.y)
        ctx.lineTo(this.x - (this.size / 2), this.y - this.size * .8)
        ctx.closePath()
        ctx.fill()
    }
}