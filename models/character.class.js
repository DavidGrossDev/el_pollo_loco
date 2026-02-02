/**
 * @typedef {{top:number,right:number,bottom:number,left:number}} BoxOffset
 */

/**
 * Character (the player) handles input-driven movement, jumping, animations and sounds.
 * @extends MovableObject
 *
 * @property {number} x
 * @property {number} y
 * @property {number} groundY
 * @property {number} height
 * @property {number} width
 * @property {number} speed
 * @property {BoxOffset} offset
 * @property {string[]} IMAGES_WALKING
 * @property {string[]} IMAGES_JUMPING
 * @property {string[]} IMAGES_DYING
 * @property {string[]} IMAGES_HURT
 * @property {string[]} IMAGES_IDLE
 * @property {string[]} IMAGES_LONGIDLE
 * @property {World} world - reference to game world (set externally)
 * @property {HTMLAudioElement} walkingAudio
 * @property {HTMLAudioElement} jumpAudio
 * @property {HTMLAudioElement} hurtAudio
 */
class Character extends MovableObject {
    x = 120;
    y = 180;
    groundY = 180;
    height = 250;
    width = 100;
    speed = 10;
    offset = {
        top: 120,
        right: 30,
        bottom: 10,
        left: 20
    };
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_DYING = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];
    IMAGES_LONGIDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];
    world;
    walkingAudio = new Audio('./sounds/charFootsteps.mp3');
    jumpAudio = new Audio('./sounds/charjump.mp3');
    hurtAudio = new Audio('./sounds/grunt.mp3');

    /**
     * Create the playable character, preload images, apply gravity and start animations.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.soundSettings();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DYING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONGIDLE);
        this.applyGravity(this.groundY);
        this.animate();
    }

    /**
     * Configure playback rate and volume for character sounds.
     * @returns {void}
     */
    soundSettings() {
        this.walkingAudio.playbackRate = 3.0;
        this.walkingAudio.volume = 0.2;
        this.jumpAudio.playbackRate = 2.0;
        this.jumpAudio.volume = 0.2;
        this.hurtAudio.volume = 0.1;
    }

    /**
     * Start movement and camera intervals as well as other animation loops.
     * @returns {void}
     */
    animate() {
        this.setCharackterMovementIntervals();
        this.setIntervalsForAnimations();
    }

    /**
     * Set an interval to read keyboard state and move the character (also handles jumping and camera).
     * @returns {void}
     */
    setCharackterMovementIntervals() {
        setInterval(() => {
            if (this.enableMovement && this.world.startBtnIsPressed) {
                if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                    this.startMovementRight();
                }
                if (this.world.keyboard.LEFT && this.x > 0) {
                    this.startMovementLeft();
                }
            }
            if (this.world.keyboard.SPACE && !this.isAboveGround(this.groundY) && this.world.startBtnIsPressed) {
                this.setJumpingVariables();
            }
            this.world.camera_x = -this.x + 120;
        }, 1000 / 60);
    }

    /**
     * Set animation intervals that select between dying, hurt, jumping, idle and walking animations.
     * @returns {void}
     */
    setIntervalsForAnimations() {
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimationOnce(this.IMAGES_DYING);
            } else if (this.isHurt(0.2)) {
                this.checkMutingForHurtSound();
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.startJumping || this.isAboveGround(this.groundY)) {
                this.playAnimationOnce(this.IMAGES_JUMPING, "jump", 80);
                this.setMovementTime();
            } else if (this.checkLastMovement()) {
                this.playAnimationIdle();
            } else {
                this.checkForWalking();
            }
        }, 60);
    }

    /**
     * Play hurt sound if not muted, otherwise ensure it's paused.
     * @returns {void}
     */
    checkMutingForHurtSound() {
        if (!this.world.isMuted) {
            this.hurtAudio.play();
        } else {
            this.hurtAudio.pause();
        }
    }

    /**
     * Play walking animation if movement keys are pressed.
     * @returns {void}
     */
    checkForWalking() {
        if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && this.world.startBtnIsPressed) {
            this.playAnimationWalking();
        }
    }

    /**
     * Play walking animation and sound if not muted.
     * @returns {void}
     */
    playAnimationWalking() {
        this.playAnimation(this.IMAGES_WALKING);
        if (!this.world.isMuted) {
            this.walkingAudio.play();
        }
    }

    /**
     * Play idle or long-idle animations with appropriate timing.
     * @returns {void}
     */
    playAnimationIdle() {
        if (this.gotToLongIdle) {
            this.playAnimationOnce(this.IMAGES_LONGIDLE, "idle", 250);
        }
        this.playAnimationOnce(this.IMAGES_IDLE, "idle", 300);
    }
}