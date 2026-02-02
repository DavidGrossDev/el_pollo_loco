/**
 * Endboss is the main boss enemy with alert, attack, hurt and dead states.
 * It handles loading its images, audio settings and animation loops.
 *
 * @extends MovableObject
 *
 * @property {number} y
 * @property {number} height
 * @property {number} width
 * @property {number} speed
 * @property {{top:number,right:number,bottom:number,left:number}} offset
 * @property {boolean} sawCharacter - whether the boss has detected the player
 * @property {boolean} readyToAttack - whether boss is in attack range
 * @property {World} world - reference to game world (set after instantiation)
 * @property {HTMLAudioElement} alertAudio
 * @property {HTMLAudioElement} burnAudio
 * @property {string[]} IMAGES_WALKING
 * @property {string[]} IMAGES_ARLERT
 * @property {string[]} IMAGES_ATTACK
 * @property {string[]} IMAGES_DEAD
 * @property {string[]} IMAGES_HURT
 */
class Endboss extends MovableObject {
    y = 140;
    height = 300;
    width = 300;
    speed = 1;
    offset = {
        top: 60,
        right: 50,
        bottom: 45,
        left: 50
    };
    sawCharacter = false;
    readyToAttack = false;
    world;
    alertCounter = 0;
    audioCounter = 0;
    alertAudio = new Audio('./sounds/surprise.mp3');
    burnAudio = new Audio("./sounds/fire.mp3");
    IMAGES_WALKING = [
        './img/4_enemie_boss_chicken/1_walk/G1.png',
        './img/4_enemie_boss_chicken/1_walk/G2.png',
        './img/4_enemie_boss_chicken/1_walk/G3.png',
        './img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    IMAGES_ARLERT = [
        './img/4_enemie_boss_chicken/2_alert/G5.png',
        './img/4_enemie_boss_chicken/2_alert/G6.png',
        './img/4_enemie_boss_chicken/2_alert/G7.png',
        './img/4_enemie_boss_chicken/2_alert/G8.png',
        './img/4_enemie_boss_chicken/2_alert/G9.png',
        './img/4_enemie_boss_chicken/2_alert/G10.png',
        './img/4_enemie_boss_chicken/2_alert/G11.png',
        './img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_ATTACK = [
        './img/4_enemie_boss_chicken/3_attack/G13.png',
        './img/4_enemie_boss_chicken/3_attack/G14.png',
        './img/4_enemie_boss_chicken/3_attack/G15.png',
        './img/4_enemie_boss_chicken/3_attack/G16.png',
        './img/4_enemie_boss_chicken/3_attack/G17.png',
        './img/4_enemie_boss_chicken/3_attack/G18.png',
        './img/4_enemie_boss_chicken/3_attack/G19.png',
        './img/4_enemie_boss_chicken/3_attack/G20.png'
    ];
    IMAGES_DEAD = [
        './img/4_enemie_boss_chicken/5_dead/G24.png',
        './img/4_enemie_boss_chicken/5_dead/G25.png',
        './img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    IMAGES_HURT = [
        './img/4_enemie_boss_chicken/4_hurt/G21.png',
        './img/4_enemie_boss_chicken/4_hurt/G22.png',
        './img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    /**
     * Initialize the Endboss: load images, set starting position & energy,
     * configure sounds and start animation loops.
     */
    constructor() {
        super().loadImage('./img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ARLERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.x = 2500;
        this.energy = 600;
        this.soundSettings();
        this.animate();
    }

    /**
     * Configure volume and playback settings for alert and burn audio.
     * @returns {void}
     */
    soundSettings() {
        this.alertAudio.volume = 0.1;
        this.burnAudio.playbackRate = 2;
        this.burnAudio.volume = 0.1;
    }

    /**
     * Start the endboss reaction and animation intervals.
     * @returns {void}
     */
    animate() {
        this.setIntervalForReaction();
        this.setIntervalForAnimations();
    }

    /**
     * Periodically update detection and attack readiness flags based on player position.
     * @returns {void}
     */
    setIntervalForReaction() {
        setInterval(() => {
            if (this.inAlertRange()) {
                this.sawCharacter = true;
            }
            if (this.inAttackRange()) {
                this.readyToAttack = true;
            } else {
                this.readyToAttack = false;
            }
        }, 200);
    }

    /**
     * Periodically select and run the correct animation based on state (dead/hurt/attack/alert).
     * @returns {void}
     */
    setIntervalForAnimations() {
        setInterval(() => {
            if (this.isDead()) {
                this.animationDead();
            } else if (this.isHurt(1)) {
                this.playBurnSound();
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.readyToAttack) {
                this.playAnimationEndbossAttacking();
            } else if (this.sawCharacter) {
                this.animationAlertOrWalking();
            }
        }, 200);
    }

    /**
     * Play the death animation once and move the boss down slightly.
     * @returns {void}
     */
    animationDead() {
        setInterval(() => {
            this.playAnimationOnce(this.IMAGES_DEAD);
            this.y += 30;
        }, 80);
    }

    /**
     * Play or stop the burn audio based on world state (mute/character or endboss death).
     * @returns {void}
     */
    playBurnSound() {
        if (!this.world.isMuted && !this.world.checkCharacterDead() && !this.world.checkEndbossDead()) {
            this.burnAudio.play();
        } else {
            this.burnAudio.pause();
            this.burnAudio.currentTime = 0;
        }
    }

    /**
     * Choose between alert animation or walking depending on alertCounter.
     * @returns {void}
     */
    animationAlertOrWalking() {
        if (this.alertCounter < this.IMAGES_ARLERT.length - 1) {
            this.playAnimationAlert();
        } else {
            this.playAnimationEndbossWalking();
        }
    }

    /**
     * Play alert audio (if allowed) and cycle alert animation frames.
     * @returns {void}
     */
    playAnimationAlert() {
        if (!this.world.isMuted && !this.world.checkCharacterDead() && !this.world.checkEndbossDead()) {
            this.alertAudio.play();
        } else {
            this.alertAudio.pause();
            this.alertAudio.currentTime = 0;
        }
        this.playAnimation(this.IMAGES_ARLERT);
        this.alertCounter++;
    }

    /**
     * Move and animate the boss to walk toward the character.
     * @returns {void}
     */
    playAnimationEndbossWalking() {
        if (this.world.character.x <= this.x) {
            this.speed = 40;
            this.otherDirection = false;
            this.moveLeft();
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.speed = 40;
            this.otherDirection = true;
            this.moveRight();
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Play attack animation and move slightly depending on facing direction.
     * @returns {void}
     */
    playAnimationEndbossAttacking() {
        this.playAnimation(this.IMAGES_ATTACK);
        this.speed = 0.5;
        if (!this.otherDirection) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }

    /**
     * Whether the boss should enter the "alert" behavior (player nearby).
     * @returns {boolean}
     */
    inAlertRange() {
        return this.x - this.world.character.x < 580;
    }

    /**
     * Determine whether the character is close enough to be considered in attack range.
     * Uses offsets to compute sides and returns true if within attack proximity.
     * @returns {boolean}
     */
    inAttackRange() {
        const endbossLeft = this.x + this.offset.left;
        const endbossRight = this.x + this.width - this.offset.right;
        const characterLeft = this.world.character.x + this.world.character.offset.left;
        const characterRight = this.world.character.x +
            this.world.character.width -
            this.world.character.offset.right;
        const distance = endbossLeft - characterRight;
        if (distance >= 0) {
            return distance < 5;
        } else {
            const reverseDistance = characterLeft - endbossRight;
            return reverseDistance < 10;
        }
    }


}