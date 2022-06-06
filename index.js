const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const backgroundImage = new Image()
backgroundImage.src = './img/background.png'

const playerImage = new Image()
playerImage.src = './img/player.png'

function drawPlayerFrame(row, column) {
    c.drawImage(
        playerImage,
        playerImage.width / 6 * (column - 1), //Image Crop Xo
        playerImage.height / 4 * (row - 1), //Image Crop Yo
        playerImage.width / 6, //Image Crop Xo Offset
        playerImage.height / 4,//Image Crop Yo Offset
        canvas.width / 2 - playerImage.width / 12, //Image Xo Position on Canvas
        canvas.height / 2 - playerImage.height / 8,//Image Yo Position on Canvas
        playerImage.width / 6, //Image Xo Position Offset on Canvas
        playerImage.height / 4 //Image Yo Position Offset on Canvas
    )
}

backgroundImage.onload = () => {
    //c.drawImage(backgroundImage, 0, 0)
    //drawPlayerFrame(1, 1)
}

/*
background = 1,
playerStand = 10,
playerWalk,
playerAttack,
playerDie
*/

let i = 0
let b = 1

function animate() {

    /*switch (animationId) {
        case 1:
            c.drawImage(backgroundImage, 0, 0)
            console.log('animate1')
            window.requestAnimationFrame(animate)
            break;
        case 2:
            drawPlayerFrame(4, b)
            console.log('animate2')
            break;

    }*/

    c.drawImage(backgroundImage, 0, 0)
    drawPlayerFrame(3, b)

    if (i % 10 == 0) {
        b = (b % 4) + 1
    }
    i++
    
    window.requestAnimationFrame(animate)
    //60 frames per second
    
}
animate()




