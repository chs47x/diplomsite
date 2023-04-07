import MovingDirection from "./MovingDirection.js";

export default class Ghost{

    constructor(x,y,titleSize,velocity, titleMap, type){
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.titleSize = titleSize;
        this.titleMap = titleMap;

        this.type = type;

        this.#loadImages();
        this.movingDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length);

        this.directionTimerDefault = this.#random(10,50);
        this.directionTimer = this.directionTimerDefault;

        this.scaredAboutToExpireTimerDefault = 10;
        this.scaredAboutToExpireTimer =this.scaredAboutToExpireTimerDefault;
    }

    draw(ctx, pause, pacman){
        if(!pause){
            this.#move();
            this.#changeDirection();
        }
        this.#setImage(ctx, pacman);
    
    }

    collideWith(pacman){
        const size = this.titleSize/2;
        if(
            this.x < pacman.x + size &&
            this.x + size > pacman.x &&
            this.y < pacman.y + size &&
            this.y + size > pacman.y
          ){
            return true;
          }
          else{
            return false;
          }
    }

    #setImage(ctx, pacman){
        if(pacman.powerDotActive){
            this.#setImageWhenPowerDotIsActive(pacman);
        }else if (this.type === "red") {
                this.normalGhost = this.normalRedGhost;
            } else if (this.type === "orange") {
                this.normalGhost = this.normalOrangeGhost;
            } else if (this.type === "pink") {
                this.normalGhost = this.normalPinkGhost;
            }
        ctx.drawImage(this.normalGhost,this.x,this.y,this.titleSize,this.titleSize);
    }

    #setImageWhenPowerDotIsActive(pacman){
        if(pacman.powerDotAboutToExpire) {
            this.scaredAboutToExpireTimer--;
            if(this.scaredAboutToExpireTimer === 0){
                this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
                if (this.normalGhost === this.scaredGhost){
                    this.normalGhost = this.scaredGhost2;
                }else{
                    this.normalGhost = this.scaredGhost;
                }
            }
        }
        else{
            this.normalGhost =this.scaredGhost;
        }
    }

    #changeDirection(){
        this.directionTimer--;
        let newMoveDirection = null;
        if (this.directionTimer ==0){
            this.directionTimer = this.directionTimerDefault;
            newMoveDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length);
        }

        if(newMoveDirection != null && this.movingDirection != newMoveDirection){
            if(Number.isInteger(this.x / this.titleSize) && Number.isInteger(this.y / this.titleSize)){
                if(!this.titleMap.didCollideWithEnviroment(this.x,this.y, newMoveDirection)){
                    this.movingDirection = newMoveDirection;
                }
            }
        }
    }

    #move(){
        if(!this.titleMap.didCollideWithEnviroment(this.x, this.y, this.movingDirection)){
            switch(this.movingDirection){
                case MovingDirection.up:
                    this.y -= this.velocity;
                    break;
                case MovingDirection.down:
                    this.y += this.velocity;
                    break
                case MovingDirection.left:
                    this.x -= this.velocity;
                    break;
                case MovingDirection.right:
                    this.x += this.velocity;
                    break;
            }
        }
    }
    
    #random (min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    #loadImages(){
        this.normalRedGhost = new Image();
        this.normalRedGhost.src = "/pacman-assets/redGhost.png";

        this.scaredGhost = new Image();
        this.scaredGhost.src = "/pacman-assets/scaredGhost.png";

        this.normalOrangeGhost = new Image();
        this.normalOrangeGhost.src = "/pacman-assets/orangeGhost.png";
    
        this.normalPinkGhost = new Image();
        this.normalPinkGhost.src = "/pacman-assets/pinkGhost.png";

        this.scaredGhost2 = new Image();
        this.scaredGhost2.src = "/pacman-assets/scaredGhost2.png";
        this.normalGhost = undefined;
    }
}
