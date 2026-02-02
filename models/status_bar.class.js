/**
 * @typedef {'HEALTH'|'COIN'|'BOTTLE'|'HEALTH_ENDBOSS'} StatusBarType
 */

/**
 * StatusBar represents a UI status bar (health, coins, bottles, endboss health).
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {

    /**
     * Mapping of status bar types to their image frames (6 frames each).
     * @type {Object.<StatusBarType, string[]>}
     */
    IMAGES = {
        HEALTH: [
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
            './img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
        ],
        COIN: [
            './img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
            './img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
        ],
        BOTTLE: [
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
            './img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
        ],
        HEALTH_ENDBOSS: [
            './img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
            './img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
        ]
    };

    /**
     * Current percentage values for each status bar type.
     * @type {Object.<StatusBarType, number>}
     */
    percentage = {
        HEALTH: 100,
        COIN: 0,
        BOTTLE: 0,
        HEALTH_ENDBOSS: 100
    };

    /**
     * Initial percentage for this instance's type.
     * @type {number}
     */
    initialPercentage;

    /**
     * Create a StatusBar.
     * @param {StatusBarType} arr - The status bar type to initialize.
     * @param {number} x - X position on the canvas.
     * @param {number} y - Y position on the canvas.
     */
    constructor(arr, x, y) {
        super();
        this.loadImages(this.IMAGES.HEALTH);
        this.loadImages(this.IMAGES.COIN);
        this.loadImages(this.IMAGES.BOTTLE);
        this.loadImages(this.IMAGES.HEALTH_ENDBOSS);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.setInitialPercentage(arr);
        this.setPercentage(arr, this.initialPercentage);
    }

    /**
     * Set the initial percentage for a given status bar type.
     * HEALTH and HEALTH_ENDBOSS default to 100, others to 0.
     * @param {StatusBarType} arr
     * @returns {void}
     */
    setInitialPercentage(arr) {
        if (arr == 'HEALTH' || arr == 'HEALTH_ENDBOSS') {
            this.initialPercentage = 100;
        } else {
            this.initialPercentage = 0;
        }
    }

    /**
     * Set the percentage value for the given status bar type and update the image.
     * @param {StatusBarType} arr
     * @param {number} percentage - New percentage (0-100).
     * @returns {void}
     */
    setPercentage(arr, percentage) {
        this.percentage[arr] = percentage;
        let path = this.IMAGES[arr][this.resolveImageIndex(arr)];
        this.img = this.imageCache[path];
    }

    /**
     * Resolve the correct image index (0..5) based on the current percentage for the given type.
     * @param {StatusBarType} arr
     * @returns {number} Image index in the frames array.
     */
    resolveImageIndex(arr) {
        if (this.percentage[arr] >= 100) {
            return 5;
        } else if (this.percentage[arr] >= 80) {
            return 4;
        } else if (this.percentage[arr] >= 60) {
            return 3;
        } else if (this.percentage[arr] >= 40) {
            return 2;
        } else if (this.percentage[arr] >= 5) {
            return 1;
        } else {
            return 0;
        }
    }
}