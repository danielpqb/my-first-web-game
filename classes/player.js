class Player {
    constructor({
        image = playerImage,
        direction = 0,
        isMirrored = false,
        frameRow = 1,
        frameColumn = 1,
        maxFrames = 6,
        state = 'standing',
        snared = false,
        isMoving = false,
        isDead = false,

        //Drawings
        expNumbers = [],
        levelNumbers = [],
        hpNumbers = [],
        energyNumbers = [],

        //Hitbox
        baseHitbox = [],
        hitboxOffset = [0, 0, 0, 0], //Left, Up, Right, Down distance offset
        hitbox = [],

        //Stats
        hp = 1000,
        maxHp = 1000,
        energy = 20,
        maxEnergy = 20,
        level = 1,
        maxLevel = 100,
        exp = 0, //Current exp (reset every time player levels up)
        levelExp = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], //Exp necessary to level up from 0 to 10
        velocity = 1
    }) {
        this.image = image
        this.position = { x: (canvas.width / 2 - 24), y: (canvas.height / 2 - 48) } //Offset player position to be relative to background
        this.direction = direction
        this.isMirrored = isMirrored
        this.frameRow = frameRow
        this.frameColumn = frameColumn
        this.maxFrames = maxFrames
        this.state = state
        this.snared = snared
        this.isMoving = isMoving
        this.isDead = isDead

        //Drawings
        this.expNumbers = expNumbers
        this.levelNumbers = levelNumbers
        this.hpNumbers = hpNumbers
        this.energyNumbers = energyNumbers

        //Hitbox (Left, Up, Right, Down)
        this.baseHitbox = baseHitbox //Total size of animation
        this.hitboxOffset = hitboxOffset //Offset in pixels
        this.hitbox = hitbox //Real hitbox of player

        //Stats
        this.hp = hp
        this.maxHp = maxHp
        this.energy = energy
        this.maxEnergy = maxEnergy
        this.level = level
        this.maxLevel = maxLevel
        this.exp = exp
        this.levelExp = levelExp
        this.velocity = velocity
    }

    setHitbox() {
        this.baseHitbox = [0, 0, this.image.width / 6, this.image.height / 4] //Left, Up, Right, Down
        this.hitbox = { left: this.baseHitbox[0] + this.hitboxOffset[0], up: this.baseHitbox[1] + this.hitboxOffset[1], right: this.baseHitbox[2] / 3 + this.hitboxOffset[2], down: this.baseHitbox[3] + this.hitboxOffset[3] }
    }

    getExp(exp) {
        //Can't get more Exp (reached Max Level)
        if (this.level == this.maxLevel) {
            this.exp = 0
            return
        }

        //Calculate maxExp of actual level
        let maxExp
        if (this.level > this.levelExp.length - 1) {
            maxExp = this.levelExp[this.levelExp.length - 1]
        }
        else {
            maxExp = this.levelExp[this.level]
        }

        //Get Exp
        this.exp += exp
        this.expNumbers.push({ value: exp, time: controller.t })

        //Level goes Up
        if (this.exp >= maxExp) {
            this.exp %= maxExp
            this.level += 1
            this.levelNumbers.push({ value: 'Level Up!', time: controller.t })
        }
    }

    useEnergy(energy) {
        //Is it trying to increase energy instead of decrease?
        if (energy < 0) { //Yes
            this.energy = Math.min(this.energy - energy, this.maxEnergy)
            return
        }

        //Does it have this amount of energy to spend?
        if (energy > this.energy) { //No
            //Can't use skill
            return null
        }

        //Energy can be spent
        this.energy -= energy
    }

    changeState(state) {
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
                this.isDead = true
                break;

            default:
                this.frameRow = 1
                this.maxFrames = 6
                break;
        }
    }

    draw() {
        //Character image
        c.save();  // Save the current canvas state
        if (player.isMirrored) {
            c.setTransform(-1, 0, 0, 1, canvas.width, 0); //Invert image horizontaly to the left
        }
        c.drawImage(
            this.image,
            this.baseHitbox[2] * (this.frameColumn - 1), //Image Crop Xo
            this.baseHitbox[3] * (this.frameRow - 1), //Image Crop Yo
            this.baseHitbox[2], //Image Crop X Offset
            this.baseHitbox[3],//Image Crop Y Offset
            canvas.width / 2 - this.baseHitbox[2] / 2, //Image Xo Position on Canvas
            canvas.height / 2 - this.baseHitbox[3] / 2,//Image Yo Position on Canvas
            this.baseHitbox[2], //Image X Position Offset on Canvas
            this.baseHitbox[3] //Image Y Position Offset on Canvas
        )
        c.restore(); // Restore the state as it was when this function was called

        /* | Numbers | */
        //Exp
        if (this.expNumbers.length > 0) {
            //Sum values that occured on the same time
            let temp = [this.expNumbers[0]]
            for (let i = 1; i < this.expNumbers.length; i++) {
                let found = false
                for (let a = 0; a < temp.length; a++) {
                    if (this.expNumbers[i].time === temp[a].time) {
                        temp[a].value += this.expNumbers[i].value
                        found = true
                        break
                    }
                }
                if (found === false) { temp.push(this.expNumbers[i]) }
            }

            this.expNumbers = temp

            this.expNumbers.forEach((expNumber, index) => {
                if (controller.t - expNumber.time < 60) {
                    c.font = "bold 12px Arial";
                    c.strokeStyle = 'rgba(20, 20, 20, 0.9)';
                    c.lineWidth = 4;
                    c.strokeText(expNumber.value + ' xp', canvas.width / 2, this.position.y + this.baseHitbox[3] - 20 - (controller.t - expNumber.time));
                    c.fillStyle = 'rgba(235, 235, 235, 0.9)';
                    c.textAlign = 'center';
                    c.fillText(expNumber.value + ' xp', canvas.width / 2, this.position.y + this.baseHitbox[3] - 20 - (controller.t - expNumber.time));
                }
                else {
                    this.expNumbers.splice(index, 1)
                }
            })
        }
        //Level
        if (this.levelNumbers.length > 0) {
            this.levelNumbers.forEach((levelNumber, index) => {
                if (controller.t - levelNumber.time < 150) {
                    c.font = "bold 16px Arial";
                    c.strokeStyle = 'rgba(20, 20, 20, 0.9)';
                    c.lineWidth = 4;
                    c.strokeText(levelNumber.value, canvas.width / 2, this.position.y + this.baseHitbox[3] - 20 - (controller.t - levelNumber.time) / 2);
                    c.fillStyle = 'rgba(235, 235, 235, 0.9)';
                    c.textAlign = 'center';
                    c.fillText(levelNumber.value, canvas.width / 2, this.position.y + this.baseHitbox[3] - 20 - (controller.t - levelNumber.time) / 2);
                }
                else {
                    this.levelNumbers.splice(index, 1)
                }
            })
        }

        //Status bar
        hpBar.style.width = hpBarMaxWidth * this.hp / this.maxHp + 'px'
        energyBar.style.width = energyBarMaxWidth * this.energy / this.maxEnergy + 'px'
        expBar.style.width = hpBarMaxWidth * this.exp / (this.levelExp[this.level]) + 'px'
        //Status data
        hpData.innerHTML = this.hp + '/' + this.maxHp
        energyData.innerHTML = this.energy + '/' + this.maxEnergy
        levelData.innerHTML = 'Lv: ' + this.level
    }

    move() {
        //If player is impeded to move, stop here
        if (this.snared === true || this.state === 'attacking' || this.isDead === true) {
            this.isMoving = false
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
            this.isMoving = false
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
                this.isMirrored = false //Points Right
            }
            else {
                x = 7 //Left
                this.isMirrored = true //Points Left
            }
        }
        else { //Only one pressed
            if (controller.moveKeysDown.d) {
                x = 3 //Right
                this.isMirrored = false //Points Right
            }
            else if (controller.moveKeysDown.a) {
                x = 7 //Left
                this.isMirrored = true //Points Left
            }
        }

        //Trying to walk on both axis
        if (x > 0 && y > 0) {
            if (y === 1 && x === 7) {
                this.direction = 8 //Up+Left
            }
            else {
                this.direction = (x + y) / 2 //Up+Right || Down+Right || Down+Left
            }
        }
        //Trying to walk on only one axis
        else {
            this.direction = x + y //Up || Down || Right || Left
        }

        //Save position to rollback if collided
        const rollbackPosition = { x: controller.position.x, y: controller.position.y }

        //Move background position if player is trying to move (player starts to move)
        this.isMoving = true
        this.changeState('walking')
        switch (this.direction) {
            case 1: //Up
                controller.position.y += 4 * this.velocity
                break;
            case 2: //Up+Right
                controller.position.y += 4 * this.velocity / Math.sqrt(2)
                controller.position.x -= 4 * this.velocity / Math.sqrt(2)
                break;
            case 3: //Right
                controller.position.x -= 4 * this.velocity
                break;
            case 4: //Down+Right
                controller.position.y -= 4 * this.velocity / Math.sqrt(2)
                controller.position.x -= 4 * this.velocity / Math.sqrt(2)
                break;
            case 5: //Down
                controller.position.y -= 4 * this.velocity
                break;
            case 6: //Down+Left
                controller.position.y -= 4 * this.velocity / Math.sqrt(2)
                controller.position.x += 4 * this.velocity / Math.sqrt(2)
                break;
            case 7: //Left
                controller.position.x += 4 * this.velocity
                break;
            case 8: //Up+left
                controller.position.y += 4 * this.velocity / Math.sqrt(2)
                controller.position.x += 4 * this.velocity / Math.sqrt(2)
                break;
            default:
                return
        }

        //Check collisions
        //const collidedBlocksDistances = [[], []] //Storage arrays of distance from player to collided blocks
        collisionTiles.forEach(block => {
            if (controller.isIntersecting(
                [(this.position.x - controller.position.x + this.hitbox.left),
                (this.position.y - controller.position.y + this.hitbox.up),
                (this.position.x - controller.position.x + this.hitbox.right),
                (this.position.y - controller.position.y + this.hitbox.down)],
                [(block.position.x + Boundary.width),
                (block.position.y + Boundary.height),
                (block.position.x),
                (block.position.y)])) {

                switch (this.direction) {
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

        */
    }

    attack() {
        if (player.useEnergy(2) === null) {
            return
        }
        this.changeState('attacking')
        controller.useSkill(this, 0)
    }

    die() {
        this.changeState('dead')
    }

    regen() {
        if (controller.t % 60 === 0) {
            this.useEnergy(-1)
        }
    }
}