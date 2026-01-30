class MovableObject extends DrawableObject {

    groundY;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 5; //defaul 2.5
    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };
    isCollected = false;
    energy = 100;
    lastHit = 0;
    dead = false;
    startJumping = false;
    gotToLongIdle = false;
    jumpImageCounter = 0;
    effectCounter = 0;
    lastEffectTime = Date.now();
    effectInterval = 150;
    enableMovement = true;
    lastMove = new Date().getTime();

    applyGravity(groundY) {
        setInterval(() => {
            if (this.isAboveGround(groundY) || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.speedY = 0;
                this.effectImage = 0;
            }
        }, 1000 / 25)
    }

    isAboveGround(groundY) {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < groundY;
        }
    }

    isColliding(mo) {
        return this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
            this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom;
    }

    hit() {
        this.energy -= 10;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt(time) {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < time;
    }

    isDead() {
        return this.energy == 0;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    setMovementTime() {
        this.lastMove = new Date().getTime();
        this.gotToLongIdle = false;
        this.idleCounter = 0;
        this.effectCounter = 0;
    }

    checkLastMovement() {
        let now = new Date().getTime();
        let timePassed = now - this.lastMove;
        return timePassed / 1000 > 2;
    }

    playAnimationOnce(images, mode = "action") {
        let now = Date.now();
        if (now - this.lastEffectTime < this.effectInterval) return;
        this.lastEffectTime = now;
        if (mode === "jump") {
            this.animateJumping(images);
            return;
        } else if (mode === "idle") {
            this.animateEffect(images, mode);
        } else if (mode === "action") {
            this.animateEffect(images, mode)
        }
    }

    animateJumping(images) {

        if (this.jumpImageCounter == images.length && !this.isAboveGround(this.groundY)) {
            this.startJumping = false;
            this.jumpImageCounter = 0;
            return;
        }
        if (this.jumpImageCounter < images.length) {
            if (this.jumpImageCounter == 3) {
                this.jump();
            }
            let i = this.jumpImageCounter;
            let path = images[i];
            this.img = this.imageCache[path];
            this.jumpImageCounter++;
        }
    }


    animateEffect(images, mode) {
        if (this.effectCounter == images.length - 1) {
            if (mode === "idle") {
                this.gotToLongIdle = true;
            }
            this.effectCounter = 0;
            return;
        }
        if (this.effectCounter < (images.length - 1)) {
            let i = this.effectCounter;
            let path = images[i];
            this.img = this.imageCache[path];
            this.effectCounter++;
        }
    }

    startMovementRight() {
        this.moveRight();
        this.setMovementTime();
        this.otherDirection = false;
    }

    startMovementLeft() {
        this.moveLeft();
        this.setMovementTime();
        this.otherDirection = true;
    }

    setJumpingVariables() {
        this.startJumping = true;
        this.enableMovement = false;
        setTimeout(() => {
            this.enableMovement = true;
        }, 450);
    }

    jump() {
        this.speedY = 35;
        if (!this.world.isMuted) {
            this.jumpAudio.play();
        }

    }
}