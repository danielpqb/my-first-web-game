class Background {
    constructor({
        image = backgroundImage
    }) {
        this.image = image
    }

    draw() {
        c.drawImage(this.image, controller.position.x, controller.position.y)
    }
}