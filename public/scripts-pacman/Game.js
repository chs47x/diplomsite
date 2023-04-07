import TitleMap from "./Map.js";


const titleSize = 32;
const velocity = 2;
let time = 0;
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const titleMap = new TitleMap(titleSize);
const pacman = titleMap.getPacman(velocity);
const ghosts = titleMap.getGhosts(velocity);

let GameOver = false;
let GameWin = false;
const GameOverSound = new Audio("");
const GameWinSound = new Audio ("");

let timerIntervalId = setInterval(() => {
    if(pacman.madeFirstMove){
        if (!GameOver && !GameWin) {
            time++;
        }
    }
}, 1000);

function gameLoop(){
    titleMap.draw(ctx);
    pacman.draw(ctx, pause(), ghosts);
    ghosts.forEach((ghost)=>ghost.draw(ctx,pause(), pacman));
    drawGameEnd();
    checkGameOver();
    checkGameWin();
    drawTime();
}

function checkGameOver(){
    if(!GameOver){
        GameOver = isGameOver();
        if(GameOver){
            GameOverSound.play();
            clearInterval(timerIntervalId);
        }
    }
}

function checkGameWin() {
    if(!GameWin){
        GameWin = titleMap.didWin();
        if (GameWin){
            GameWinSound.play();
            clearInterval(timerIntervalId);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/save-time', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    console.log(xhr.responseText);
                }
            };
            xhr.send(`time=${time}`);
        }
    }
}

function isGameOver(){
    return ghosts.some(ghost => !pacman.powerDotActive && ghost.collideWith(pacman));
}


function pause(){
    return !pacman.madeFirstMove || GameOver || GameWin;
}

function drawGameEnd(){
    if (GameOver || GameWin){
        let text = " You win";
        if (GameOver){
            text = " Game Over"
        }
        ctx.fillStyle = 'black';
        ctx.globalAlpha = 0.75;
        ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

        ctx.globalAlpha = 1;
        ctx.fillStyle = 'white';
        ctx.font = '60px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    }
}

function drawTime(){
    ctx.font = "16px arial";
    ctx.fillStyle ="#fff"
    ctx.fillText ("Время: " +time + " сек", 8, 20);
}
titleMap.setCanvasSize(canvas);
setInterval(gameLoop,1000/75);

