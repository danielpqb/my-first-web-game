/* | Instanciate some Objects | */
//Controller
const controller = new Controller({ position: { x: -1000, y: -1000 } }) //Relative to Canvas
//Background
const background = new Background({})
//Player
const player = new Player({ hitboxOffset: [0, 50, 0, -20] })
//Monsters
const monsters = [] //Need to wait DOM objects
//Maps
const maps = [] //Need to wait DOM objects

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

window.onload = () => {
    /* | Instanciate objects after DOM is loaded | */
    //Monsters
    monstersInfo.forEach((monster) => {
        monsters.push(new Monster({
            id: monster.id,
            hp: monster.maxHp,
            maxHp: monster.maxHp,
            energy: monster.maxEnergy,
            maxEnergy: monster.maxEnergy,
            level: monster.level,
            velocity: monster.velocity,
            exp: monster.exp,
            respawnTime: monster.respawnTime,
            image: monster.image,
            hitboxOffset: monster.hitboxOffset,
            baseHitbox: [0, 0, monster.image.width / 7, monster.image.height / 5],
            hitbox: [monster.hitboxOffset[0], monster.hitboxOffset[1], monster.image.width / 7 + monster.hitboxOffset[2], monster.image.height / 5 + monster.hitboxOffset[3]],
        }))
    })
    //Maps
    mapsInfo.forEach((map) => {
        maps.push(new Map({
            name: map.name,
            nameId: map.nameId,
            monstersData: map.monstersData
        }))
    })
    //Create monsters on each map
    maps.forEach((map) => {
        map.createMonsters()
    })

    //Set some properties of objects
    player.setHitbox()

    //Listen to keys pressed down
    controller.listenKeysDown()

    //Animate game every frame (Infinite loop that is executed 60 times per second)
    animate()
}