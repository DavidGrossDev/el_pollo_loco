/**
 * @typedef {'END_LOST'|'END_WIN'|'START'} ScreenType
 */

/**
 * Screen represents intro/outro/start screens.
 * @extends DrawableObject
 */
class Screen extends DrawableObject {
    /**
     * Image lists for each screen type.
     * @type {Object.<ScreenType, string[]>}
     */
    IMAGES = {
        END_LOST: [
            './img/9_intro_outro_screens/game_over/game over!.png',
            './img/9_intro_outro_screens/game_over/game over.png',
            './img/9_intro_outro_screens/game_over/oh no you lost!.png',
            './img/9_intro_outro_screens/game_over/you lost.png',
            './img/9_intro_outro_screens/game_over/game over!.png',
            './img/9_intro_outro_screens/game_over/game over.png',
            './img/9_intro_outro_screens/game_over/oh no you lost!.png',
            './img/9_intro_outro_screens/game_over/you lost.png',
            './img/9_intro_outro_screens/game_over/game over!.png',
            './img/9_intro_outro_screens/game_over/game over.png',
            './img/9_intro_outro_screens/game_over/oh no you lost!.png'
        ],
        END_WIN: [
            './img/You won, you lost/You Win A.png',
            './img/You won, you lost/You win B.png',
            './img/You won, you lost/You won A.png',
            './img/You won, you lost/You Won B.png',
            './img/You won, you lost/You Win A.png',
            './img/You won, you lost/You win B.png',
            './img/You won, you lost/You won A.png',
            './img/You won, you lost/You Won B.png',
            './img/You won, you lost/You Win A.png',
            './img/You won, you lost/You win B.png',
            './img/You won, you lost/You won A.png'
        ],
        START: [
            './img/9_intro_outro_screens/start/startscreen_1.png',
            './img/9_intro_outro_screens/start/startscreen_2.png',
        ]
    };

    /**
     * Create a new Screen.
     * @param {ScreenType} arr - The screen type to display.
     */
    constructor(arr) {
        super();
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;

        /**
         * Random index selected for choosing an image variant.
         * @type {number}
         */
        if(arr === 'END_LOST' || arr === 'END_WIN') {
            this.random = Math.round(Math.random() * 10);
        } else if (arr === 'START') {
            this.random = Math.round(Math.random()*10) % 2; 
        }
        this.loadImage(this.IMAGES[arr][this.random]);
    }
}