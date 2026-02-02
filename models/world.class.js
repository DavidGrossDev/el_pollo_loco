/**
 * Main game world that manages game objects, rendering and collisions.
 *
 * @class World
 * @property {Character} character - The main playable character.
 * @property {boolean} gameOver - True when the game has finished.
 * @property {Screen} startScreen - Start screen UI object.
 * @property {Screen} endWinScreen - Win screen UI object.
 * @property {Screen} endLostScreen - Lose screen UI object.
 * @property {HTMLCanvasElement} canvas - Rendering canvas.
 * @property {Object} keyboard - Keyboard input state.
 * @property {CanvasRenderingContext2D} ctx - Canvas 2D context.
 * @property {number} camera_x - Camera horizontal offset.
 * @property {StatusBar} statusBarHealth - Player health bar.
 * @property {StatusBar} statusBarCoin - Coin counter bar.
 * @property {StatusBar} statusBarBottle - Bottle counter bar.
 * @property {StatusBar} statusBarHealthEndboss - Endboss health bar.
 * @property {Array<ThrowableObject>} throwableObjects - Thrown bottles in the world.
 * @property {number} takedCoins - Accumulated coin value (used as percentage).
 * @property {number} lootedBottle - Accumulated bottle value (used as percentage).
 */
class World {
    character = new Character();
    gameOver = false;
    startScreen = new Screen('START');
    endWinScreen = new Screen('END_WIN');
    endLostScreen = new Screen('END_LOST');
    canvas;
    keyboard;
    ctx;
    camera_x = 0;
    statusBarHealth = new StatusBar('HEALTH', 30, 37);
    statusBarCoin = new StatusBar('COIN', 30, 80);
    statusBarBottle = new StatusBar('BOTTLE', 30, 0);
    statusBarHealthEndboss = new StatusBar('HEALTH_ENDBOSS', 490, 10);
    throwableObjects = [];
    coins = [];
    bottles = [];
    takedCoins = 0;
    lootedBottle = 0;
    collisionBody;
    throwBottle;
    collisionBottle;
    startBtnIsPressed = false;
    time = new Date().getTime();
    posFlankCounter = 0;
    check;

    /**
     * Create the world.
     * @param {HTMLCanvasElement} canvas - Canvas element used for drawing.
     * @param {Object} keyboard - Keyboard input helper (key states).
     * @param {number} playCounter - Counter to track play attempts.
     */
    constructor(canvas, keyboard, playCounter) {
        this.level = createNewLevel();
        this.playCounter = playCounter;
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.running = true;
        this.worldMusic = new Audio("./sounds/cowbell-for-songs-phonk-217006.mp3");
        this.worldMusic.volume = 0.05;
        this.worldMusic.loop = true;
        this.draw();
        this.setWorld();
        this.run();
    }

    /**
     * Toggle mute/unmute for world audio and update UI.
     * @returns {void}
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.worldMusic.pause();
            this.worldMusic.currentTime = 0;
            this.mute = true;
            localStorage.setItem("audio", JSON.stringify(world.mute));
            document.getElementById('speaker_icon').src = "./img/speaker/mute.png";
        } else {
            this.playWorldMusic();
            this.mute = false;
            localStorage.setItem("audio", JSON.stringify(world.mute));
            document.getElementById('speaker_icon').src = "./img/speaker/speaker.png";
        }
    }


    /**
     * Attempt to play world music if not muted and game has started.
     * @returns {void}
     */
    playWorldMusic() {
        if (this.isMuted) return;
        if (!this.startBtnIsPressed) return;
        if (this.worldMusic.paused) {
            this.worldMusic.play();
        }
    }

    /**
     * Wire world reference into character and enemies so objects can access world state.
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });
    }

    /**
     * Start repeated checks (collisions, throws) used during gameplay.
     * @returns {void}
     */
    run() {
        this.collisionBody = setInterval(() => {
            this.checkCollisions();
        }, 1000 / 60);
        this.throwBottle = setInterval(() => {
            this.checkThrowObjects();
        }, 1000 / 60);
        this.collisionBottle = setInterval(() => {
            this.checkEnemieCollisionsWithBottles();
        }, 1000 / 60);
    }

