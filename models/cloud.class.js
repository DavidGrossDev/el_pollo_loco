/**
 * Cloud is a background element that drifts left across the level.
 * @extends MovableObject
 *
 * @property {number} y - Vertical position.
 * @property {number} width - Render width.
 * @property {number} height - Render height.
 */
class Cloud extends MovableObject {
    y = 20;
    width = 500;
    height = 250;

    /**
     * Create a cloud at a random horizontal position and start movement.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 2500;
        this.animate();
    }

    /**
     * Start the cloud movement loop (moves left continuously).
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        },60); 
    }
}