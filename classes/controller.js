class Controller {
    constructor({
        t = 0, //Count number of frames since animate starts
        position = { x: 0, y: 0 }, //Relative to canvas window
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
                    if (player.isDead === false && player.state != 'attacking') {
                        player.attack()
                    }
                    break;
            }
        })
    }

    takeDamage(object, dmg) {
        //Create property takingDamages if monster doesn't have it yet
        if (object.takingDamages == undefined) {
            object.takingDamages = []
        }

        //Calculate damage
        dmg = Math.min(object.hp, dmg)

        //Show damage numbers on screen
        if (object.isDead === false) {
            object.takingDamages.push({ damage: dmg, time: this.t })
        }

        //Reduce object hp
        if (object.hp - dmg <= 0) {
            object.hp = 0
            object.die()
        }
        else {
            object.hp -= dmg
            if(object.snared === false) {
                object.changeState('aching')
            }
        }
    }

    useSkill(object, id) {
        skActId++
        const skill = new Skill({ id: id, caster: object, activationId: skActId })
        skill.creationTime = controller.t
        skill.getSkillInfo()

        activeSkills.push(skill)
    }

    isIntersecting(block1, block2) {
        const left = (block1[0] - block2[0])
        const up = (block1[1] - block2[1])
        const right = (block1[2] - block2[2])
        const down = (block1[3] - block2[3])

        if (right >= 0 && left <= 0 && up <= 0 && down >= 0) {
            return true
        }
        else {
            return false
        }
    }
}