let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    

    console.log('My Character is', world.character);
}


window.addEventListener('keydown', (ev) => {
    if(ev.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if(ev.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if(ev.keyCode == 38) {
        keyboard.UP = true;
    }

    if(ev.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if(ev.keyCode == 32) {
        keyboard.SPACE = true;
    }
    
    if(ev.keyCode == 71) {
        keyboard.G = true; 
    }
});

window.addEventListener('keyup', (ev) => {
    if(ev.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if(ev.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if(ev.keyCode == 38) {
        keyboard.UP = false;
    }

    if(ev.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if(ev.keyCode == 32) {
        keyboard.SPACE = false;
    } 
    
    if(ev.keyCode == 71) {
        keyboard.G = false;
    }
});