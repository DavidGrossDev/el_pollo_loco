let canvas;
let keyboard = new Keyboard();
let world;
let playCounter = 0;
const keyMap = {
    ArrowRight: 'RIGHT',
    ArrowLeft: 'LEFT',
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    Space: 'SPACE',
    KeyG: 'G'
};

function init() {
    canvas = document.getElementById('canvas');
    if (world) {
        world.stopGame();
    }
    world = new World(canvas, keyboard, playCounter);
    checkMuteWorld();
    disableContextMenuForGame();
    initControls();
    checkPlayCounter();
}

function checkMuteWorld() {
    let localMute = JSON.parse(localStorage.getItem("audio"));
    if(localMute != null) {
        if(localMute) {
            world.stopAudio(); 
            world.isMuted = true;
            document.getElementById('speaker_icon').src = "./img/speaker/mute.png";  
        }   
    }
}

function checkPlayCounter() {
    if (playCounter > 0) {
        document.getElementById('start_btn').classList.add('d_none');
        startGame();
    }
    playCounter++;
}

function startGame() {
    document.getElementById('start_btn').classList.add('d_none');
    world.startBtnIsPressed = true;
    world.playWorldMusic();
}

function toogleGameAudio() {
     world.toggleMute();
}

function bindButton(id, key) {
    const btn = document.getElementById(id);
    btn.addEventListener('pointerdown', () => {
        keyboard[key] = true;
    });
    btn.addEventListener('pointerup', () => {
        keyboard[key] = false;
    });
    btn.addEventListener('pointerleave', () => {
        keyboard[key] = false;
    });
}

function initControls() {
    bindButton('btn_left', 'LEFT');
    bindButton('btn_right', 'RIGHT');
    bindButton('btn_jump', 'SPACE');
    bindButton('btn_throw', 'G');
}

function disableContextMenuForGame() {
    const elements = document.querySelectorAll('canvas, button');

    elements.forEach(el => {
        el.addEventListener('contextmenu', e => {
            e.preventDefault();
        });
    });
}

window.addEventListener('keydown', (ev) => {
    if (keyMap[ev.code]) {
        keyboard[keyMap[ev.code]] = true;
        ev.preventDefault();
    }
});

window.addEventListener('keyup', (ev) => {
    if (keyMap[ev.code]) {
        keyboard[keyMap[ev.code]] = false;
        ev.preventDefault();
    }
});

