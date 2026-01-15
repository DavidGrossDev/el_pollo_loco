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
    startJumping = false;
    counter = 0;
    jumpImageCounter = 0;
    lastEffectTime = Date.now();
    effectInterval = 150;
    enableMovement = true;
    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
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
    ]
    world;
    walkingAudio = new Audio('./sounds/charFootsteps.mp3');
    jumpAudio = new Audio('./sounds/charjump.mp3');
    

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.soundSettings();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DYING);
        this.loadImages(this.IMAGES_HURT);
        this.applyGravity(this.groundY);
        this.animate();
    }

    soundSettings() {
        this.walkingAudio.playbackRate = 3.0;
        this.walkingAudio.volume = 0.2;
        this.jumpAudio.playbackRate = 2.0;
        this.jumpAudio.volume = 0.2;
    }

    animate() {
        setInterval(() => {
            if (this.enableMovement && this.world.startBtnIsPressed) {
                if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                    this.moveRight();
                    this.otherDirection = false;
                }
                if (this.world.keyboard.LEFT && this.x > 0) {
                    this.moveLeft();
                    this.otherDirection = true;
                }
            }
            if (this.world.keyboard.SPACE && !this.isAboveGround(this.groundY) && this.world.startBtnIsPressed) {
                this.startJumping = true;
                this.enableMovement = false;
                setTimeout(() => {
                    this.enableMovement = true;
                }, 450);

            }
            this.world.camera_x = -this.x + 120;
        }, 1000 / 60);
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimationJumping(this.IMAGES_DYING);
            } else if (this.isHurt(0.2)) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.startJumping) {
                this.playAnimationJumping(this.IMAGES_JUMPING);
            } else {
                if ((this.world.keyboard.RIGHT || this.world.keyboard.LEFT) && this.world.startBtnIsPressed) {
                    this.playAnimation(this.IMAGES_WALKING);
                    this.walkingAudio.play();
                }
            }
        }, 60);

    }


    playAnimationJumping(images) {
        let now = Date.now();
        if (now - this.lastEffectTime < this.effectInterval) return;
        this.lastEffectTime = now;
        if (this.jumpImageCounter < (images.length - 1)) {
            if (this.jumpImageCounter == 3) {
                this.jump();
            }
            let i = this.jumpImageCounter;
            let path = images[i];
            this.img = this.imageCache[path];
            this.jumpImageCounter++;
        }
        if (this.jumpImageCounter == 8 && !this.isAboveGround(this.groundY)) {
            this.jumpImageCounter = 0;
            this.startJumping = false;
            console.log('erfolg');

        }
    }

}