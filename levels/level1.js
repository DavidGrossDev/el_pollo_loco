let level1
function initLevel() {
    level1 = new Level(
        [
            new Chicken('normal'),
            new Chicken('normal'),
            new Chicken('normal'),
            new Chicken('small'),
            new Chicken('small'),
            new Chicken('small'),
            new Endboss()
        ],
        [
            new Cloud(),
            new Cloud(),
            new Cloud()
        ],
        [
            new BackgroundObject('img/5_background/layers/air.png', -720),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720),
            new BackgroundObject('img/5_background/layers/air.png', 0),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),
            new BackgroundObject('img/5_background/layers/air.png', 720),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),
            new BackgroundObject('img/5_background/layers/air.png', 720 * 2),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720 * 2),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720 * 2),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720 * 2),
            new BackgroundObject('img/5_background/layers/air.png', 720 * 3),
            new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720 * 3),
            new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720 * 3),
            new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720 * 3),
            new BackgroundObject('img/5_background/layers/air.png', 720 * 4),
            new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720 * 4),
            new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720 * 4),
            new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720 * 4),
        ],
        [
            new Coin(300, 325),
            new Coin(350, 270),
            new Coin(410, 240),
            new Coin(470, 270),
            new Coin(520, 325),
            new Coin(680, 150),
            new Coin(900, 150),
            new Coin(1000, 325),
            new Coin(1050, 270),
            new Coin(1110, 240),
            new Coin(1170, 270),
            new Coin(1220, 325),
            new Coin(1380, 150),
            new Coin(1600, 150),
            new Coin(1700, 325),
            new Coin(1750, 270),
            new Coin(1810, 240),
            new Coin(1870, 270),
            new Coin(1920, 325)
        ],
        [
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle(),
            new Bottle()
        ]
    );
}