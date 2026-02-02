/**
 * ThrowableObject represents a thrown salsa bottle with rotation and splash animations.
 * @class
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    /** @type {number} Y coordinate of the ground (landing position). */
    groundY = 180;

    /** @type {string[]} Image paths used for rotation animation. */
    IMAGES_ROTATE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    /** @type {string[]} Image paths used for splash animation. */
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    /**
     * Collision offset for hit detection.
     * @type {{top:number,right:number,bottom:number,left:number}}
     */
    offset = {
        top: 15,
        right: 20,
        bottom: 15,
        left: 20
    };

    /**
     * Create a ThrowableObject.
     * @param {number} x - Initial x position.
     * @param {number} y - Initial y position.
     * @param {boolean} otherDirection - True if thrown to the left.
     */
    constructor(x, y, otherDirection) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 100;
        /** @type {boolean} Direction of throw: true = left, false = right. */
        this.direktion = otherDirection;
        this.throw();
    }

    /**
     * Start throwing the object by applying an initial upward speed and gravity,
     * then repeatedly animate rotation until broken, and splash once broken.
     * @returns {void}
     */
    throw() {
        this.speedY = 45;
        this.applyGravity(this.groundY);
        setInterval(() => {
            if (this.isDead()) {
                this.setBrokeVariables();
                this.playAnimationOnce(this.IMAGES_SPLASH);
            } else {
                this.setSettingsForThrow();
                this.playAnimation(this.IMAGES_ROTATE);
            }
        }, 25);
    }

    /**
     * Set variables when the bottle is broken: stop movement and adjust collision offset.
     * @returns {void}
     */
    setBrokeVariables() {
        this.speedY = 0;
        this.speedX = 0;
        this.offset = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };
    }

    /**
     * Set horizontal speed and small position offset based on throw direction.
     * @returns {void}
     */
    setSettingsForThrow() {
        if (!this.direktion) {
            this.x += 10;
            this.speedX = 35;
        } else {
            this.speedX = -35;
            this.x -= 10;
        }
    }
}