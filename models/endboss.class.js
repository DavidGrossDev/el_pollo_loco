class Endboss extends MovableObject {
    y = 140;
    height = 300;
    width = 300;
    speed = 1;
    offset = {
        top: 55,
        right: 30,
        bottom: 10,
        left: 25
    };
    sawCharacter = false;
    readyToAttack = false;
    world;
    alertCounter = 0;
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    IMAGES_ARLERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];
    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];
    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];
    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];
    
    constructor() {
        super().loadImage('img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ARLERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);

        this.x = 2500;
        this.energy = 800;

        this.animate();
    }

    animate() {

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


        setInterval(() => {

            //     this.moveLeft();
            if (this.isDead()) {
                setInterval(() => {
                    this.playAnimationOnce(this.IMAGES_DEAD);
                    this.y += 30;
                }, 80);
            } else if (this.isHurt(1)) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.readyToAttack) {
                this.playAnimation(this.IMAGES_ATTACK);
                this.speed = 0.15;
                this.moveLeft();
            } else if (this.sawCharacter) {
                if (this.alertCounter < this.IMAGES_ARLERT.length - 1) {
                    this.playAnimation(this.IMAGES_ARLERT);
                    this.alertCounter++;
                } else {
                    this.speed = 1;
                    this.moveLeft();
                    this.playAnimation(this.IMAGES_WALKING);
                }

            }
        }, 200);
    }

    inAlertRange() {
        return this.x - this.world.character.x < 300; 
    }

    inAttackRange() {
        let endbossX = this.x + this.offset.left;
        let characterX = this.world.character.x + this.world.character.width - (this.world.character.offset.left + this.world.character.offset.right);
        return endbossX - characterX < 21;
    }


}