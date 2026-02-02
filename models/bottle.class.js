/**
 * @typedef {{top:number,right:number,bottom:number,left:number}} BoxOffset
 */

/**
 * Bottle is a collectible bottle placed on the ground with randomized appearance.
 * @extends MovableObject
 *
 * @property {BoxOffset} offset - Collision offset used for hit detection.
 * @property {number} x - X position on the canvas.
 * @property {number} y - Y position on the canvas.
 * @property {number} width - Render width.
 * @property {number} height - Render height.
 */
class Bottle extends MovableObject {

    /**
     * Create a Bottle at a random horizontal position with one of two sprites.
     */
    constructor() {
        if (Math.round(Math.random() * 10) % 2) {
            super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
            this.offset = {
                top: 20,
                right: 10,
                bottom: 10,
                left: 20
            };
        } else {
            super().loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
            this.offset = {
                top: 20,
                right: 15,
                bottom: 10,
                left: 15
            };
        }
        this.x = 350 + (Math.random() * 1800);
        this.y = 330;
        this.width = 50;
        this.height = 100;
    }
}