class Skill {
    constructor({
        id,
        activationId,
        duration,
        creationTime,
        caster,
        targets = [],
        hitboxSize = { width: 0, height: 0 }, //[width, height]
        hitboxOffset = { x: 0, y: 0 }, //[x, y] Distance in pixels
        hits = 1,
        hitCounter = 1,
        hitInterval,
        position = { x: 0, y: 0 },
        type = 'self'
    }) {
        this.id = id
        this.activationId = activationId
        this.duration = duration
        this.creationTime = creationTime
        this.caster = caster
        this.targets = targets
        this.hitboxSize = hitboxSize
        this.hitboxOffset = hitboxOffset
        this.hits = hits
        this.hitCounter = hitCounter
        this.hitInterval = hitInterval
        this.position = position
        this.type = type
    }

    getSkillInfo() {
        //Get info from skills.js
        this.duration = skillsInfo[this.id].duration
        this.hitboxSize = skillsInfo[this.id].hitboxSize
        this.hitboxOffset = skillsInfo[this.id].hitboxOffset
        this.hits = skillsInfo[this.id].hits
        this.hitInterval = skillsInfo[this.id].hitInterval
        this.type = skillsInfo[this.id].type

        //Get coordinates of the skill based on skill info
        this.getPosition()
    }

    isActive() {
        //Disactivate skill if duration is over
        if (controller.t > this.duration + this.creationTime) {
            activeSkills.forEach((skill, i) => {
                if (skill.activationId == this.activationId) {
                    activeSkills.splice(i, 1)
                }
            })
        }
    }

    getPosition() {
        switch (this.type) {
            case 'location':
            // const clickCoord = getClickedPosition()
            // if (clickCoord === false) {
            //     break;
            // }
            // this.position.x = clickCoord.x + this.hitboxOffset.x - this.hitboxSize.width / 2
            // this.position.y = clickCoord.y + this.hitboxOffset.y - this.hitboxSize.height / 2
            // break;
            default:
                this.position.x = this.caster.position.x - controller.position.x + this.hitboxOffset.x - this.hitboxSize.width / 2
                this.position.y = this.caster.position.y - controller.position.y + this.hitboxOffset.y - this.hitboxSize.height / 2
                break;
        }
    }

    drawHitbox() {
        c.fillStyle = 'rgba(0, 0, 255, 0.2)'
        c.fillRect(this.position.x + controller.position.x, this.position.y + controller.position.y, this.hitboxSize.width, this.hitboxSize.height)
    }

    getTargets() {
        this.targets = []
        if (this.hitCounter <= this.hits) {
            this.hitCounter++
            switch (this.caster.constructor.name) {
                case 'Player':
                    maps[0].monsters.forEach((monster) => {
                        if (controller.isIntersecting(
                            [this.position.x,
                            this.position.y,
                            this.position.x + this.hitboxSize.width,
                            this.position.y + this.hitboxSize.height],
                            [monster.position.x + monster.hitbox[2],
                            monster.position.y + monster.hitbox[3],
                            monster.position.x + monster.hitbox[0],
                            monster.position.y + monster.hitbox[1]
                            ])) {

                            this.targets.push(monster)
                        }
                    })
                    break;
                case 'Monster':

                    break;
            }
        }

    }

    damageTargets() {
        //this.drawHitbox()
        this.getTargets()

        this.targets.forEach((target) => {
            controller.takeDamage(target, 5 + player.level)
        })

        //Should this skill still be active?
        this.isActive()
    }
}