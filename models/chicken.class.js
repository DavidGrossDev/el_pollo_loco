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
    IMAGES_WALKING = {
        normal: [
            'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
        ],
        small: [
            'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
            'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
        ]
    }
    IMAGE_DEAD = {
        normal: [
            'img/3_enemies_chicken/chicken_normal/2_dead/dead.png'
        ],
        small: [
            'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
        ]
    }

    constructor(arr) {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING[arr]);
        this.loadImages(this.IMAGE_DEAD[arr]);
        this.setOffset(arr);
        this.x = 250 + (Math.random() * 2000);
        this.speed = 0.15 + Math.random() * 0.25;
        this.animate(arr);
    }

    setOffset(arr) {
        if (arr === 'small') {
            this.offset = {
                top: 8,
                right: 8,
                bottom: 7,
                left: 8
            };
        }
    }

    animate(arr) {
        let setMoveLeft = setInterval(() => {
            if (this.world.startBtnIsPressed) {
                this.moveLeft();
            }
        }, 1000 / 60);
        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.IMAGE_DEAD[arr]);
                clearInterval(setMoveLeft);
                this.offset.top = 35;
            } else {
                this.playAnimation(this.IMAGES_WALKING[arr])
            }
        }, 200);
    }

}
