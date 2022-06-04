const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const backgroundImage = new Image()
backgroundImage.src = './img/background.png'

const playerImage = new Image()
playerImage.src = './img/player.png'

c.fillStyle = 'white'
c.fillRect(0,0,canvas.width,canvas.height)

c.drawImage(backgroundImage)
