/**
 * @typedef {{[path: string]: HTMLImageElement}} ImageCache
 */

/**
 * Base drawable object with basic image loading and drawing helpers.
 * @class DrawableObject
 */
class DrawableObject {
	/**
	 * X position on canvas.
	 * @type {number}
	 */
	x;
	/**
	 * Y position on canvas.
	 * @type {number}
	 */
	y;
	/**
	 * Drawn height.
	 * @type {number}
	 */
	height;
	/**
	 * Drawn width.
	 * @type {number}
	 */
	width;
	/**
	 * Current image displayed for this object.
	 * @type {HTMLImageElement|undefined}
	 */
	img;
	/**
	 * Cache of preloaded images by path.
	 * @type {ImageCache}
	 */
	imageCache = {};
	/**
	 * Index for current animation frame.
	 * @type {number}
	 */
	currentImage = 0;
	/**
	 * Effect image index (used by some animations).
	 * @type {number}
	 */
	effectImage = 0;
	
	/**
	 * Load a single image and set it as the current image.
	 * @param {string} path - Path to the image file.
	 * @returns {void}
	 */
	loadImage(path) {
		this.img = new Image();
		this.img.src = path;
	}

	/**
	 * Draw the current image to the provided rendering context.
	 * @param {CanvasRenderingContext2D} ctx - Canvas 2D rendering context.
	 * @returns {void}
	 */
	draw(ctx) {
		ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
	}

	/**
	 * Preload an array of image paths into imageCache.
	 * @param {string[]} arr - Array of image file paths.
	 * @returns {void}
	 */
	loadImages(arr) {
		arr.forEach((path) => {
			let img = new Image();
			img.src = path;
			this.imageCache[path] = img;
		});
	}

}