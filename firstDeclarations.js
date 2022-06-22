/* | Functions | */
//Return true or false if key is pressed
const isKeyDown = (() => {
    const state = {};
    window.addEventListener('keyup', (e) => state[e.key] = false);
    window.addEventListener('keydown', (e) => state[e.key] = true);
    return (key) => state.hasOwnProperty(key) && state[key] || false;
})();

/* | HTML DOM objects | */
//Canvas
const canvas = document.querySelector('canvas')
canvas.width = 1536 //Window width
canvas.height = 864 //Window height
const c = canvas.getContext('2d')
//Player Status Bars
const hpBar = document.querySelector('.hpStatusBar')
const energyBar = document.querySelector('.energyStatusBar')
const expBar = document.querySelector('.expStatusBar')
const hpBarMaxWidth = hpBar.clientWidth
const energyBarMaxWidth = energyBar.clientWidth
const expBarMaxWidth = expBar.clientWidth
//Player Status Data
const hpData = document.querySelector('.hpData2')
const energyData = document.querySelector('.energyData2')
const levelData = document.querySelector('.expData2')
//Images
const backgroundImage = new Image()
backgroundImage.src = './img/trainingMap.png'
const playerImage = new Image()
playerImage.src = './img/player.png'
const slimeImage = new Image()
slimeImage.src = './img/slime.png'
const greenslimeImage = new Image()
greenslimeImage.src = './img/greenslime.png'
const redslimeImage = new Image()
redslimeImage.src = './img/redslime.png'