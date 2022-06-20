class Boundary {
    static width = 48
    static height = 48
    constructor({ position }) {
        this.position = position
        this.width = 48
        this.height = 48
    }

    draw(red, green, blue, opacity) { //x and y are the offset coordinate of player position
        const rgba = `rgba(${red}, ${green}, ${blue}, ${opacity})`
        c.fillStyle = rgba
        c.fillRect(this.position.x + controller.position.x, this.position.y + controller.position.y, this.width, this.height)
    }
}