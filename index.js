import Player from "./players/Player.js";
import Game from "./systems/Game.js";

const start = async () => {
    const ping = await fetch("https://secure-ravine-46870.herokuapp.com/").catch(() => alert("server is booting please refresh"))
    if (!ping) return alert("server broke")
    
    const GAME_WIDTH = 1280
    const GAME_HEIGHT = 720
    const ws = new WebSocket("wss://secure-ravine-46870.herokuapp.com/")
    // const ws = new WebSocket("ws://localhost:5000/")
    let game = {
        newState: null,
        oldState: null,
        interpolatedFrames: 0,
        running: false
    };
    let uid;
    ws.addEventListener('message', ({ data }) => {
        const parsedData = JSON.parse(data)
        if (parsedData.game) {
            if (!game.running) {
                game.running = true
                gameloop()
            }
            game.oldState = game.newState
            game.newState = parsedData.game
            game.interpolatedFrames = 0
        }
        if (parsedData.uid) uid = parsedData.uid
    })

    const canvas = document.createElement("canvas")
    canvas.width = GAME_WIDTH
    canvas.height = GAME_HEIGHT
    document.querySelector("#anchor").parentNode.replaceChild(canvas, document.querySelector("#anchor"))
    const ctx = canvas.getContext("2d")
    
    const getMobileOS = () => {
        const ua = navigator.userAgent
        if (/android/i.test(ua)) {
          return "Android"
        }
        else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
          return "iOS"
        }
        return "Other"
    }
    if (getMobileOS() == "iOS") document.querySelector(".fullscreen").style.display = "none"
    
    document.querySelector(".fullscreen").addEventListener("click", () => {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
            screen.orientation.lock("landscape");
        } else if (canvas.webkitRequestFullscreen) { /* Safari */
            canvas.webkitRequestFullscreen();
            screen.orientation.lock("portrait");
        } else if (elem.msRequestFullscreen) { /* IE11 */
            canvas.msRequestFullscreen();
            screen.orientation.lock("portrait");
        }
    })
    const randomId = "Player " + String(Math.floor(Math.random() * 500))
    let player;
    let now = Date.now();
    let then = Date.now();
    let elapsed = now - then;
    let frameRate = 1000 / 60;
    let interpolatedState;

    const gameloop = () => {
        now = Date.now();
        elapsed = now - then;
        if (elapsed >= frameRate) {
            then = now - (elapsed % frameRate)
            elapsed = 0
            if (game.oldState && game.newState && game.interpolatedFrames < 7) {
                interpolatedState = interpolateGame(game)
                drawGame(interpolatedState, player, ctx)
                if (player) {
                    player.update(interpolatedState)
                    player.draw(ctx)
                }
            }
            if (game.newState && !player) player = new Player(game.newState.width / 3, game.newState.height * 0.85,90, game.newState, uid, false, ws)

            // game.update(GAME_WIDTH, GAME_HEIGHT, canvas)
            // game.draw(ctx)
        }
        requestAnimationFrame(gameloop)
    }
    //ws.onopen = () => 
}
const drawGame = (game, player, ctx) => {
    ctx.clearRect(0, 0, game.width, game.height)
    ctx.filter = "brightness(0.5) blur(2px)"
    ctx.drawImage(bg, 0, 0, game.width, game.height)
    ctx.filter = "none"
    ctx.fillStyle = "rgba(50,180,235, 0.6)"
    const grd = ctx.createLinearGradient(game.width / 2, game.height, game.width / 2, 0)
    grd.addColorStop(0, "rgba(0,50,70,0.6)")
    grd.addColorStop(0.3, "rgba(0,0,0,0.8)")
    ctx.fillStyle = grd
    ctx.fillRect(0, game.height * 0.72, game.width, game.height)
    ctx.fillStyle = "pink"
    ctx.font = "50px monospace"
    ctx.fillText(`SCORE: ${player.score}`, game.width * 0.06, game.height * 0.06)
    ctx.fillText(`ACTIVE USERS: ${game.players.length}`, game.width * 0.06, game.height * 0.06 + 52)
    ctx.fillText(`TOP SCORE: ${game.highScore}`, game.width * 0.06, game.height * 0.06 + 104)
    Object.keys(game.patterns).forEach(id => drawPattern(game.patterns[id], ctx, game))
    Object.keys(game.obstacles).forEach(id => drawObsctacle(game.obstacles[id], ctx))
    // this.player.draw(ctx)
    // this.opponents.forEach(o => o.draw(ctx))
}
const interpolateGame = (game) => {
    const { newState, oldState, interpolatedFrames } = game
    let renderedState = JSON.parse(JSON.stringify(oldState))
    const percentage = interpolatedFrames / 6
    if (newState.state == "PLAY") {
        renderedState.obTimer = oldState.obTimer + (newState.obTimer - oldState.obTimer) * percentage
        renderedState.patTimer = oldState.obTimer + (newState.obTimer - oldState.obTimer) * percentage
        Object.keys(renderedState.obstacles).forEach(id => interpolateObstacle(
            renderedState.obstacles[id], 
            renderedState,
            newState.obstacles[id],
            oldState.obstacles[id],
            percentage
        ))
        Object.keys(renderedState.patterns).forEach(id => interpolatePatterns(
            renderedState.patterns[id], 
            renderedState,
            newState.patterns[id],
            oldState.patterns[id],
            percentage
        ))
    }
    if (game.interpolatedFrames < 6) game.interpolatedFrames++
    return renderedState
}
const interpolateObstacle = (ob, game, n, o, p) => {
    if (n) {
        ob.x = ob.x + (n.x - o.x) * p
        ob.center = {
            x: ob.x - (ob.size / 2),
            y: ob.y - ((ob.size * 0.8) / 2)
        }
    } else {
        ob.x = ob.x + (-10 - o.x) * p
    }
    if (ob.x < game.width / 3 && !ob.passed) {
        ob.passed = true
        return 1
    }
    return 0
}
const drawObsctacle = (obstacle, ctx) => {
    ctx.fillStyle = "rgba(0,220,250,0.8)"
    ctx.beginPath()
    ctx.moveTo(obstacle.x, obstacle.y)
    ctx.lineTo(obstacle.x - obstacle.size, obstacle.y)
    ctx.lineTo(obstacle.x - (obstacle.size / 2), obstacle.y - obstacle.size * .8)
    ctx.closePath()
    ctx.fill()
}
const calculateCollision = (ob, player) => {
    const dx = Math.abs(ob.center.x - player.center.x)
    const dy = Math.abs(ob.center.y - player.center.y)
    const distance = Math.sqrt(dx**2 + dy**2)
    if (distance < 20) return true
    return false
}
const interpolatePatterns = (pattern, game, n, o, p) => {
    if (n) {
        pattern.x1 = pattern.x1 + (n.x1 - o.x1) * p
        pattern.x2 = pattern.x1 + (pattern.x1 - game.width / 2) * pattern.factor
    } else {
        pattern.x1 = pattern.x1 + (0 - o.x1) * p
        pattern.x2 = pattern.x1 + (pattern.x1 - game.width / 2) * pattern.factor
    }
}
const drawPattern = (pattern, ctx, game) => {
    const grd = ctx.createRadialGradient(game.width / 3, game.height, 0, game.width / 3, game.height, 500)
    grd.addColorStop(0, "rgb(200,200,200)")
    grd.addColorStop(1, "black")
    ctx.strokeStyle = grd
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(pattern.x1, pattern.y1)
    ctx.lineTo(pattern.x2, pattern.y2)
    ctx.closePath()
    ctx.stroke()
}

start()