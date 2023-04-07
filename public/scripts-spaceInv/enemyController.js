import Enemy from "./enemy.js";
import MovingDirection from "./MovingDirection.js";

export default class EnemyController{
    enemyMap = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 3, 3, 3, 1, 1],
        [2, 2, 3, 3, 3, 2, 2],
        [2, 2, 2, 2, 2, 2, 2],

    ];
    enemyRows =[];

    currentDirection = MovingDirection.right;

    xVelocity = 0;
    yVelocity = 0;
    defaultXVelocity = 1;
    defaultYVelocity = 1;
    moveDownTimerDefault = 20;
    moveDownTimer = this.moveDownTimerDefault;
    
    fireBulletTimerDefeault = 50;
    fireBulletTimer = this.fireBulletTimerDefeault;

    constructor(canvas, enemyBulletController, playerBulletController) {
        this.canvas = canvas;
        this.enemyBulletController = enemyBulletController;
        this.playerBulletController = playerBulletController;
        this.createEnemies();
    }

    draw(ctx){
        this.decrementMoveDownTimer();
        this.updateVeloity();
        this.collisionDetection();
        this.drawEnemies(ctx);
        this.resetMoveDownTimer();
        this.fireBullet();
    }

    collisionDetection(){
        this.enemyRows.forEach(enemyRow =>{
            enemyRow.forEach((enemy,enemyIndex)=>{
                if(this.playerBulletController.collideWith(enemy)){
                    enemyRow.splice(enemyIndex, 1);
                    this.defaultXVelocity +=0.02;
                    this.defaultYVelocity +=0.02;
                }
            });
        });

        this.enemyRows = this.enemyRows.filter(enemyRow => enemyRow.length > 0);
    }

    fireBullet(){
        this.fireBulletTimer--;
        if(this.fireBulletTimer <=0){
            this.fireBulletTimer = this.fireBulletTimerDefeault;
            const allEnemies = this.enemyRows.flat();
            const enemyIndex = Math.floor(Math.random() * allEnemies.length);
            const enemy = allEnemies[enemyIndex];
            this.enemyBulletController.shoot(enemy.x + enemy.width/2, enemy.y, -3);
        }
    }

    resetMoveDownTimer(){
        if (this.moveDownTimer <= 0){
            this.moveDownTimer = this.moveDownTimerDefault;
        }
    }

    collideWith(player){

    }

    decrementMoveDownTimer(){
        if(
            this.currentDirection === MovingDirection.downLeft || 
            this.currentDirection === MovingDirection.DownRight){
                this.moveDownTimer--;
        }
    }

    updateVeloity(){
        for(const enemyRow of this.enemyRows){
            if (this.currentDirection == MovingDirection.right){
                this.xVelocity = this.defaultXVelocity;
                this.yVelocity = 0;
                const rightMostEnemy = enemyRow[enemyRow.length - 1];
                if(rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width){
                    this.currentDirection = MovingDirection.downLeft;
                    break;
                }
            }
            else if(this.currentDirection === MovingDirection.downLeft){
                if(this.moveDown(MovingDirection.left)){
                    break;
                }
            }else if (this.currentDirection === MovingDirection.left){
                this.xVelocity = -this.defaultXVelocity;
                this.yVelocity = 0;
                const leftMostEnemy = enemyRow[0];
                if(leftMostEnemy.x <= 0){
                    this.currentDirection = MovingDirection.DownRight;
                    break;
                }
            }else if (this.currentDirection === MovingDirection.DownRight){
                if(this.moveDown(MovingDirection.right)){
                    break;
                }
            }
        }
    }

    moveDown(neDirection){
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        if( this.moveDownTimer <= 0){
            this.currentDirection = neDirection;
            return true;
        }
        return false;
    }

    drawEnemies(ctx){
        this.enemyRows.flat().forEach((enemy)=>{
            enemy.move(this.xVelocity, this.yVelocity);
            enemy.draw(ctx);
        })
    }

    createEnemies(){
        this.enemyMap.forEach((row,rowIndex)=>{
            this.enemyRows[rowIndex] = [];
            row.forEach((enemyNumber, enemyIndex)=>{
                if(enemyNumber > 0){
                    this.enemyRows[rowIndex].push(new Enemy(enemyIndex* 50, rowIndex * 35, enemyNumber));
                }
            });
        });
    }

    collideWith(sprite){
        return this.enemyRows.flat().some(enemy=>enemy.collideWith(sprite))
    }

}