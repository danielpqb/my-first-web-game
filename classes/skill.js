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
        hitInterval
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
        this.hitInterval = hitInterval
    }

    getSkillInfo() {
        this.duration = skillsInfo[this.id].duration
        this.hitboxSize = skillsInfo[this.id].hitboxSize
        this.hitboxOffset = skillsInfo[this.id].hitboxOffset
        this.hits = skillsInfo[this.id].hits
        this.hitInterval = skillsInfo[this.id].hitInterval
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

    drawHitbox() {
        //Should this skill still be active?
        this.isActive()

        c.fillStyle = 'rgba(0, 0, 255, 0.2)'
        c.fillRect(this.caster.position.x + this.hitboxOffset.x, this.caster.position.y + this.hitboxOffset.y, this.hitboxSize.width, this.hitboxSize.height)
    }

    getTargets() {

    }
}