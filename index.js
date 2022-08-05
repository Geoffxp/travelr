import Player from "./players/Player.js";
import Game from "./systems/Game.js";

const GAME_WIDTH = window.innerWidth
const GAME_HEIGHT = window.innerHeight
const game = new Game(GAME_WIDTH, GAME_HEIGHT)

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
    } else if (canvas.webkitRequestFullscreen) { /* Safari */
        canvas.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        canvas.msRequestFullscreen();
    }
})
game.addPlayer(new Player(game.width / 3, game.height * 0.85,90, game))

const gameloop = () => {
    game.update(window.innerWidth, window.innerHeight, canvas)
    game.draw(ctx)
    requestAnimationFrame(gameloop)
}

gameloop()