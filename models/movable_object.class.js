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

    isFallingOn(enemy) {
        let charBottom = this.y + this.height - this.offset.bottom;
        let enemyTop = enemy.y + enemy.offset.top;

        return (
            this.speedY > 0 &&                 // fällt nach unten
            charBottom <= enemyTop + 20         // kleine Toleranz       
        );
    }


    // character.isColliding(chicken);
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

    playOneWayAnimation(images) {
        if (this.effectImage < images.length - 1) {
            let i = this.effectImage;
            let path = images[i];
            this.img = this.imageCache[path];
            this.effectImage++;
        } else {
            let i = images.length - 1;
            let path = images[i];
            this.img = this.imageCache[path];
        }

    }


    jump() {
        this.speedY = 35;
    }
}