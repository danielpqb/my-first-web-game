/* ------------------- */
/* Program starts here */
/* ------------------- */
//Return true or false if key is pressed
const isKeyDown = (() => {
    const state = {};
    window.addEventListener('keyup', (e) => state[e.key] = false);
    window.addEventListener('keydown', (e) => state[e.key] = true);
    return (key) => state.hasOwnProperty(key) && state[key] || false;
})();

//HTML DOM object with a <canvas> tag
const canvas = document.querySelector('canvas')
canvas.width = 1536 //Window width
canvas.height = 864 //Window height
const c = canvas.getContext('2d')

//HTML DOM objects from player status bar
const hpBar = document.querySelector('.hpStatusBar')
const energyBar = document.querySelector('.energyStatusBar')
const expBar = document.querySelector('.expStatusBar')

//Max width that bars can have (this width represents player max HP)
const hpBarMaxWidth = hpBar.clientWidth
const energyBarMaxWidth = energyBar.clientWidth
const expBarMaxWidth = expBar.clientWidth

//HTML DOM objects from player status data
const hpData = document.querySelector('.hpData2')
const energyData = document.querySelector('.energyData2')
const levelData = document.querySelector('.expData2')

//Create images as HTML DOM objects and refer there path
const backgroundImage = new Image()
backgroundImage.src = './img/trainingMap.png'
const playerImage = new Image()
playerImage.src = './img/player.png'
const slimeImage = new Image()
slimeImage.src = './img/slime.png'

//Instanciate Objects
const controller = new Controller({ position: { x: -1000, y: -1000 } }) //Relative to Canvas
const background = new Background({})
const player = new Player({ hitboxOffset: [0, 50, 0, -20] })

// Get collisions data and slice it.
// Each array inside collisionsMap will have a size of map width (in tiles).
// The number of arrays inside collisionsMap represents the number of tiles in Y coordinate.
// The values inside arrays of collisionsMap represents the Id that 'Tiled' signed for each tile type.
const collisionsMap = []
for (let i = 0; i < collisions.length; i += 110) {
    collisionsMap.push(collisions.slice(i, 110 + i))
}
// row: Array of tiles on 'y' position
// id: ID of the tile on 'x' position
//     Example (10 x 3 Map):    x: 0  1  2  3  4  5  6  7  8  9  y:
//     0 1 1 1 1 1 1 1 1 1   row: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1] 0  => id: 0, id: 1, id: 1 ....
//     0 0 1 1 1 1 1 1 1 1   row: [0, 0, 1, 1, 1, 1, 1, 1, 1, 1] 1
//     0 0 0 1 1 1 1 1 1 1   row: [0, 0, 0, 1, 1, 1, 1, 1, 1, 1] 2
const collisionTiles = []
collisionsMap.forEach((row, y) => {
    row.forEach((id, x) => {
        if (id === 3251) //CollisionTile Id
            collisionTiles.push(new Boundary({
                position: {
                    x: x * Boundary.width, // X coordinate in pixels relative to Background
                    y: y * Boundary.height // Y coordinate in pixels relative to Background
                }
            }))
    })
})
//Do the same for spawnable tiles
const spawnablesMap = []
for (let i = 0; i < spawnables.length; i += 110) {
    spawnablesMap.push(spawnables.slice(i, 110 + i))
}
const spawnableTiles = []
spawnablesMap.forEach((row, y) => {
    row.forEach((id, x) => {
        if (id === 3252) //SpawnableTile Id
            spawnableTiles.push(new Boundary({
                position: {
                    x: x * Boundary.width, // X coordinate in pixels relative to Background
                    y: y * Boundary.height // Y coordinate in pixels relative to Background
                }
            }))
    })
})

//Store active skills
let skActId = 0 //Skill Activation Id
const activeSkills = []

//Store monsters related to each map
const trainingMapMonsters = []
for (let i = 0; i < 50; i++) {
    const rnd = Math.floor(Math.random() * spawnableTiles.length)
    trainingMapMonsters.push(new Monster({
        position: { x: spawnableTiles[rnd].position.x, y: spawnableTiles[rnd].position.y },
        hitboxOffset: [15, 30, -15, -20]
    }));
}

window.onload = () => {
    //Set some properties of objects
    player.setHitbox()
    trainingMapMonsters.forEach((monster) => {
        monster.setHitbox()
    })

    //Listen to keys pressed down
    controller.listenKeysDown()

    //Animate game every frame (Infinite loop that is executed 60 times per second)
    animate()
}

//View
//Do something every frame
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
        trainingMapMonsters.forEach((monster) => {
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
    }

    //Background and Tiletypes
    background.draw() //Draw background
    //collisionTiles.forEach(block => { block.draw(255, 0, 0, 0.2) })//Draw collisionTiles
    //spawnableTiles.forEach(block => { block.draw(0, 0, 255, 0.2) })//Draw spawnableTiles

    //Monsters
    trainingMapMonsters.forEach((monster) => {
        monster.draw() //Draw monster
        monster.move()
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