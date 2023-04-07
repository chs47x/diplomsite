const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');

//increase snake size 
class snakePart{
constructor(x, y){
    this.x=x;
    this.y=y;
    }
}

let speed=7;
let tileCount=20; 

let tileSize=canvas.clientWidth/tileCount-2;
let headX=10;
let headY=10;

const snakeParts=[];
let tailLength=1;

let xvelocity=0;
let yvelocity=0;

let appleX=5;
let appleY=5;

let score=0;

let inputsXvelocity = 0;
let inputsYvelocity = 0;

let previousXvelocity = 0;
let previousYvelocity = 0;


let img = new Image();
img.src = "/apple.png";

// create game loop-to continously update screen
function drawGame(){
    xvelocity = inputsXvelocity;
    yvelocity = inputsYvelocity;

    if(previousXvelocity === 1 && xvelocity === -1){
        xvelocity = previousXvelocity;
    }

    if(previousXvelocity === -1 && xvelocity === 1){
        xvelocity = previousXvelocity;
    }

    if(previousYvelocity === -1 && yvelocity === 1){
        yvelocity = previousYvelocity;
    }

    if(previousYvelocity === 1 && yvelocity === -1){
        yvelocity = previousYvelocity;
    }
    

    previousXvelocity = xvelocity;   
    previousYvelocity = yvelocity; 

    changeSnakePosition();
    let result=isGameOver();
    if(result){
        return;
    }
    
    clearScreen();
    drawSnake();
    drawApple();
  
    checkCollision()
    drawScore();
    setTimeout(drawGame, 1000/speed);
}
//Game Over function
function isGameOver(){
    let gameOver=false; 
    //check whether game has started
    if(yvelocity===0 && xvelocity===0){
        return false;
    }
    if(headX<0){
        headX = tileCount;
    }
    else if(headX===tileCount){//if snake hits right wall
        headX = 0;
    }
    else if(headY<0){//if snake hits wall at the top
        headY = tileCount;
    }
    else if(headY===tileCount){//if snake hits wall at the bottom
        headY = 0;
    }

    //stop game when snake crush to its own body

    for(let i=0; i<snakeParts.length;i++){
        let part=snakeParts[i];
        if(part.x===headX && part.y===headY){
            gameOver=true;
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/save-score', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    console.log(xhr.responseText);
                }
            };
            xhr.send(`score=${score}`);
            break;
        }
    }
    

    //display text Game Over
    if(gameOver){
        ctx.fillStyle="white";
        ctx.font="50px verdana";
        ctx.fillText("Game Over! ", canvas.clientWidth/6.5, canvas.clientHeight/2);
    }
    return gameOver;
}

// score function
function drawScore(){
    ctx.fillStyle="white";
    ctx.font="15px verdena";
    ctx.fillText("Score: " +score, canvas.clientWidth-70,20);
}
// clear our screen
 function clearScreen(){

ctx.fillStyle= 'black';
ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);

 }
 function drawSnake(){
    
    ctx.fillStyle="green";
    //loop through our snakeparts array
    for(let i=0;i<snakeParts.length;i++){
        let part=snakeParts[i]
         ctx.fillRect(part.x *tileCount, part.y *tileCount, tileSize,tileSize)
    }
    snakeParts.push(new snakePart(headX,headY));//put item at the end of list next to the head
    if(snakeParts.length>tailLength){
        snakeParts.shift();//remove furthest item from  snake part if we have more than our tail size

    }
    ctx.fillStyle="orange";
    ctx.fillRect(headX* tileCount,headY* tileCount, tileSize,tileSize)


 }
 function drawApple(){
    ctx.fillStyle="red";
    ctx.drawImage(img, appleX*tileCount -10, appleY*tileCount-11, 35, 35);
 }
 function changeSnakePosition(){
     headX=headX + xvelocity;
     headY=headY + yvelocity;
     
 }
 // check for collision and change apple position
 function checkCollision(){
     if(appleX==headX && appleY==headY){
         appleX=Math.floor(Math.random()*tileCount);
         appleY=Math.floor(Math.random()*tileCount);
         tailLength++;
         score++;
         speed+=0.2;
     }
 }
 //add event listener to our body
 document.body.addEventListener('keydown', keyDown);

function keyDown(event)

{
    //up
    if(event.keyCode==38){
        inputsYvelocity=-1;
        inputsXvelocity=0;
        
    }
    //down
    if(event.keyCode==40){
        inputsYvelocity=1;
        inputsXvelocity=0;
    }

    //left
    if(event.keyCode==37){
        inputsYvelocity=0;
        inputsXvelocity=-1;
    }
    //right
    if(event.keyCode==39){
        inputsYvelocity=0;
        inputsXvelocity=1;
    }
}
drawGame(); 
