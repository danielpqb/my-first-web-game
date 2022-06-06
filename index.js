class Player {
    constructor({
        image = playerImage,
        position = { x: -1900, y: -1500 },
        moving = { right: false, left: false, up: false, down: false },
        isMovingX = false,
        isMovingY = false,
        velocity = 1,
        bothAxisDebuff = false,
        direction = 1,
        frameRow = 1,
        frameColumn = 1,
        maxFrames = 6,
        state = 'stand'
    }) {
        this.image = image
        this.position = position
        this.moving = moving
        this.isMovingX = isMovingX
        this.isMovingY = isMovingY
        this.velocity = velocity
        this.bothAxisDebuff = bothAxisDebuff
        this.direction = direction
        this.frameRow = frameRow
        this.frameColumn = frameColumn
        this.maxFrames = maxFrames
        this.state = state
    }

    changeState(state) {
        this.state = state
        this.frameColumn = 1
        switch (state) {
            case 'walk':
                this.frameRow = 2
                this.maxFrames = 6
                break;

            case 'attack':
                this.frameRow = 3
                this.maxFrames = 4
                break;

            case 'die':
                this.frameRow = 4
                this.maxFrames = 3
                break;

            default:
                this.frameRow = 1
                this.maxFrames = 6
                break;
        }
    }

    draw() {
        c.save();  // Save the current canvas state
        if (player.direction == 0) {
            c.setTransform(-1, 0, 0, 1, canvas.width, 0); //Invert image horizontaly
        }
        c.drawImage(
            this.image,
            this.image.width / 6 * (this.frameColumn - 1), //Image Crop Xo
            this.image.height / 4 * (this.frameRow - 1), //Image Crop Yo
            this.image.width / 6, //Image Crop Xo Offset
            this.image.height / 4,//Image Crop Yo Offset
            canvas.width / 2 - this.image.width / 12, //Image Xo Position on Canvas
            canvas.height / 2 - this.image.height / 8,//Image Yo Position on Canvas
            this.image.width / 6, //Image Xo Position Offset on Canvas
            this.image.height / 4 //Image Yo Position Offset on Canvas
        )
        c.restore(); // Restore the state as it was when this function was called
    }
}

class Background {
    constructor({
        image = backgroundImage,
    }) {
        this.image = image
    }

    draw(x, y) {
        c.drawImage(this.image, x, y)
    }
}

function animate() {

    background.draw(player.position.x, player.position.y)
    player.draw()

    //Animate Player every 10 frames
    if (t % 10 == 0) {
        player.frameColumn = (player.frameColumn % player.maxFrames) + 1
    }

    //Move background position if player is moving
    if (player.moving.up) {
        player.position.y += 5 * player.velocity
    }
    if (player.moving.left) {
        player.direction = 0
        player.position.x += 5 * player.velocity
    }
    if (player.moving.down) {
        player.position.y -= 5 * player.velocity
    }
    if (player.moving.right) {
        player.direction = 1
        player.position.x -= 5 * player.velocity
    }

    t %= 216000 //Reset counter every hour
    t++
    window.requestAnimationFrame(animate) //60 FPS
}

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const backgroundImage = new Image()
backgroundImage.src = './img/background.png'

const playerImage = new Image()
playerImage.src = './img/player.png'

const background = new Background({})
const player = new Player({})

let t = 0 //Count number of frames since animate starts
animate()

document.addEventListener('keydown', (e) => {
    //if(player.state == 'die')
    
    switch (e.key) {
        case 'w':
            player.isMovingY = true
            player.moving.up = true
            player.moving.down = false
            break;
        case 'a':
            player.isMovingX = true
            player.moving.left = true
            player.moving.right = false
            break;
        case 's':
            player.isMovingY = true
            player.moving.down = true
            player.moving.up = false
            break;
        case 'd':
            player.isMovingX = true
            player.moving.right = true
            player.moving.left = false
            break;
        case ' ':
            player.isMovingX = false
            player.isMovingY = false
            player.moving.right = false
            player.moving.left = false
            player.moving.up = false
            player.moving.down = false
            if (player.state != 'attack') {
                player.changeState('attack')
            }
            break;
    }

    //Change player state to 'walk' if player is moving and state is not 'walk' yet
    if ((player.isMovingX || player.isMovingY) && player.state != 'walk') {
        player.changeState('walk')
    }
    //Give player a debuff on velocity if player starts walking on both axis
    if ((player.isMovingX && player.isMovingY) && (player.bothAxisDebuff == false)) {
        player.bothAxisDebuff = true
        player.velocity /= Math.sqrt(2)
    }
})
document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'w':
            player.isMovingY = false
            player.moving.up = false
            break;
        case 'a':
            player.isMovingX = false
            player.moving.left = false
            break;
        case 's':
            player.isMovingY = false
            player.moving.down = false
            break;
        case 'd':
            player.isMovingX = false
            player.moving.right = false
            break;
    }

    //Change player state to 'stand' if player stop moving and state is not 'stand' yet
    if (((player.isMovingX || player.isMovingY) == false) && player.state != 'stand') {
        player.changeState('stand')
    }
    //Remove player debuff on velocity if player is no longer moving on both axis
    if (((player.isMovingX && player.isMovingY) == false) && (player.bothAxisDebuff == true)) {
        player.bothAxisDebuff = false
        player.velocity *= Math.sqrt(2)
    }
})