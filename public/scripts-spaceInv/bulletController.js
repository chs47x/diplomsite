import Bullet from "./bullet.js";

export default class BulletController {
    bullets = [];
    timeToNextBullet = 0;
    constructor (canvas, maxBulletAtTime, bulletColor, soundEnabled){
       
        this.canvas = canvas;
        this.maxBulletAtTime = maxBulletAtTime;
        this.bulletColor = bulletColor;
        this.soundEnabled = soundEnabled;

        this.shootSound = new Audio();
        this.shootSound.src = "";

    
    }
    draw(ctx){
        this.bullets = this.bullets.filter(bullet => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height);
        this.bullets.forEach(bullet => bullet.draw(ctx));
        if (this.timeToNextBullet > 0){
            this.timeToNextBullet--;
        }
    }

    collideWith(sprite){
        const bulletHitSprite =this.bullets.findIndex(bullet => bullet.collideWith(sprite));
        if (bulletHitSprite >=0){
            this.bullets.splice(bulletHitSprite, 1);
            return true;
        }
        return false;
    }

    shoot(x, y, velocity, timeToNextBullet = 0){
        if (this.timeToNextBullet <=0 && this.bullets.length < this.maxBulletAtTime){
            const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
            this.bullets.push(bullet);
            this.timeToNextBullet = timeToNextBullet;
        }
    }
}