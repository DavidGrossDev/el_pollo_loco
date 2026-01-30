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

    toggleMute() {

        this.isMuted = !this.isMuted;

        if (this.isMuted) {
            this.worldMusic.pause();
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


    playWorldMusic() {

        if (this.isMuted) return;
        if (!this.startBtnIsPressed) return;

        if (this.worldMusic.paused) {
            this.worldMusic.play();
        }
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach((enemy) => {
            enemy.world = this;
        });
    }

    run() {

        this.collisionBody = setInterval(() => {
            this.checkCollisions();
        }, 1000 / 60);

        this.throwBottle = setInterval(() => {
            this.checkThrowObjects();
        }, 200);

        this.collisionBottle = setInterval(() => {
            this.checkEnemieCollisionsWithBottles();
        }, 100);
    }

    stopGame() {
        if (!this.gameOver) {
            this.stopAudio();
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

    stopCheckingCollisions() {
        clearInterval(this.collisionBody);
        clearInterval(this.throwBottle);
        clearInterval(this.collisionBottle);
    }

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

    checkTimeBetweenThrows() {
        let timePassed = new Date().getTime() - this.time;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    checkEnemieCollisionsWithBottles() {
        this.level.enemies.forEach((enemy) => {
            if (this.throwableObjects.length > 0 && this.throwableObjects[0].isColliding(enemy) && enemy.energy > 0) {
                enemy.energy -= 100;
                this.resetThrowableObjects();

                if (enemy instanceof Endboss) {
                    enemy.lastHit = new Date().getTime();
                    this.statusBarHealthEndboss.setPercentage('HEALTH_ENDBOSS', enemy.energy / 8)
                }
            } else if (this.throwableObjects.length > 0 && this.throwableObjects[0].y > 360) {
                this.resetThrowableObjects();
            }
        })
    }

    checkCollisions() {
        this.checkCollisionWithEnemies();
        this.checkCollisionWithCoins();
        this.checkCollisionsWithBottles();
        this.drawRestCollectables();
    }

    checkCollisionWithEnemies() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) && this.character.speedY < 0 && enemy.energy > 0) {
                enemy.energy -= 100;
            } else if (this.character.isColliding(enemy) && enemy.energy > 0 && !this.character.startJumping) {
                if (!this.character.isHurt(0.2)) {
                    this.character.hit();
                    this.statusBarHealth.setPercentage('HEALTH', this.character.energy);
                }
            }
        });
    }

    checkCollisionWithCoins() {
        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.takedCoins += 5.3;
                this.statusBarCoin.setPercentage('COIN', this.takedCoins);
                coin.isCollected = true;
            }
        });
    }

    checkCollisionsWithBottles() {
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.lootedBottle += 17;
                this.statusBarBottle.setPercentage('BOTTLE', this.lootedBottle);
                bottle.isCollected = true;
            }
        });
    }

    drawRestCollectables() {
        this.level.coins = this.level.coins.filter(c => !c.isCollected);
        this.level.bottles = this.level.bottles.filter(b => !b.isCollected);
    }

    resetThrowableObjects() {
        this.throwableObjects[0].energy = 0;
        setTimeout(() => {
            this.throwableObjects = [];
        }, 180);
    }

    draw() {
        if (!this.startBtnIsPressed) {
            this.showStartScreen();
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.translate(this.camera_x, 0);
            this.addObjectsToMap(this.level.backgroundObjects);
            this.addObjectsToMap(this.level.clouds);
            this.ctx.translate(-this.camera_x, 0);
            this.addToMap(this.statusBarHealth);
            this.addToMap(this.statusBarCoin);
            this.addToMap(this.statusBarBottle);
            this.showEndbossHealthbar();
            this.ctx.translate(this.camera_x, 0);
            this.addObjectsToMap(this.level.coins);
            this.addObjectsToMap(this.level.bottles);
            this.addObjectsToMap(this.level.enemies);
            this.addToMap(this.character);
            this.addObjectsToMap(this.throwableObjects);
            this.ctx.translate(-this.camera_x, 0);
            this.checkEndConditions();
        }
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        })
    }

    addObjectsToMap(array) {
        array.forEach(obj => {
            this.addToMap(obj);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    showStartScreen() {
        this.addToMap(this.startScreen);
    }

    showEndbossHealthbar() {
        let levelEndboss = this.level.enemies[this.level.enemies.length - 1];
        if (levelEndboss.x - this.character.x < 580 && levelEndboss.energy > 0) {
            this.addToMap(this.statusBarHealthEndboss);
        }
    }

    checkEndConditions() {
        if (this.checkCharacterDead()) {
            this.addToMap(this.endLostScreen);
            this.stopGame();
        } else if (this.checkEndbossDead()) {
            this.addToMap(this.endWinScreen);
            this.stopGame();
        }
    }

    checkCharacterDead() {
        return this.character.energy <= 0;
    }

    checkEndbossDead() {
        let levelEndboss = this.level.enemies[this.level.enemies.length - 1]
        return levelEndboss.energy == 0;
    }

    prepareForPlayAgain() {
        if (this.posFlankCounter == 0) {
            document.getElementById('start_btn').classList.remove('d_none');
            document.getElementById('start_btn').innerText = "Play again";
            document.getElementById('start_btn').onclick = () => {
                init();
            };
        }
        this.posFlankCounter++;
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}