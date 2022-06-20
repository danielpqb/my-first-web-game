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
        if (dmg >= object.hp) {
            object.hp = 0
            object.die()
        }
        else {
            object.hp -= dmg
        }
    }
    
    useSkill(object, id) {
        skActId++
        const skill = new Skill({ id: id, caster: object, activationId: skActId })
        skill.creationTime = controller.t
        skill.getSkillInfo()
    
        activeSkills.push(skill)
    
        // skill.getSkillInfo()
    
        // skill.drawHitbox()
    
    
        // skill.getTargets()
    
        //targets = [],
    }
}