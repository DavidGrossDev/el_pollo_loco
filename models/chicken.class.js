/**
 * @typedef {{top:number,right:number,bottom:number,left:number}} BoxOffset
 */

/**
 * Chicken enemy: handles walking, death, and associated sounds/animations.
 * @extends MovableObject
 *
 * @property {number} y
 * @property {number} height
 * @property {number} width
 * @property {BoxOffset} offset
 * @property {number} counter - used to limit death audio playback
 * @property {HTMLAudioElement} dieAudio
 * @property {HTMLAudioElement} walkAudio
 */
class Chicken extends MovableObject {
    y = 365;
    height = 60;
    width = 60;
    offset = {
        top: 6,
        right: 2,
        bottom: 5,
        left: 2
    };
    counter = 0;
    dieAudio = new Audio('./sounds/chicken_die.mp3');
    walkAudio = new Audio('./sounds/chicken_sound.mp3');
    setMoveLeft;
    IMAGES_WALKING = {
        normal: [
            './img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            './img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            './img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ],
        small: [
            './img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            './img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            './img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ]
    }
    IMAGE_DEAD = {
        normal: [
            './img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
        ],
        small: [
            './img/3_enemies_chicken/chicken_small/2_dead/dead.png'
        ]
    }

    /**
     * Create a Chicken instance of given size variant.
     * @param {'normal'|'small'} arr - Variant selects images/offsets.
     */
    constructor(arr) {
        super();
        this.loadImages(this.IMAGES_WALKING[arr]);
        this.loadImages(this.IMAGE_DEAD[arr]);
        this.setOffset(arr);
        this.x = 250 + (Math.random() * 2000);
        this.speed = 0.15 + Math.random() * 0.25;
        this.soundSettings();
        this.animate(arr);
    }

    /**
     * Configure audio volume and playback rate.
     * @returns {void}
     */
    soundSettings() {
        this.dieAudio.volume = 0.1;
        this.dieAudio.playbackRate = 3.0;
        this.walkAudio.volume = 0.01;
    }

    /**
     * Set initial image and collision offset based on variant.
     * @param {'normal'|'small'} arr
     * @returns {void}
     */
    setOffset(arr) {
        if (arr === 'small') {
            this.loadImage('./img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
            this.offset = {
                top: 8,
                right: 8,
                bottom: 7,
                left: 10
            };
        } else {
            this.loadImage('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        }
    }

    /**
     * Initialize movement and animation loops for this chicken.
     * @param {'normal'|'small'} arr
     * @returns {void}
     */
    animate(arr) {
        this.InitialStartChicken();
        this.setChickenAnimationIntervals(arr);

    }

    /**
     * Start moving the chicken left when the world start button was pressed.
     * Plays walk audio while the world is running and not muted.
     * @returns {void}
     */
    InitialStartChicken() {
        this.setMoveLeft = setInterval(() => {
            if (this.world.startBtnIsPressed) {
                this.moveLeft();
                if (!this.world.checkCharacterDead() && !this.world.checkEndbossDead() && !this.world.isMuted) {
                    this.walkAudio.play();
                } else {
                    this.walkAudio.pause();
                    this.walkAudio.currentTime = 0;
                }
            }
        }, 1000 / 60);
    }

    /**
     * Set the interval that switches between walk and dead animations and handles death audio.
     * @param {'normal'|'small'} arr
     * @returns {void}
     */
    setChickenAnimationIntervals(arr) {
        setInterval(() => {
            if (this.isDead()) {
                if (!this.world.isMuted && this.counter < 1 && !this.world.checkCharacterDead() && !this.world.checkEndbossDead()) {
                    this.dieAudio.play();
                } else {
                    this.stopChickenAudio();
                }
                this.playAnimation(this.IMAGE_DEAD[arr]);
                this.setDeadChicken();
            } else {
                this.playAnimation(this.IMAGES_WALKING[arr])
            }
        }, 120);
    }

    /**
     * Stop and reset all chicken-related audio playback.
     * @returns {void}
     */
    stopChickenAudio() {
        this.walkAudio.pause();
        this.walkAudio.currentTime = 0;
        this.dieAudio.pause();
        this.dieAudio.currentTime = 0;
    }

    /**
     * Finalize chicken death: stop movement interval and adjust offsets.
     * @returns {void}
     */
    setDeadChicken() {
        clearInterval(this.setMoveLeft);
        this.offset.top = 35;
        this.counter++;
    }
}
