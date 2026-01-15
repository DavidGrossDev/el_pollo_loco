let canvas;
let world;
let keyboard = new Keyboard();
let startBtnIsPressed = false;
function init() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
    checkButtons();
}

function startGame() {
    document.getElementById('start_btn').classList.add('d_none');
    world.startBtnIsPressed = true;
}

function checkButtons() {
    setInputTrue();
    setInputFalse();
}

function setInputTrue() {
    ['mousedown', 'touchstart'].forEach(event => 
    document.getElementById('btn_left').addEventListener(event, () => keyboard.LEFT = true));
    ['mousedown', 'touchstart'].forEach(event => 
    document.getElementById('btn_right').addEventListener(event, () => keyboard.RIGHT = true));
    ['mousedown', 'touchstart'].forEach(event => 
     document.getElementById('btn_jump').addEventListener(event, () => keyboard.SPACE = true));
    ['mousedown', 'touchstart'].forEach(event => 
    document.getElementById('btn_throw').addEventListener(event, () => keyboard.G = true));
}

function setInputFalse() {
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(event =>
        document.getElementById('btn_left').addEventListener(event, () => keyboard.LEFT = false)
    );
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(event =>
        document.getElementById('btn_right').addEventListener(event, () => keyboard.RIGHT = false)
    );
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(event =>
        document.getElementById('btn_jump').addEventListener(event, () => keyboard.SPACE = false)
    );
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(event =>
        document.getElementById('btn_throw').addEventListener(event, () => keyboard.G = false)
    );
}


window.addEventListener('keydown', (ev) => {
    if (ev.keyCode == 39) {
        keyboard.RIGHT = true;
    }

    if (ev.keyCode == 37) {
        keyboard.LEFT = true;
    }

    if (ev.keyCode == 38) {
        keyboard.UP = true;
    }

    if (ev.keyCode == 40) {
        keyboard.DOWN = true;
    }

    if (ev.keyCode == 32) {
        keyboard.SPACE = true;

    }

    if (ev.keyCode == 71) {
        keyboard.G = true;
    }
});

window.addEventListener('keyup', (ev) => {
    if (ev.keyCode == 39) {
        keyboard.RIGHT = false;
    }

    if (ev.keyCode == 37) {
        keyboard.LEFT = false;
    }

    if (ev.keyCode == 38) {
        keyboard.UP = false;
    }

    if (ev.keyCode == 40) {
        keyboard.DOWN = false;
    }

    if (ev.keyCode == 32) {
        keyboard.SPACE = false;
    }

    if (ev.keyCode == 71) {
        keyboard.G = false;
    }
});

