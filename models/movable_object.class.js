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
        this.energy -= 1;
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

    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
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
        } else if(mode === "idle") {
            this.animateEffect(images, mode);
        } else if (mode === "action") {
            this.animateEffect(images, mode)
        }

    }

    animateJumping(images) {
        if (this.jumpImageCounter < (images.length - 1)) {
                if (this.jumpImageCounter == 3) {
                    this.jump();
                }
                let i = this.jumpImageCounter;
                let path = images[i];
                this.img = this.imageCache[path];
                this.jumpImageCounter++;
            }
            if (this.jumpImageCounter == 8 && !this.isAboveGround(this.groundY)) {
                this.jumpImageCounter = 0;
                this.startJumping = false;
            }
    }

    animateEffect(images, mode){
        if (this.effectCounter < (images.length - 1)) {
                let i = this.effectCounter;
                let path = images[i];
                this.img = this.imageCache[path];
                this.effectCounter++;
            }
            if (this.effectCounter == (images.length - 1)) {
                if (mode === "idle") {
                    this.gotToLongIdle = true;
                }
                this.effectCounter = 0;
            }
    }


    jump() {
        this.speedY = 35;
        this.jumpAudio.play();
    }
}