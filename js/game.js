/**
 * @typedef {{[code:string]: string}} KeyMap
 */

/** @type {HTMLCanvasElement|null} */
let canvas;
/** @type {Keyboard} */
let keyboard = new Keyboard();
/** @type {World|undefined} */
let world;
/** @type {number} */
let playCounter = 0;

/**
 * Mapping from KeyboardEvent.code to Keyboard property name.
 * @type {KeyMap}
 */
const keyMap = {
    ArrowRight: 'RIGHT',
    ArrowLeft: 'LEFT',
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    Space: 'SPACE',
    KeyG: 'G'
};

/**
 * Initialize the game: set up canvas, world, controls and audio. If a world is already running it will be stopped.
 * @returns {void}
 */
function init() {
    canvas = document.getElementById('canvas');
    if (world) {
        world.stopGame();
    }
    world = new World(canvas, keyboard, playCounter);
    document.getElementById('home_btn').classList.add('d_none');
    checkMuteWorld();
    disableContextMenuForGame();
    initControls();
    if (playCounter > 0) {
        checkPlayCounter();
    }
    playCounter++;
}

/**
 * Return to home screen and reinitialize state.
 * @returns {void}
 */
function toHome() {
    world.startBtnIsPressed = false;
    playCounter = 0;
    document.getElementById('start_btn').innerText = "Start Game";
    document.getElementById('start_btn').onclick = () => {
        startGame();
    };
    init();
}

/**
 * Read audio preference from localStorage and mute world audio if requested.
 * @returns {void}
 */
function checkMuteWorld() {
    let localMute = JSON.parse(localStorage.getItem("audio"));
    if (localMute != null) {
        if (localMute) {
            world.stopAudio();
            world.isMuted = true;
            document.getElementById('speaker_icon').src = "./img/speaker/mute.png";
        }
    }
}

/**
 * If the game was played before, automatically start it.
 * @returns {void}
 */
function checkPlayCounter() {
    document.getElementById('start_btn').classList.add('d_none');
    startGame();
}

/**
 * Start the game (hide start button, set start flag, play music).
 * @returns {void}
 */
function startGame() {
    document.getElementById('start_btn').classList.add('d_none');
    world.startBtnIsPressed = true;
    world.playWorldMusic();
}

/**
 * Toggle the game audio/mute state.
 * @returns {void}
 */
function toogleGameAudio() {
    world.toggleMute();
}

/**
 * Bind a touch/control button to a keyboard state property.
 * @param {string} id - DOM id of the button element.
 * @param {string} key - Keyboard property name (e.g. 'LEFT','RIGHT','SPACE','G').
 * @returns {void}
 */
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

/**
 * Initialize on-screen control bindings.
 * @returns {void}
 */
function initControls() {
    bindButton('btn_left', 'LEFT');
    bindButton('btn_right', 'RIGHT');
    bindButton('btn_jump', 'SPACE');
    bindButton('btn_throw', 'G');
}

/**
 * Disable the default context menu for game canvas and buttons.
 * @returns {void}
 */
function disableContextMenuForGame() {
    const elements = document.querySelectorAll('canvas, button');

    elements.forEach(el => {
        el.addEventListener('contextmenu', e => {
            e.preventDefault();
        });
    });
}

/**
 * Handle keydown events: set corresponding Keyboard properties to true.
 * @param {KeyboardEvent} ev
 * @returns {void}
 */
window.addEventListener('keydown', (ev) => {
    if (keyMap[ev.code]) {
        keyboard[keyMap[ev.code]] = true;
        ev.preventDefault();
    }
});

/**
 * Handle keyup events: set corresponding Keyboard properties to false.
 * @param {KeyboardEvent} ev
 * @returns {void}
 */
window.addEventListener('keyup', (ev) => {
    if (keyMap[ev.code]) {
        keyboard[keyMap[ev.code]] = false;
        ev.preventDefault();
    }
});

