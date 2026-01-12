class World {
    character = new Character();

    level = level1;
    endscreen = new Endscreen();
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


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies[this.level.enemies.length-1].world = this; 
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
        }, 1000 / 60);
        setInterval(() => {
            this.checkThrowObjects();
        }, 200);
        setInterval(() => {
            this.checkCollisionsWithBottles();
        }, 100);
    }

    checkThrowObjects() {
        if (this.keyboard.G && this.lootedBottle > 0) {
            let bottle = new ThrowableObject(this.character.x + this.character.width - 50, this.character.y + (this.character.height / 2) - 30);
            this.lootedBottle -= 20;
            this.statusBarBottle.setPercentage('BOTTLE', this.lootedBottle);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisionsWithBottles() {
        this.level.enemies.forEach((enemy) => {
            if (this.throwableObjects.length > 0 && this.throwableObjects[0].isColliding(enemy) && enemy.energy > 0) {
                this.throwableObjects[0].energy = 0;
                this.resetThrowableObjects();
                enemy.energy -= 100;
                console.log(enemy.energy);
                if (enemy instanceof Endboss) {
                    enemy.lastHit = new Date().getTime();
                    this.statusBarHealthEndboss.setPercentage('HEALTH_ENDBOSS', enemy.energy/8 )
                }
            } else if (this.throwableObjects.length > 0 && this.throwableObjects[0].y > 360) {
                this.throwableObjects[0].energy = 0;
                this.resetThrowableObjects();
            }
        })
    }



    checkCollisions() {
        this.level.enemies.forEach((enemy) => {

            if (this.character.isColliding(enemy) && this.character.speedY < 0 && enemy.energy > 0) {
                enemy.energy -= 100;
                this.character.speedY = 10;
            } else if (this.character.isColliding(enemy) && enemy.energy > 0) {
                this.character.hit();
                this.statusBarHealth.setPercentage('HEALTH', this.character.energy);
            }


        }
        );
        this.level.coins.forEach((coin) => {
            if (this.character.isColliding(coin)) {
                this.takedCoins += 20;
                this.statusBarCoin.setPercentage('COIN', this.takedCoins);
                coin.isCollected = true;
            }
        });
        this.level.bottles.forEach((bottle) => {
            if (this.character.isColliding(bottle)) {
                this.lootedBottle += 20;
                this.statusBarBottle.setPercentage('BOTTLE', this.lootedBottle);
                bottle.isCollected = true;
            }
        });

        this.level.coins = this.level.coins.filter(c => !c.isCollected);
        this.level.bottles = this.level.bottles.filter(b => !b.isCollected);
        // this.throwableObjects = this.throwableObjects.filter(to => (to.energy == 100))
        // this.level.enemies = this.level.enemies.filter(e => !(e.y > 480));
    }

    resetThrowableObjects() {
        setTimeout(() => {
            this.throwableObjects = [];
        }, 180);
    }


    draw() {
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
        this.checkCharacterHealtBar();


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
        // mo.drawFrame(this.ctx);
        // mo.drawCollisionFrame(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    showEndbossHealthbar() {
        if(this.level.enemies[this.level.enemies.length-1].x -this.character.x  < 580) {
            this.addToMap(this.statusBarHealthEndboss);
        }
    }

    checkCharacterHealtBar() {
        if(this.character.energy <= 0) {
            this.addToMap(this.endscreen);
        }
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