class Coin extends CollectaleObject {
    
    IMAGES_GLOWING = [
        'img/8_coin/coin_1.png',
        'img/8_coin/coin_2.png'
    ];
    offset = {
        top: 45,
        right: 45,
        bottom: 45,
        left: 45
    };

    constructor() {
        super().loadImage('img/8_coin/coin_1.png');
        this.loadImages(this.IMAGES_GLOWING);
        this.width = 120;
        this.height = 120;
        this.x = 200 + (Math.random() * 1800);
        this.y = 200 + (Math.random() * 120);
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_GLOWING);
        },250);
    }
}