/* | View | */
//Animate every frame (60 FPS)
function animate() {
    //Animate Characters every 10 frames
    if (controller.t % 10 === 0) {
        //Player
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
            case 'dead':
                if (player.frameColumn < player.maxFrames) {
                    player.frameColumn++
                } else { break }
                break;
            default:
                player.frameColumn = (player.frameColumn % player.maxFrames) + 1
                break;
        }
        //Monsters
        maps.forEach((map) => {
            map.monsters.forEach((monster) => {
                switch (monster.state) {
                    case 'attacking':
                        if (monster.frameColumn < monster.maxFrames) {
                            monster.frameColumn++
                        }
                        else {
                            monster.changeState('standing')
                        }
                        break;
                    case 'walking':
                        if (monster.isMoving === true) {
                            monster.frameColumn = (monster.frameColumn % monster.maxFrames) + 1
                        }
                        else {
                            monster.changeState('standing')
                        }
                        break;
                    case 'dead':
                        if (monster.frameColumn < monster.maxFrames) {
                            monster.frameColumn++
                        } else { break }
                        break;
                    default:
                        monster.frameColumn = (monster.frameColumn % monster.maxFrames) + 1
                        break;
                }
            })
        })
    }

    //Background and Tiletypes
    background.draw() //Draw background
    //collisionTiles.forEach(block => { block.draw(255, 0, 0, 0.2) })//Draw collisionTiles
    //spawnableTiles.forEach(block => { block.draw(0, 0, 255, 0.2) })//Draw spawnableTiles

    //Monsters
    maps.forEach((map) => {
        map.monsters.forEach((monster) => {
            monster.draw() //Draw monster
            monster.move()
        })
    })

    //Player
    player.draw() //Draw player
    player.move() //Move player
    player.regen() //Regenerate player HP and energy

    //Active Skills
    activeSkills.forEach((skill) => {
        skill.isActive()
        skill.damageTargets()
    })

    //Controller
    controller.t %= 216000 //Reset counter every hour
    controller.t++
    window.requestAnimationFrame(animate) //60 FPS

}