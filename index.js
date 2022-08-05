import Player from "./players/Player.js";
import Game from "./systems/Game.js";

const GAME_WIDTH = 1280
const GAME_HEIGHT = 720
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
        screen.orientation.lock("landscape");
    } else if (canvas.webkitRequestFullscreen) { /* Safari */
        canvas.webkitRequestFullscreen();
        screen.orientation.lock("portrait");
    } else if (elem.msRequestFullscreen) { /* IE11 */
        canvas.msRequestFullscreen();
        screen.orientation.lock("portrait");
    }
})
game.addPlayer(new Player(game.width / 3, game.height * 0.85,90, game))

let now = Date.now();
let then = Date.now();
let elapsed = now - then;
let frameRate = 1000 / 120;

const gameloop = () => {
    now = Date.now();
    elapsed = now - then;
    if (elapsed >= frameRate) {
        then = now - (elapsed % frameRate)
        elapsed = 0
        game.update(GAME_WIDTH, GAME_HEIGHT, canvas)
        game.draw(ctx)
    }
    requestAnimationFrame(gameloop)
}

gameloop()