    /**
     * Stop the game flow and prepare to show end screens / reset.
     * @returns {void}
     */
    stopGame() {
        this.stopAudio();
        if (!this.gameOver) {
            this.stopCheckingCollisions();
            this.character.enableMovement = false;
            setTimeout(() => {
                for (let i = 0; i < 9999; i++) {
                    clearInterval(i);
                }
                this.prepareForPlayAgain();
                this.gameOver = true;
            }, 1000);
        }
    }

    /**
     * Stop all game-related audio playback.
     * @returns {void}
     */
    stopAudio() {
        this.worldMusic.pause();
        this.worldMusic.currentTime = 0;
        this.character.walkingAudio.pause();
        this.character.walkingAudio.currentTime = 0;
        this.character.jumpAudio.pause();
        this.character.jumpAudio.currentTime = 0;
        this.character.hurtAudio.pause();
        this.character.hurtAudio.currentTime = 0;
    }

    /**
     * Clear running collision/throw intervals.
     * @returns {void}
     */
    stopCheckingCollisions() {
        clearInterval(this.collisionBody);
        clearInterval(this.throwBottle);
        clearInterval(this.collisionBottle);
    }

    /**
     * Create a throwable object if player has bottles and throw cooldown has elapsed.
     * @returns {void}
     */
    checkThrowObjects() {
        if (this.keyboard.G && this.lootedBottle > 0 && !this.checkTimeBetweenThrows()) {
            let bottle = new ThrowableObject(this.character.x + this.character.width - 50, this.character.y + (this.character.height / 2) - 30, this.character.otherDirection);
            this.lootedBottle -= 17;
            this.statusBarBottle.setPercentage('BOTTLE', this.lootedBottle);
            this.throwableObjects.push(bottle);
            this.time = new Date().getTime();
            this.character.setMovementTime();
            this.character.loadImage('./img/2_character_pepe/1_idle/idle/I-1.png');
        }
    }

    /**
     * Check if enough time has passed since the last throw (2 seconds).
     * @returns {boolean} True if still within cooldown (i.e., throws are blocked).
     */
    checkTimeBetweenThrows() {
        let timePassed = new Date().getTime() - this.time;
        timePassed = timePassed / 1000;
        return timePassed < 2;
    }

    /**
     * Handle collisions between throwable objects and enemies (including endboss).
     * @returns {void}
     */
    checkEnemieCollisionsWithBottles() {
        this.level.enemies.forEach((enemy) => {
            if (this.throwableObjects.length > 0 && this.throwableObjects[0].isColliding(enemy) && enemy.energy > 0 && enemy.canBeHit(enemy)) {
                enemy.energy -= 120;
                enemy.lastHit = Date.now();
                this.resetThrowableObjects();
                if (enemy instanceof Endboss) {
                    this.statusBarHealthEndboss.setPercentage('HEALTH_ENDBOSS', enemy.energy / 6);
                }
            }
            else if (this.throwableObjects.length > 0 && this.throwableObjects[0].y > 325) {
                this.resetThrowableObjects();
            }
        });
    }


    /**
     * Top-level collision checks and cleanup called every frame tick.
     * @returns {void}
     */
    checkCollisions() {
        this.checkCollisionWithEnemies();
        this.checkCollisionWithCoins();
        this.checkCollisionsWithBottles();
        this.drawRestCollectables();
    }

