/**
 * @typedef {{top:number,right:number,bottom:number,left:number}} BoxOffset
 */

/**
 * Coin is a collectible that animates between glowing frames.
 * @extends MovableObject
 *
 * @property {string[]} IMAGES_GLOWING - image frames for the coin glow animation
 * @property {BoxOffset} offset - collision offset used for hit detection
 */
class Coin extends MovableObject {

    /**
     * Glowing animation frames.
     * @type {string[]}
     */
    IMAGES_GLOWING = [
        './img/8_coin/coin_1.png',
        './img/8_coin/coin_2.png'
    ];

    /**
     * Collision offset.
     * @type {BoxOffset}
     */
    offset = {
        top: 45,
        right: 45,
        bottom: 45,
        left: 45
    };

    /**
     * Create a coin at the given position and start its animation.
     * @param {number} x - X position on the canvas.
     * @param {number} y - Y position on the canvas.
     */
    constructor(x, y) {
        super().loadImage('./img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_GLOWING);
        this.width = 120;
        this.height = 120;
        this.x = x; 
        this.y = y;  
        this.animate();
    }

    /**
     * Start the coin's glowing animation loop.
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_GLOWING);
        }, 250);
    }
}