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

    soundSettings() {
        this.alertAudio.volume = 0.1;
        this.burnAudio.playbackRate = 2;
        this.burnAudio.volume = 0.1;
    }

    animate() {
        this.setIntervalForReaction();
        this.setIntervalForAnimations();
    }

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

    animationDead() {
        setInterval(() => {
            this.playAnimationOnce(this.IMAGES_DEAD);
            this.y += 30;
        }, 80);
    }

    playBurnSound() {
        if (!this.world.isMuted && !this.world.checkCharacterDead() && !this.world.checkEndbossDead()) {
            this.burnAudio.play();
        } else {
            this.burnAudio.pause();
            this.burnAudio.currentTime = 0;
        }
    }

    animationAlertOrWalking() {
        if (this.alertCounter < this.IMAGES_ARLERT.length - 1) {
            this.playAnimationAlert();
        } else {
            this.playAnimationEndbossWalking();
        }
    }

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

    playAnimationEndbossAttacking() {
        this.playAnimation(this.IMAGES_ATTACK);
        this.speed = 0.5;
        if (!this.otherDirection) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }

    inAlertRange() {
        return this.x - this.world.character.x < 580;
    }

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