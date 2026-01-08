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
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];
    IMAGE_DEAD = [
        'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
    ]

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGE_DEAD);

        this.x = 200 + (Math.random() * 2000);
        this.speed = 0.15 + Math.random() * 0.25;

        this.animate();
    }

    animate() {

       let setMoveLeft = setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGE_DEAD);
                clearInterval(setMoveLeft);
                this.offset.top = 35;
            } else {
                this.playAnimation(this.IMAGES_WALKING)
            }

        }, 200);
    }

}
