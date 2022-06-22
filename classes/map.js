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

                //Define the initial position of this monster
                const rnd = Math.floor(Math.random() * spawnableTiles.length)
                this.monsters[0].position = { x: spawnableTiles[rnd].position.x, y: spawnableTiles[rnd].position.y }
            }
        })
    }
}