    /**
     * Check character collisions with enemies and apply damage/jump kills.
     * @returns {void}
     */
    checkCollisionWithEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && this.character.speedY < 0 && enemy.energy > 0 && enemy.canBeHit(enemy)) {
                enemy.energy -= 120;
                enemy.lastHit = Date.now();
                if (enemy instanceof Endboss) {
                    this.statusBarHealthEndboss.setPercentage('HEALTH_ENDBOSS', enemy.energy / 6);
                }
            } else if (this.character.isColliding(enemy) && enemy.energy > 0 && !this.character.startJumping) {
                if (!this.character.isHurt(0.2)) {
                    this.setCharacterHealth();
                }
            }
        });
    }

    /**
     * Apply character hit logic and update the health bar.
     * @returns {void}
     */
    setCharacterHealth() {
        this.character.hit();
        this.statusBarHealth.setPercentage('HEALTH', this.character.energy);
    }

    /**
     * Collect coins on contact and update coin status bar.
     * @returns {void}
     */
    checkCollisionWithCoins() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.takedCoins += 5.3;
                this.statusBarCoin.setPercentage('COIN', this.takedCoins);
                coin.isCollected = true;
            }
        });
    }

    /**
     * Collect bottles on contact and update bottle status bar.
     * @returns {void}
     */
    checkCollisionsWithBottles() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.lootedBottle += 17;
                this.statusBarBottle.setPercentage('BOTTLE', this.lootedBottle);
                bottle.isCollected = true;
            }
        });
    }

    /**
     * Remove collected coins and bottles from level arrays.
     * @returns {void}
     */
    drawRestCollectables() {
        this.level.coins = this.level.coins.filter(c => !c.isCollected);
        this.level.bottles = this.level.bottles.filter(b => !b.isCollected);
    }

    /**
     * Clear throwable objects after impact/expiration.
     * @returns {void}
     */
    resetThrowableObjects() {
        this.throwableObjects[0].energy = 0;
        setTimeout(() => {
            this.throwableObjects = [];
        }, 180);
    }

    /**
     * The main draw loop entry. Shows start screen or game frames and requests next frame.
     * @returns {void}
     */
    draw() {
        if (!this.startBtnIsPressed) {
            this.showStartScreen();
        } else {
            this.drawTheGame();
        }
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        })
    }

    /**
     * Draw the entire game frame (background, UI, objects) and check end conditions.
     * @returns {void}
     */
    drawTheGame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawTheBackgrounds();
        this.ctx.translate(-this.camera_x, 0);
        this.drawTheStatusBars();
        this.ctx.translate(this.camera_x, 0);
        this.drawTheMovableObjects();
        this.ctx.translate(-this.camera_x, 0);
        this.checkEndConditions();
    }

    /**
     * Draw background layers like clouds and static scenery.
     * @returns {void}
     */
    drawTheBackgrounds() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
    }

    /**
     * Draw health, coin, bottle and endboss bars.
     * @returns {void}
     */
    drawTheStatusBars() {
        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);
        this.showEndbossHealthbar();
    }

    /**
     * Draw movable objects: collectibles, enemies, character and thrown objects.
     * @returns {void}
     */
    drawTheMovableObjects() {
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
    }

    /**
     * Add an array of objects to the map (draw each).
     * @param {Array<Object>} array - The array of drawable/movable objects.
     * @returns {void}
     */
    addObjectsToMap(array) {
        array.forEach(obj => {
            this.addToMap(obj);
        });
    }

    /**
     * Add a single object to the map; handles flipping when otherDirection is set.
     * @param {Object} mo - Movable/drawable object with draw(ctx) method.
     * @returns {void}
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Display the start screen.
     * @returns {void}
     */
    showStartScreen() {
        this.addToMap(this.startScreen);
    }

    /**
     * Show the endboss health bar when player is close enough to it.
     * @returns {void}
     */
    showEndbossHealthbar() {
        let levelEndboss = this.level.enemies[this.level.enemies.length - 1];
        if (levelEndboss.x - this.character.x < 580 && levelEndboss.energy > 0) {
            this.addToMap(this.statusBarHealthEndboss);
        }
    }

    /**
     * Check victory/defeat and add respective end screens.
     * @returns {void}
     */
    checkEndConditions() {
        if (this.checkCharacterDead()) {
            this.addToMap(this.endLostScreen);
            this.stopGame();
        } else if (this.checkEndbossDead()) {
            this.addToMap(this.endWinScreen);
            this.stopGame();
        }
    }

    /**
     * Checks whether the character is dead.
     * @returns {boolean}
     */
    checkCharacterDead() {
        return this.character.energy <= 0;
    }

    /**
     * Checks whether the endboss is dead.
     * @returns {boolean}
     */
    checkEndbossDead() {
        let levelEndboss = this.level.enemies[this.level.enemies.length - 1]
        return levelEndboss.energy <= 0;
    }

    /**
     * Prepare UI for replay (e.g., show play again button).
     * @returns {void}
     */
    prepareForPlayAgain() {
        if (this.posFlankCounter == 0) {
            document.getElementById('start_btn').classList.remove('d_none');
            document.getElementById('start_btn').innerText = "Play again";
            document.getElementById('start_btn').onclick = () => {
                init();
            };
            document.getElementById('home_btn').classList.remove('d_none');
        }
        this.posFlankCounter++;
    }

    /**
     * Flip the canvas horizontally for objects that face the other direction.
     * @param {Object} mo - Object being flipped (must have width/x).
     * @returns {void}
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restore canvas after flip.
     * @param {Object} mo - Object being un-flipped.
     * @returns {void}
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}