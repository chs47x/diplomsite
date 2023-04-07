import Pacman from "./Pacman.js";
import MovingDirection from "./MovingDirection.js";
import Ghost from "./ghosts.js";
export default class TitleMap{

    constructor(titleSize){
        this.titleSize = titleSize;

        this.yellowDot = new Image();
        this.yellowDot.src = "/pacman-assets/YellowDot.png";

        this.pinkDot = new Image();
        this.pinkDot.src = "/pacman-assets/PinkDot.png";

        this.wall = new Image();
        this.wall.src = "/pacman-assets/brick.png";
        
        this.powerDot = this.pinkDot;
        this.powerDotAnimationTimerDefault = 30;
        this.powerDotAnimationTimer =this.powerDotAnimationTimerDefault;

    }

    //1 - wall
    //0 - dot
    //4 - pacman
    //5 - empty
    //6 - ghost
    //7 - power dot

    map =[
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 7, 0, 0, 4, 0, 0, 0, 0, 0, 0, 7, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 7, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 6, 0, 0, 0, 1, 1, 0, 1],
        [1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 7, 1, 1, 1, 1, 0, 1],
        [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    draw(ctx){
        for(let i = 0; i < this.map.length; i++){
            for (let j =0; j < this.map[i].length; j++){
                let title = this.map[i][j];
                if (title === 1){
                    this.#drawWall(ctx, j, i, this.titleSize);
                }
                else if (title === 0){
                    this.#drawDot(ctx, j, i, this.titleSize);
                }
                else if(title == 7){
                    this.#drawPowerDot(ctx, j, i,this.titleSize);
                }
                else {
                    this.#drawBlank(ctx,j, i, this.titleSize);
                }
            }
        }

    }


    #drawDot(ctx, j, i, size){
        ctx.drawImage(this.yellowDot, j * this.titleSize, i * this.titleSize, size, size)
    }
    
    #drawPowerDot(ctx, j, i,size){
        this.powerDotAnimationTimer--;
        if(this.powerDotAnimationTimer === 0){
            this.powerDotAnimationTimer =this.powerDotAnimationTimerDefault;
            if(this.powerDot == this.pinkDot){
                this.powerDot =this.yellowDot;
            }else{
                this.powerDot = this.pinkDot;
            }
        }
        ctx.drawImage(this.powerDot, j * size, i * size, size, size);
    }

    #drawWall(ctx, j, i, size){
        ctx.drawImage(this.wall, j * this.titleSize, i * this.titleSize, size, size);
    } 

    #drawBlank(ctx, j, i, size){
        ctx.fillStyle = "black"
        ctx.fillRect(j * this.titleSize, i * this.titleSize,size,size)
    }

    getPacman(velocity){
        for(let i = 0; i < this.map.length; i++){
            for (let j =0; j < this.map[i].length; j++){
                let title = this.map[i][j];
                if (title === 4){
                    this.map[i][j] = 0;
                    return new Pacman(
                        j * this.titleSize, 
                        i *this.titleSize, 
                        this.titleSize, 
                        velocity, 
                        this
                    );
                }
            }
        }
    }

    getGhosts(velocity){
        const ghosts = [];
        for(let i = 0; i < this.map.length; i++){
            for (let j = 0; j < this.map[i].length; j++){
                const title = this.map[i][j];
                if(title == 6){
                    this.map[i][j] = 0;
                    switch (ghosts.length){
                        case 0:
                            ghosts.push(new Ghost(j * this.titleSize, i * this.titleSize, this.titleSize, velocity, this,"pink"));
                            break;
                        case 1:
                            ghosts.push(new Ghost(j * this.titleSize, i * this.titleSize, this.titleSize, velocity, this,"orange"));
                            break; 
                        case 2:
                            ghosts.push(new Ghost(j * this.titleSize, i * this.titleSize, this.titleSize, velocity, this,"red"));
                            break;    
                        default:
                            ghosts.push(new Ghost(j * this.titleSize, i * this.titleSize, this.titleSize, velocity, this,"red"));
                            break;                
                    }
                }
            }
        }
        return ghosts;
    }

    setCanvasSize(canvas){
        canvas.width = this.map[0].length * this.titleSize;
        canvas.height = this.map.length * this.titleSize;
   }

   didCollideWithEnviroment(x,y, direction){
    if(direction == null){
        return;
    }

    if (
        Number.isInteger(x/this.titleSize) && 
        Number.isInteger(y/this.titleSize)
    ){
        let column = 0;
        let row = 0;
        let nextcolumn = 0;
        let nextrow = 0;

        switch(direction){
            case MovingDirection.right:
                nextcolumn = x + this.titleSize;
                column = nextcolumn /this.titleSize;
                row = y / this.titleSize;
                break;
            case MovingDirection.left:
                nextcolumn = x - this.titleSize;
                column = nextcolumn /this.titleSize;
                row = y / this.titleSize;
                break;
            case MovingDirection.up:
                nextrow = y - this.titleSize;
                row = nextrow /this.titleSize;
                column = x / this.titleSize;
                break;
            case MovingDirection.down:
                nextrow = y + this.titleSize;
                row = nextrow /this.titleSize;
                column = x / this.titleSize;
                break; 
        }
        const title = this.map[row][column];
        if (title === 1){
            return true;
        }
    }
    return false;
   }
   didWin(){
    return this.#dotsLeft () === 0;
   }

   #dotsLeft(){
    return this.map.flat().filter((title) => title === 0).length;
   }

   eatDot(x, y){
    const row = y / this.titleSize;
    const column = x / this.titleSize;
    if(Number.isInteger(row) && Number.isInteger(column)){
        if (this.map[row][column] === 0){
            this.map[row][column] = 5;
            return true;
        }
    }
    return false;
   }

   eatPowerDot(x,y){
    const row = y/this.titleSize;
    const column = x/this.titleSize;
    if(Number.isInteger(row) && Number.isInteger(column)){
        const title = this.map[row][column];
        if(title === 7){
            this.map[row][column] = 5;
            return true;
        }
    }
    return false
   }
}