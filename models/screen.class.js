class Screen extends DrawableObject {
    IMAGES = {
        END_LOST: [
            'img/9_intro_outro_screens/game_over/game over!.png',
            'img/9_intro_outro_screens/game_over/game over.png',
            'img/9_intro_outro_screens/game_over/oh no you lost!.png',
            'img/9_intro_outro_screens/game_over/you lost.png',
            'img/9_intro_outro_screens/game_over/game over!.png',
            'img/9_intro_outro_screens/game_over/game over.png',
            'img/9_intro_outro_screens/game_over/oh no you lost!.png',
            'img/9_intro_outro_screens/game_over/you lost.png',
            'img/9_intro_outro_screens/game_over/game over!.png',
            'img/9_intro_outro_screens/game_over/game over.png'
        ],
        END_WIN: [
            'img/You won, you lost/You Win A.png',
            'img/You won, you lost/You win B.png',
            'img/You won, you lost/You won A.png',
            'img/You won, you lost/You Won B.png',
            'img/You won, you lost/You Win A.png',
            'img/You won, you lost/You win B.png',
            'img/You won, you lost/You won A.png',
            'img/You won, you lost/You Won B.png',
            'img/You won, you lost/You Win A.png',
            'img/You won, you lost/You win B.png'
        ],
        START: [
            'img/9_intro_outro_screens/start/startscreen_1.png',
            'img/9_intro_outro_screens/start/startscreen_2.png',
        ]
    };
    random = 0;

    constructor(arr) {
        super();
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;

        if(arr === 'END_LOST' || arr === 'END_WIN') {
            this.random = Math.round(Math.random() * 10);
        } else if (arr === 'START') {
            this.random = Math.round(Math.random()*10) % 2;
        }
        this.loadImage(this.IMAGES[arr][this.random]);
    }
}