var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2;

let ballRadius = 10;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 5;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let brkScore = 0;


let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

function drawScore(){
    ctx.font = "16px arial";
    ctx.fillStyle ="#fff"
    ctx.fillText ("Счет: " +brkScore, 8, 20);
}

// отрисовка мяча
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}
// отрисовка ракетки
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
// отрисовка блоков
function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.fillStyle = "#a11106";
                if(c>=1 && c<3) {
                    ctx.fillStyle = "#b36200";
                } else if(c>=3 && c<4) {
                    ctx.fillStyle = "#c9a008";
                } else if(c>=4 && c<5) {
                    ctx.fillStyle = "#0ea603";
                }
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
                ctx.closePath();
            }
        }
    }
}
function resetBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
}

function collisionDetection() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    brkScore++;
                    if(score == brickRowCount * brickColumnCount){
                        return true;
                    }
                }
            }
        }
    }
}

//перемещение ракетки
document.body.addEventListener("keydown", keyDownHandler, false);
document.body.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    //right
    if(e.keyCode == 39){
        rightPressed = true;
    }
    //left
    if(e.keyCode == 37){
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    //right
    if(e.keyCode == 39){
        rightPressed = false;
    }
    //left
    if(e.keyCode == 37){
        leftPressed = false;
    }
}

//отрисока игры
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();

    if (x + dx < ballRadius || x + dx > canvas.width-ballRadius){
        dx = -dx;
    }
    
    if (y + dy < ballRadius ){
        dy = -dy;
    }else if(y + dy > canvas.height-ballRadius){
        if( x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        }
        else {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/save-brkScore', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    console.log(xhr.responseText);
                }
            };
            xhr.send(`brkScore=${brkScore}`);
            alert("Game Over");
            document.location.reload();
            clearInterval(interval);
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX +=7;
    }
    if (leftPressed && paddleX > 0){
        paddleX -=7;
    }
    x += dx;
    y += dy;
    if (collisionDetection()) {
        resetBricks();
        score = 0;
    }
}
let interval = setInterval(draw,  10);