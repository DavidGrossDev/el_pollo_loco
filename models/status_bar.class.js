class StatusBar extends DrawableObject {


    IMAGES = {
        HEALTH: [
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
            'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
        ],
        COIN: [
            'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
            'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
        ],
        BOTTLE: [
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
            'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
        ],
        HEALTH_ENDBOSS: [
            'img/7_statusbars/2_statusbar_endboss/orange/orange0.png',
            'img/7_statusbars/2_statusbar_endboss/orange/orange20.png',
            'img/7_statusbars/2_statusbar_endboss/orange/orange40.png',
            'img/7_statusbars/2_statusbar_endboss/orange/orange60.png',
            'img/7_statusbars/2_statusbar_endboss/orange/orange80.png',
            'img/7_statusbars/2_statusbar_endboss/orange/orange100.png'
        ]
    };
    percentage = {
        HEALTH: 100,
        COIN: 0,
        BOTTLE: 0,
        HEALTH_ENDBOSS:100
    };

    initialPercentage;

    constructor(arr, x, y) {
        super();
        this.loadImages(this.IMAGES.HEALTH);
        this.loadImages(this.IMAGES.COIN);
        this.loadImages(this.IMAGES.BOTTLE);
        this.loadImages(this.IMAGES.HEALTH_ENDBOSS);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        if (arr == 'HEALTH' || arr == 'HEALTH_ENDBOSS') {
            this.initialPercentage = 100;
        } else {
            this.initialPercentage = 0;
        }
        this.setPercentage(arr, this.initialPercentage);

    }

    setPercentage(arr, percentage) {
        this.percentage[arr] = percentage;
        let path = this.IMAGES[arr][this.resolveImageIndex(arr)];
        this.img = this.imageCache[path];
    }

    resolveImageIndex(arr) {
        if (this.percentage[arr] >= 100) {
            return 5;
        } else if (this.percentage[arr] >= 80) {
            return 4;
        } else if (this.percentage[arr] >= 60) {
            return 3;
        } else if (this.percentage[arr] >= 40) {
            return 2;
        } else if (this.percentage[arr] >= 20) {
            return 1;
        } else {
            return 0;
        }
    }
}