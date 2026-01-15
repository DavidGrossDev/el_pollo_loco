class Bottle extends CollectableObject {


    constructor() {
        if (Math.round(Math.random() * 10) % 2) {
            super().loadImage('img/6_salsa_bottle/1_salsa_bottle_on_ground.png');
            this.offset = {
                top: 20,
                right: 10,
                bottom: 10,
                left: 20
            };
        } else {
            super().loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
            this.offset = {
                top: 20,
                right: 15,
                bottom: 10,
                left: 15
            };
        }
        this.x = 200 + (Math.random() * 1800);
        this.y = 330;
        this.width = 50;
        this.height = 100;
    }
}