/**
 * BackgroundObject represents a static background layer image placed at a given X coordinate.
 * Extends MovableObject to reuse drawing helpers.
 *
 * @extends MovableObject
 * @property {number} y - Vertical position (default 0).
 * @property {number} width - Rendered width (default 720).
 * @property {number} height - Rendered height (default 480).
 */
class BackgroundObject extends MovableObject {
    
    y = 0;
    width = 720;
    height = 480;
    /**
     * Construct a BackgroundObject.
     * @param {string} imagePath - Path to the background image asset.
     * @param {number} x - Horizontal position at which to place the image.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
    }
}