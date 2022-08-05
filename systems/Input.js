export default class Input {
    constructor(player, game) {
        document.addEventListener('keydown', (e) => {
            const key = e.key
            if (key == " " && !player.airborne) {
                player.halfG = true
                player.jump = true
                if (game.state == "MENU") game.start()
            }
            if (key == "w") player.jump = true
            if (key == "d") player.right = true
            if (key == "a") player.left = true
        })
        document.addEventListener('keyup', (e) => {
            const key = e.key;
            if (key == " ") {
                player.halfG = false
            }
            if (key == "w") player.moving = false
            if (key == "d") player.right = false
            if (key == "a") player.left = false
        })

        document.addEventListener('touchstart', (e) => {
            if (!player.airborne) {
                player.halfG = true
                player.jump = true
                if (game.state == "MENU") game.start()
            }
        })
        document.addEventListener('touchend', (e) => {
            player.halfG = false
        })
    }
}