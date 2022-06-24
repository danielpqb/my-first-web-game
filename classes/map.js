class Map {
    constructor({
        nameId,
        name,
        monsters = [],
        monstersData
    }) {
        this.nameId = nameId
        this.name = name
        this.monsters = monsters
        this.monstersData = monstersData
    }

    createMonsters() {
        //For each row of monster that a Map need to create
        this.monstersData.forEach((monsterData) => {
            //Loop monsters quantity
            for (let n = 0; n < monsterData.qnt; n++) {
                //Copy a monster using the 'id' and push it to Map
                this.monsters.unshift(new Monster(monsters[monsterData.monsterId]))

                /* -------------------------------------------------------------------------- */
                /* | Define the initial and individual properties of this monster | */
                /* | You must define here all properties that are Arrays and have to be UNIQUE for each monster | */
                /* | If you haven't defined, methods like push() or unshift() will make the monster share values with other monsters of same kind | */
                /* -------------------------------------------------------------------------- */
                //Position (relative to Background)
                const rnd = Math.floor(Math.random() * spawnableTiles.length)
                this.monsters[0].position = { x: spawnableTiles[rnd].position.x, y: spawnableTiles[rnd].position.y }

                //Temporarily store the damages that this monster has taken and when did it occur
                this.monsters[0].takingDamages = []
            }
        })
    }
}