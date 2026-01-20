class ThrowableObject extends MovableObject {
    groundY = 180;
    IMAGES_ROTATE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];
    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];
    offset = {
        top: 15,
        right: 20,
        bottom: 15,
        left: 20
    };

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_ROTATE);
        this.loadImages(this.IMAGES_SPLASH);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 100;
        this.throw();
    }


    throw() {
        this.speedY = 45;
        this.speedX = 35;
        this.applyGravity(this.groundY);
        setInterval(() => {
            if (this.isDead()) {
                this.speedY = 0;
                this.speedX = 0;
                this.playOneWayAnimation(this.IMAGES_SPLASH);
            } else {
                this.x += 10;
                this.playAnimation(this.IMAGES_ROTATE);
            }
        }, 25);
    }   
}