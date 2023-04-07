import MovingDirection from "./MovingDirection.js";

export default class Pacman {
    constructor (x, y, titleSize, velocity, titleMap){
        this.x = x;
        this.y = y;
        this.titleSize = titleSize;
        this.velocity = velocity;
        this.titleMap = titleMap;


        this.currentMovingDirection = null;
        this.requestMovingDirection = null;

        this.animationTimerDefault = 10;
        this.animationTimer = null;

        this.pacmanRotation = this.Rotation.right;

        this.eatingSound = new Audio ("/pacman-assets/coin.mp3");

        this.powerDotActive = false;
        this.powerDotAboutToExpire = false;
        this.timers = [];

        this.madeFirstMove = false;

        document.addEventListener("keydown", this.#keyDown);

        this.#loadPacmanImages();
    }

    Rotation = {
        right: 0,
        down: 1,
        left: 2,
        up: 3,
    }

    draw(ctx, pause, ghosts){
        if (!pause){
            this.#move();
            this.#animate();            
        }

        this.#eatDot();
        this.#eatPowerDot();
        this.#eatGhost(ghosts);
        
        const size = this.titleSize/2;

        ctx.save();
        ctx.translate(this.x + size, this.y + size);
        ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
        ctx.drawImage (this.pacmanImages[this.pacmanImageIndex], - size, -size, this.titleSize, this.titleSize);

        ctx.restore();
    }

    #loadPacmanImages(){
        const pacmanImage1 = new Image();
        pacmanImage1.src = "/pacman-assets/Pacman-1.png"

        const pacmanImage2 = new Image();
        pacmanImage2.src = "/pacman-assets/Pacman-2.png"
        
        const pacmanImage3 = new Image();
        pacmanImage3.src = "/pacman-assets/Pacman-3.png"

        this.pacmanImages = [pacmanImage1, pacmanImage2, pacmanImage3, pacmanImage2];

    this.pacmanImageIndex = 0;
    }

    #keyDown = (event)=>{
        //up
        if(event.keyCode == 38){
            if(this.currentMovingDirection == MovingDirection.down)
                this.currentMovingDirection == MovingDirection.up;
            this.requestMovingDirection = MovingDirection.up;
            this.madeFirstMove = true;
        }
        //down
        if(event.keyCode == 40){
            if(this.currentMovingDirection == MovingDirection.up)
                this.currentMovingDirection == MovingDirection.down;
            this.requestMovingDirection = MovingDirection.down;
            this.madeFirstMove = true;
        }
        //left
        if(event.keyCode == 37){
            if(this.currentMovingDirection == MovingDirection.right)
                this.currentMovingDirection == MovingDirection.left;
            this.requestMovingDirection = MovingDirection.left;
            this.madeFirstMove = true;
        }
        //right
        if(event.keyCode == 39){
            if(this.currentMovingDirection == MovingDirection.left)
                this.currentMovingDirection == MovingDirection.right;
            this.requestMovingDirection = MovingDirection.right;
            this.madeFirstMove = true;
        }
    };

    #move(){
       if(this.currentMovingDirection !== this.requestMovingDirection){
        if(
            Number.isInteger(this.x / this.titleSize) && 
            Number.isInteger(this.y / this.titleSize)
        ) {
            if(!this.titleMap.didCollideWithEnviroment(
                this.x,
                this.y,
                this.requestMovingDirection
                )
            )
                this.currentMovingDirection = this.requestMovingDirection;
        }
       }
       if (
        this.titleMap.didCollideWithEnviroment(
            this.x, 
            this.y, 
            this.currentMovingDirection
            )
        ){
            this.animationTimer = null;
            this.pacmanImageIndex = 0;
        return;
       }
       else if (this.currentMovingDirection !=null && this.animationTimer == null){
            this.animationTimer = this.animationTimerDefault;
       }
       switch(this.currentMovingDirection){
            case MovingDirection.up:
            this.y -=this.velocity;
            this.pacmanRotation = this.Rotation.up;
            break;

            case MovingDirection.down:
                this.y +=this.velocity;
                this.pacmanRotation = this.Rotation.down;
            break;

            case MovingDirection.left:
            this.x -=this.velocity;
            this.pacmanRotation = this.Rotation.left;
            break;

            case MovingDirection.right:
                this.x +=this.velocity;
                this.pacmanRotation = this.Rotation.right;
            break;            
       }
    }
    
    #animate(){
        if(this.animationTimer == null){
            return;
        }
        this.animationTimer--;
        if(this.animationTimer == 0){
            this.animationTimer = this.animationTimerDefault;
            this.pacmanImageIndex++;
            if(this.pacmanImageIndex == this.pacmanImages.length)
                this.pacmanImageIndex = 0;
        }
    }

    #eatDot(){
        if (this.titleMap.eatDot(this.x, this.y) && this.madeFirstMove){
            //this.eatingSound.play();
        }
    }
    #eatPowerDot(){
        if(this.titleMap.eatPowerDot(this.x, this.y)){
            this.powerDotActive = true;
            this.powerDotAboutToExpire = false;
            this.timers.forEach((timer) => clearTimeout(timer));
            this.timers = [];

            let powerDotTimer = setTimeout(()=>{
                this.powerDotActive = false;
                this.powerDotAboutToExpire = false;
            },1000*6);

            this.timers.push(powerDotTimer);
            
            let powerDotAboutToExpireTimer = setTimeout(() => {
                this.powerDotAboutToExpire = true;
            },1000*3);

            this.timers.push(powerDotAboutToExpireTimer);
        }
    }

    #eatGhost(ghosts){
        if(this.powerDotActive){
            const CollideWithGhosts = ghosts.filter((ghost) => ghost.collideWith(this));
            CollideWithGhosts.forEach((ghost)=>{ghosts.splice (ghosts.indexOf(ghost),1);
                this.eatingSound.play();
            });    
        }
    }
}

