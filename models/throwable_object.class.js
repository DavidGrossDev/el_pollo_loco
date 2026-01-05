class ThrowableObject extends MovableObject {
    groundY = 180;
    IMAGES_ROTATE = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    constructor(x,y) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');
        this.loadImages(this.IMAGES_ROTATE);
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 100;
        this.throw();
    }


    throw() {
        this.speedY = 30;
        this.speedX = 20;
        this.applyGravity(this.groundY);
        setInterval(() => {
            this.x += 10;
            this.playAnimation(this.IMAGES_ROTATE);
        }, 25);
    }
}