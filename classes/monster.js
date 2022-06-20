class Monster {
    constructor({
        position = { x: 0, y: 0 }, //Relative to background
        image = slimeImage,
        direction = 0,
        isMirrored = false,
        frameRow = 1,
        frameColumn = 1,
        maxFrames = 4,
        state = 'standing',
        snared = false,
        isMoving = false,
        isDead = false,

        //Hitbox
        baseHitbox = [],
        hitboxOffset = [0, 0, 0, 0], //Left, Up, Right, Down distance offset
        hitbox = [],

        //Stats
        hp = 100,
        maxHp = 100,
        energy = 20,
        maxEnergy = 20,
        level = 1,
        maxLevel = 10,
        velocity = 1

    }) {
        this.position = position
        this.image = image
        this.direction = direction
        this.isMirrored = isMirrored
        this.frameRow = frameRow
        this.frameColumn = frameColumn
        this.maxFrames = maxFrames
        this.state = state
        this.snared = snared
        this.isMoving = isMoving
        this.isDead = isDead

        //Hitbox (Left, Up, Right, Down)
        this.baseHitbox = baseHitbox
        this.hitboxOffset = hitboxOffset
        this.hitbox = hitbox

        //Stats
        this.hp = hp
        this.maxHp = maxHp
        this.energy = energy
        this.maxEnergy = maxEnergy
        this.level = level
        this.maxLevel = maxLevel
        this.velocity = velocity
    }

    setHitbox() {
        this.baseHitbox = [0, 0, this.image.width / 7, this.image.height / 5] //Left, Up, Right, Down
        this.hitbox = [this.baseHitbox[0] + this.hitboxOffset[0], this.baseHitbox[1] + this.hitboxOffset[1], this.baseHitbox[2] + this.hitboxOffset[2], this.baseHitbox[3] + this.hitboxOffset[3]]
    }

    changeState(state) {
        if (this.state != state) {
            this.frameColumn = 1
            this.state = state
        }

        switch (state) {
            case 'standing':
                this.frameRow = 1
                this.maxFrames = 4
                break;

            case 'walking':
                this.frameRow = 2
                this.maxFrames = 6
                break;

            case 'attacking':
                this.frameRow = 4
                this.maxFrames = 3
                break;

            case 'dead':
                this.frameRow = 5
                this.maxFrames = 5
                this.isDead = true
                break;

            default:
                this.frameRow = 1
                this.maxFrames = 4
                break;
        }
    }

    draw() {
        //Character
        c.save();  // Save the current canvas state
        if (this.isMirrored) {
            c.setTransform(-1, 0, 0, 1, canvas.width, 0); //Invert image horizontaly to the left
        }
        c.drawImage(
            this.image,
            this.baseHitbox[2] * (this.frameColumn - 1), //Image Crop Xo
            this.baseHitbox[3] * (this.frameRow - 1), //Image Crop Yo
            this.baseHitbox[2], //Image Crop X Offset
            this.baseHitbox[3], //Image Crop Y Offset
            controller.position.x + this.position.x, //Image Xo Position on Canvas
            controller.position.y + this.position.y, //Image Yo Position on Canvas
            this.baseHitbox[2], //Image X Position Offset on Canvas
            this.baseHitbox[3] //Image Y Position Offset on Canvas
        )
        c.restore(); // Restore the state as it was when this function was called

        //HP bar
        c.fillStyle = 'rgba(0, 0, 0, 0.8)'
        c.fillRect(this.position.x + controller.position.x + this.hitbox[2] / 2 - 24, this.position.y + controller.position.y + this.hitbox[3] + 10, 64, 4)
        c.fillStyle = 'rgba(180, 0, 10, 0.8)'
        c.fillRect(this.position.x + controller.position.x + this.hitbox[2] / 2 - 24, this.position.y + controller.position.y + this.hitbox[3] + 10, 64 * this.hp / this.maxHp, 4)
    }

    move() {
        //If monster is impeded to move, stop here
        if (this.snared === true || this.state === 'attacking' || this.isDead === true) {
            this.isMoving = false
            return
        }

        //Monster can't move for 5 seconds every 10 seconds
        if (controller.t % 600 < 300) {
            this.isMoving = false
            return
        }

        //Wich direction should the monster go? (1 to 8)
        if (controller.t % 300 == 0) { //Change direction every 5 seconds
            let y = 0;
            let x = 0;
            const rndY = Math.floor(Math.random() * 2) //Up or Down? 0:Up | 1:Down
            const rndX = Math.floor(Math.random() * 2) //Right or Left? 0:Right | 1:Left
            const rndXY = Math.floor(Math.random() * 3) //Should it move on both directions? 0:Only Y | 1:Only X | 2:Both

            if (rndY === 0) {
                y = 1 //Up
            } else {
                y = 5 //Down
            }
            if (rndX === 0) {
                x = 3 //Right
                //this.isMirrored = false //Points Right
            } else {
                x = 7 //Left
                //this.isMirrored = true //Points Left
            }

            switch (rndXY) {
                case 0: //Only Y
                    this.direction = y
                    break;
                case 1: //Only X
                    this.direction = x
                    break;
                case 2: //Both Axis
                    if (y === 1 && x === 7) { //Up+Left
                        this.direction = 8 //Up+Left
                    }
                    else {
                        this.direction = (x + y) / 2 //Up+Right || Down+Right || Down+Left
                    }
                    break;
            }
        }

        //Save position to rollback if collided
        const rollbackPosition = { x: this.position.x, y: this.position.y }

        //Change monster position if it's trying to move (monster starts to move)
        this.isMoving = true
        this.changeState('walking')
        switch (this.direction) {
            case 1: //Up
                this.position.y -= 1 * this.velocity
                break;
            case 2: //Up+Right
                this.position.y -= 1 * this.velocity / Math.sqrt(2)
                this.position.x += 1 * this.velocity / Math.sqrt(2)
                break;
            case 3: //Right
                this.position.x += 1 * this.velocity
                break;
            case 4: //Down+Right
                this.position.y += 1 * this.velocity / Math.sqrt(2)
                this.position.x += 1 * this.velocity / Math.sqrt(2)
                break;
            case 5: //Down
                this.position.y += 1 * this.velocity
                break;
            case 6: //Down+Left
                this.position.y += 1 * this.velocity / Math.sqrt(2)
                this.position.x -= 1 * this.velocity / Math.sqrt(2)
                break;
            case 7: //Left
                this.position.x -= 1 * this.velocity
                break;
            case 8: //Up+left
                this.position.y -= 1 * this.velocity / Math.sqrt(2)
                this.position.x -= 1 * this.velocity / Math.sqrt(2)
                break;
            default:
                return
        }

        //Check collisions
        //const collidedBlocksDistances = [[], []] //Storage arrays of distance from monster to collided blocks
        collisionTiles.forEach(block => {
            const cLeftDistance = ((this.position.x + this.hitbox[0]) - (block.position.x + Boundary.width)) //Left Distance
            const cUpDistance = ((this.position.y + this.hitbox[1]) - (block.position.y + Boundary.height)) //Up Distance
            const cRightDistance = ((this.position.x + this.hitbox[2]) - (block.position.x)) //Right Distance
            const cDownDistance = ((this.position.y + this.hitbox[3]) - (block.position.y)) //Down Distance
            if (cRightDistance >= 0 && cLeftDistance <= 0 && cUpDistance <= 0 && cDownDistance >= 0) {
                switch (this.direction) {
                    case 1: //Up
                    case 5: //Down
                        this.position.y = rollbackPosition.y
                        return;
                    case 3: //Right
                    case 7: //Left
                        this.position.x = rollbackPosition.x
                        return;
                    default:
                        this.position.x = rollbackPosition.x
                        this.position.y = rollbackPosition.y
                        return;
                        //Pushes distance values to it's respective array
                        collidedBlocksDistances[0].push(cRightDistance)
                        collidedBlocksDistances[1].push(cUpDistance)
                }
            }
        })
    }

    die() {
        this.changeState('dead')
    }
}