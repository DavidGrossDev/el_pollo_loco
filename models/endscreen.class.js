class Endscreen extends DrawableObject {
    IMAGES = [
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
    ];


    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;
        let random = Math.round(Math.random()*10);

        this.loadImage(this.IMAGES[random]);
    }

}