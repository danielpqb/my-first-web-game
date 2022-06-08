class Player {
    constructor({
        image = playerImage,
        position = { x: -1100, y: -1000 },
        velocity = 1,
        direction = 0,
        isMirrored = false,
        frameRow = 1,
        frameColumn = 1,
        maxFrames = 6,
        state = 'standing',
        snared = false,
        isMoving = false
    }) {
        this.image = image
        this.position = position
        this.velocity = velocity
        this.direction = direction
        this.isMirrored = isMirrored
        this.frameRow = frameRow
        this.frameColumn = frameColumn
        this.maxFrames = maxFrames
        this.state = state
        this.snared = snared
        this.isMoving = isMoving
    }

    changeState(state,) {
        if (this.state != state) {
            this.frameColumn = 1
            this.state = state
        }

        switch (state) {
            case 'standing':
                this.frameRow = 1
                this.maxFrames = 6
                break;

            case 'walking':
                this.frameRow = 2
                this.maxFrames = 6
                break;

            case 'attacking':
                this.frameRow = 3
                this.maxFrames = 4
                break;

            case 'dead':
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
        if (player.isMirrored) {
            c.setTransform(-1, 0, 0, 1, canvas.width, 0); //Invert image horizontaly to the left
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

    move() {
        //If player is impeded to move, stop here
        if (player.snared == true || player.state == 'attacking') {
            player.isMoving = false
            return
        }

        //Wich move keys are pressed
        controller.moveKeysDown.w = isKeyDown('w')
        controller.moveKeysDown.a = isKeyDown('a')
        controller.moveKeysDown.s = isKeyDown('s')
        controller.moveKeysDown.d = isKeyDown('d')

        //If player is not trying to move
        if (!controller.moveKeysDown.w &&
            !controller.moveKeysDown.a &&
            !controller.moveKeysDown.s &&
            !controller.moveKeysDown.d
        ) {
            player.isMoving = false
            return
        }

        //Wich direction should the player go? (1 to 8)
        let y = 0;
        let x = 0;

        //Up or Down
        if (controller.moveKeysDown.w && controller.moveKeysDown.s) { //Both pressed
            if (controller.lastKeyWS == 'w') {
                y = 1 //Up
            }
            else {
                y = 5 //Down
            }
        }
        else { //Only one pressed
            if (controller.moveKeysDown.w) {
                y = 1 //Up
            }
            else if (controller.moveKeysDown.s) {
                y = 5 //Down
            }
        }

        //Right or Left
        if (controller.moveKeysDown.d && controller.moveKeysDown.a) { //Both pressed
            if (controller.lastKeyAD == 'd') {
                x = 3 //Right
                player.isMirrored = false //Points Right
            }
            else {
                x = 7 //Left
                player.isMirrored = true //Points Left
            }
        }
        else { //Only one pressed
            if (controller.moveKeysDown.d) {
                x = 3 //Right
                player.isMirrored = false //Points Right
            }
            else if (controller.moveKeysDown.a) {
                x = 7 //Left
                player.isMirrored = true //Points Left
            }
        }

        //Trying to walk on both axis
        if (x > 0 && y > 0) {
            if (y == 1 && x == 7) {
                player.direction = 8 //Up+Left
            }
            else {
                player.direction = (x + y) / 2 //Up+Right || Down+Right || Down+Left
            }
        }
        //Trying to walk on only one axis
        else {
            player.direction = x + y //Up || Down || Right || Left
        }

        //Move background position if player is trying to move (player starts to move)
        player.isMoving = true
        player.changeState('walking')
        switch (player.direction) {
            case 1: //Up
                player.position.y += 5 * player.velocity
                break;
            case 2: //Up+Right
                player.position.y += 5 * player.velocity / Math.sqrt(2)
                player.position.x -= 5 * player.velocity / Math.sqrt(2)
                break;
            case 3: //Right
                player.position.x -= 5 * player.velocity
                break;
            case 4: //Down+Right
                player.position.y -= 5 * player.velocity / Math.sqrt(2)
                player.position.x -= 5 * player.velocity / Math.sqrt(2)
                break;
            case 5: //Down
                player.position.y -= 5 * player.velocity
                break;
            case 6: //Down+Left
                player.position.y -= 5 * player.velocity / Math.sqrt(2)
                player.position.x += 5 * player.velocity / Math.sqrt(2)
                break;
            case 7: //Left
                player.position.x += 5 * player.velocity
                break;
            case 8: //Up+left
                player.position.y += 5 * player.velocity / Math.sqrt(2)
                player.position.x += 5 * player.velocity / Math.sqrt(2)
                break;
            default:
                return
        }
    }

    attack() {
        player.changeState('attacking')
    }

    die() {

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

class Controller {
    constructor({
        t = 0, //Count number of frames since animate starts
        lastKeyWS = '', //Was 'w' or 's' the Last Key Pressed
        lastKeyAD = '', //Was 'a' or 'd' the Last Key Pressed
        moveKeysDown = { w: isKeyDown('w'), a: isKeyDown('a'), s: isKeyDown('s'), d: isKeyDown('d') },
        attackKeyDown = { space: isKeyDown(' ') }
    }) {
        this.t = t
        this.lastKeyWS = lastKeyWS
        this.lastKeyAD = lastKeyAD
        this.moveKeysDown = moveKeysDown
        this.attackKeyDown = attackKeyDown
    }

    //Listen wich keys was pressed down
    listenKeysDown() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'w':
                    this.lastKeyWS = 'w'
                    break;
                case 's':
                    this.lastKeyWS = 's'
                    break;
                case 'a':
                    this.lastKeyAD = 'a'
                    break;
                case 'd':
                    this.lastKeyAD = 'd'
                    break;
                case ' ':
                    player.attack()
                    break;
            }
        })
    }
}

//Do something every frame
function animate() {

    //Animate Player every 10 frames
    if (controller.t % 10 == 0) {
        switch (player.state) {
            case 'attacking':
                if (player.frameColumn < player.maxFrames) {
                    player.frameColumn++
                }
                else {
                    player.changeState('standing')
                }
                break;
            case 'walking':
                if (player.isMoving == true) {
                    player.frameColumn = (player.frameColumn % player.maxFrames) + 1
                }
                else {
                    player.changeState('standing')
                }
                break;
            default:
                player.frameColumn = (player.frameColumn % player.maxFrames) + 1
                break;
        }
    }

    background.draw(player.position.x, player.position.y) //Draw background
    player.draw() //Draw player

    player.move() //Move player




    controller.t %= 216000 //Reset counter every hour
    controller.t++
    window.requestAnimationFrame(animate) //60 FPS

}

//Return true or false if key is pressed
const isKeyDown = (() => {
    const state = {};

    window.addEventListener('keyup', (e) => state[e.key] = false);
    window.addEventListener('keydown', (e) => state[e.key] = true);

    return (key) => state.hasOwnProperty(key) && state[key] || false;
})();

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = 1600
canvas.height = 900

const backgroundImage = new Image()
backgroundImage.src = './img/trainingMap.png'
const playerImage = new Image()
playerImage.src = './img/player.png'

const background = new Background({})
const player = new Player({})
const controller = new Controller({})

controller.listenKeysDown()
animate()
    
