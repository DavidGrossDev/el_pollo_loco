/**
 * @typedef {'action'|'idle'|'jump'} MovementMode
 */

/**
 * MovableObject extends DrawableObject and provides physics, movement, and
 * animation helpers used by game entities (players, enemies, items, etc.).
 *
 * @extends DrawableObject
 *
 * @property {number} groundY
 * @property {number} speed
 * @property {boolean} otherDirection
 * @property {number} speedY
 * @property {number} acceleration
 * @property {{top:number,right:number,bottom:number,left:number}} offset
 * @property {boolean} isCollected
 * @property {number} energy
 * @property {number} lastHit
 * @property {boolean} dead
 * @property {boolean} startJumping
 * @property {boolean} gotToLongIdle
 * @property {number} jumpImageCounter
 * @property {number} effectCounter
 * @property {number} lastEffectTime
 * @property {number} effectInterval
 * @property {boolean} enableMovement
 * @property {number} lastMove
 */
class MovableObject extends DrawableObject {

    groundY;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 5; //defaul 2.5
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };
    isCollected = false;
    energy = 100;
    lastHit = 0;
    dead = false;
    startJumping = false;
    gotToLongIdle = false;
    jumpImageCounter = 0;
    effectCounter = 0;
    lastEffectTime = Date.now();
    effectInterval = 150;
    enableMovement = true;
    lastMove = new Date().getTime();

    constructor() {
        super();
    }

    /**
	 * Apply gravity to the object, runs on a fixed interval.
	 * @param {number} groundY - y coordinate of the ground level.
	 * @returns {void}
	 */
    applyGravity(groundY) {
        setInterval(() => {
            if (this.isAboveGround(groundY) || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
                this.effectImage = 0;
            }
        }, 1000 / 25)
    }

    /**
	 * Determine whether the object is above the ground.
	 * @param {number} groundY
	 * @returns {boolean}
	 */
    isAboveGround(groundY) {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < groundY;
        }
    }

    /**
	 * Whether this object can be hit by the given enemy (hit cooldown).
	 * @param {{lastHit:number}} enemy
	 * @returns {boolean}
	 */
    canBeHit(enemy) {
        const now = Date.now();
        return now - enemy.lastHit > 1500;
    }

    /**
	 * Axis-aligned bounding box collision check that respects offsets and facing.
	 * @param {MovableObject} mo
	 * @returns {boolean}
	 */
    isColliding(mo) {
        if (!this.otherDirection) {
            return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
                this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
                this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
                this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
        } else {
            return this.x + this.width - this.offset.left > mo.x + mo.offset.left &&
               this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
               this.x + this.offset.right < mo.x + mo.width - mo.offset.right &&
               this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
        }
        
    }

    /**
	 * Apply a hit to the object, reducing energy and updating lastHit.
	 * @returns {void}
	 */
    hit() {
        this.energy -= 10;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
	 * Check if the object was hurt within `time` seconds.
	 * @param {number} time - Number of seconds to consider.
	 * @returns {boolean}
	 */
    isHurt(time) {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < time;
    }

    /**
	 * Whether the object is dead (energy <= 0).
	 * @returns {boolean}
	 */
    isDead() {
        return this.energy <= 0;
    }

    /**
	 * Move object to the right by its speed.
	 * @returns {void}
	 */
    moveRight() {
        this.x += this.speed;
    }

    /**
	 * Move object to the left by its speed.
	 * @returns {void}
	 */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
	 * Cycle image for ongoing animation.
	 * @param {string[]} images - Array of image paths.
	 * @returns {void}
	 */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
	 * Reset movement timers and flags (called when movement starts).
	 * @returns {void}
	 */
    setMovementTime() {
        this.lastMove = new Date().getTime();
        this.gotToLongIdle = false;
        this.idleCounter = 0;
        this.effectCounter = 0;
    }

    /**
	 * Check if last movement was more than 0.25s ago.
	 * @returns {boolean}
	 */
    checkLastMovement() {
        let now = new Date().getTime();
        let timePassed = now - this.lastMove;
        return timePassed / 1000 > 0.25;
    }

    /**
	 * Play an animation sequence once with rate limiting.
	 * @param {string[]} images
	 * @param {MovementMode} [mode="action"]
	 * @param {number} [effectInterval]
	 * @returns {void}
	 */
    playAnimationOnce(images, mode = "action", effectInterval) {
        let now = Date.now();
        if (now - this.lastEffectTime < effectInterval) return;
        this.lastEffectTime = now;
        if (mode === "jump") {
            this.animateJumping(images);
            return;
        } else if (mode === "idle") {
            this.animateEffect(images, mode);
        } else if (mode === "action") {
            this.animateEffect(images, mode)
        }
    }

    /**
	 * Handle jump animation sequence.
	 * @param {string[]} images
	 * @returns {void}
	 */
    animateJumping(images) {
        if (this.jumpImageCounter == images.length) {
            this.jumpImageCounter = 0;
            this.startJumping = false;
            return;
        }
        if (this.jumpImageCounter < images.length) {
            if (this.jumpImageCounter == 0) {
                this.jump();
            }
            let i = this.jumpImageCounter;
            let path = images[i];
            this.img = this.imageCache[path];
            this.jumpImageCounter++;
        }
    }

    /**
	 * Handle other short effect animations (idle/action).
	 * @param {string[]} images
	 * @param {string} mode
	 * @returns {void}
	 */
    animateEffect(images, mode) {
        if (this.effectCounter == images.length - 1) {
            if (mode === "idle") {
                this.gotToLongIdle = true;
            }
            this.effectCounter = 0;
            return;
        }
        if (this.effectCounter < (images.length - 1)) {
            let i = this.effectCounter;
            let path = images[i];
            this.img = this.imageCache[path];
            this.effectCounter++;
        }
    }

    /**
	 * Start continuous movement to the right, update facing and timers.
	 * @returns {void}
	 */
    startMovementRight() {
        this.moveRight();
        this.setMovementTime();
        this.otherDirection = false;
    }

    /**
	 * Start continuous movement to the left, update facing and timers.
	 * @returns {void}
	 */
    startMovementLeft() {
        this.moveLeft();
        this.setMovementTime();
        this.otherDirection = true;
    }

    /**
	 * Mark that a jumping animation/sequence should start.
	 * @returns {void}
	 */
    setJumpingVariables() {
        this.startJumping = true;
    }

    /**
	 * Initiate a jump by setting vertical speed and play sound if not muted.
	 * @returns {void}
	 */
    jump() {
        this.speedY = 35;
        if (!this.world.isMuted) {
            this.jumpAudio.play();
        }
    }
}