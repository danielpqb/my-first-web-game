class Player {
    constructor({
        position = { x: (canvas.width / 2 - 24), y: (canvas.height / 2 - 48) },
        image = playerImage,
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
            this.image.width / 6, //Image Crop X Offset
            this.image.height / 4,//Image Crop Y Offset
            canvas.width / 2 - this.image.width / 12, //Image Xo Position on Canvas
            canvas.height / 2 - this.image.height / 8,//Image Yo Position on Canvas
            this.image.width / 6, //Image X Position Offset on Canvas
            this.image.height / 4 //Image Y Position Offset on Canvas
        )
        c.restore(); // Restore the state as it was when this function was called
    }

    move() {
        //If player is impeded to move, stop here
        if (player.snared === true || player.state === 'attacking') {
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
            if (controller.lastKeyWS === 'w') {
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
            if (controller.lastKeyAD === 'd') {
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
            if (y === 1 && x === 7) {
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

        //Save position to rollback if collided
        const rollbackPosition = { x: controller.position.x, y: controller.position.y }

        //Move background position if player is trying to move (player starts to move)
        player.isMoving = true
        player.changeState('walking')
        switch (player.direction) {
            case 1: //Up
                controller.position.y += 5 * player.velocity
                break;
            case 2: //Up+Right
                controller.position.y += 5 * player.velocity / Math.sqrt(2)
                controller.position.x -= 5 * player.velocity / Math.sqrt(2)
                break;
            case 3: //Right
                controller.position.x -= 5 * player.velocity
                break;
            case 4: //Down+Right
                controller.position.y -= 5 * player.velocity / Math.sqrt(2)
                controller.position.x -= 5 * player.velocity / Math.sqrt(2)
                break;
            case 5: //Down
                controller.position.y -= 5 * player.velocity
                break;
            case 6: //Down+Left
                controller.position.y -= 5 * player.velocity / Math.sqrt(2)
                controller.position.x += 5 * player.velocity / Math.sqrt(2)
                break;
            case 7: //Left
                controller.position.x += 5 * player.velocity
                break;
            case 8: //Up+left
                controller.position.y += 5 * player.velocity / Math.sqrt(2)
                controller.position.x += 5 * player.velocity / Math.sqrt(2)
                break;
            default:
                return
        }

        //Check collisions
        //const collidedBlocksDistances = [[], []] //Storage arrays of distance from player to collided blocks
        collisionTiles.forEach(block => {
            //block.draw() //Draw collisionTiles
            const cRightDistance = ((player.position.x - controller.position.x + 45) - (block.position.x)) //Right Distance
            const cLeftDistance = ((player.position.x - controller.position.x) - (block.position.x + Boundary.width)) //Left Distance
            const cUpDistance = ((player.position.y - controller.position.y + 60) - (block.position.y + Boundary.height)) //Up Distance
            const cDownDistance = ((player.position.y - controller.position.y + 80) - (block.position.y)) //Down Distance
            if (cRightDistance >= 0 && cLeftDistance <= 0 && cUpDistance <= 0 && cDownDistance >= 0) {
                switch (player.direction) {
                    case 1: //Up
                    case 5: //Down
                        controller.position.y = rollbackPosition.y
                        return;
                    case 3: //Right
                    case 7: //Left
                        controller.position.x = rollbackPosition.x
                        return;
                    default:
                        controller.position.x = rollbackPosition.x
                        controller.position.y = rollbackPosition.y
                        return;
                        //Pushes distance values to it's respective array
                        collidedBlocksDistances[0].push(cRightDistance)
                        collidedBlocksDistances[1].push(cUpDistance)
                }
            }
        })
        /*
        //Remove repeated values on the same array
        collidedBlocksDistances[0] = collidedBlocksDistances[0].filter((element, index) => { //Right Distance
            return collidedBlocksDistances[0].indexOf(element) === index;
        });
        collidedBlocksDistances[1] = collidedBlocksDistances[1].filter((element, index) => { //Up Distance
            return collidedBlocksDistances[1].indexOf(element) === index;
        });

        if (collidedBlocksDistances[0].length === 1) { //Colliding on Right or Left
            controller.position.x = rollbackPosition.x
        }
        if (collidedBlocksDistances[1].length === 1) { //Colliding on Up or Down
            controller.position.y = rollbackPosition.y
        }

        console.log(collidedBlocksDistances[0])
        console.log(collidedBlocksDistances[1])
        */
    }

    attack() {
        player.changeState('attacking')
    }

    die() {

    }
}

class Background {
    constructor({
        image = backgroundImage
    }) {
        this.image = image
    }

    draw(x = 0, y = 0) {
        c.drawImage(this.image, x + controller.position.x, y + controller.position.y)
    }
}

class Controller {
    constructor({
        t = 0, //Count number of frames since animate starts
        position = { x: -500, y: -900 },
        lastKeyWS = '', //Was 'w' or 's' the Last Key Pressed
        lastKeyAD = '', //Was 'a' or 'd' the Last Key Pressed
        moveKeysDown = { w: isKeyDown('w'), a: isKeyDown('a'), s: isKeyDown('s'), d: isKeyDown('d') },
        attackKeyDown = { space: isKeyDown(' ') }
    }) {
        this.position = position
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

class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw(x = 0, y = 0) { //x and y are the offset coordinate of player position
        c.fillStyle = 'rgba(255, 0, 0, 0.5)'
        c.fillRect(this.position.x + controller.position.x + x, this.position.y + controller.position.y + y, this.width, this.height)
    }
}

//Do something every frame
function animate() {

    //Animate Player every 10 frames
    if (controller.t % 10 === 0) {
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
                if (player.isMoving === true) {
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

    background.draw() //Draw background

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
canvas.width = 1536
canvas.height = 864

const backgroundImage = new Image()
backgroundImage.src = './img/trainingMap.png'
const playerImage = new Image()
playerImage.src = './img/player.png'

const background = new Background({})
const player = new Player({})
const controller = new Controller({})

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 110) {
    collisionsMap.push(collisions.slice(i, 110 + i))
}

/*
row: Array of tiles on 'y' position
id: ID of the tile on 'x' position
x: X coordinate of the tile
y: Y coordinate of the tile */
const collisionTiles = []
collisionsMap.forEach((row, y) => {
    row.forEach((id, x) => {
        if (id === 3251)
            collisionTiles.push(new Boundary({
                position: {
                    x: x * Boundary.width,
                    y: y * Boundary.height
                }
            }))
    })
})
/*  Example (10 x 10 Map):    x:0  1  2  3  4  5  6  7  8  9  y:
    0 1 1 1 1 1 1 1 1 1   row: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1] 0  => id: 0, id: 1, id: 1 ....
    0 0 1 1 1 1 1 1 1 1   row: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1] 1
    0 0 0 1 1 1 1 1 1 1   row: [0, 0, 0, 1, 1, 1, 1, 1, 1, 1] 2
    0 0 0 0 1 1 1 1 1 1   row: [0, 0, 0, 0, 1, 1, 1, 1, 1, 1] 3
    0 0 0 0 0 1 1 1 1 1   row: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1] 4
    0 0 0 0 0 1 0 0 0 0   row: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0] 5
    0 0 0 0 1 0 0 0 0 0   row: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0] 6
    0 0 0 1 0 0 0 0 0 0   row: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0] 7
    0 0 1 0 0 0 0 0 0 0   row: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0] 8
    0 1 0 0 0 0 0 0 0 0   row: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0] 9 */

controller.listenKeysDown()
animate()


