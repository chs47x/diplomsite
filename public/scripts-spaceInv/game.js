import BulletController from "./bulletController.js";
import EnemyController from "./enemyController.js";
import Player from "./player.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


const velocity = 4;

let timeSpcInv = 0;

const playerBulletController = new BulletController(canvas, 10, "red", true);
const enemyBulletController = new BulletController(canvas, 5, "cyan", false);
const enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController);
const player = new Player(canvas, velocity, playerBulletController);

let isGameOver = false;
let didWin = false;

let timerIntervalId = setInterval(() => {
    if (!isGameOver && !didWin) {
        timeSpcInv++;
    }
}, 1000);

function game(){
    checkGameOver();
    ctx.clearRect(0,0, canvas.width, canvas.height);
    dispayGameOver();
    if (!isGameOver){
        enemyController.draw(ctx);
        player.draw(ctx);
        playerBulletController.draw(ctx);
        enemyBulletController.draw(ctx) 
    }
    drawTime();
} 

function dispayGameOver(){
    if(isGameOver){
        let text = didWin ? "you win" : "Game Over";
        let textOffset = didWin ? 3.5 : 5;
        ctx.fillStyle ="white";
        ctx.font = "70px Arial";
        ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
    }
}

function checkGameOver(){
    if (isGameOver){
        return
    }
    if(enemyBulletController.collideWith(player)){
        isGameOver = true;
    }
    if (enemyController.collideWith(player)){
        isGameOver = true;
    }
    if(enemyController.enemyRows.length === 0){
        didWin =true;
        isGameOver = true;
        clearInterval(timerIntervalId);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/save-timeSpcInv', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                console.log(xhr.responseText);
            }
        };
        xhr.send(`timeSpcInv=${timeSpcInv}`);
    }
}
function drawTime(){
    ctx.font = "16px arial";
    ctx.fillStyle ="#fff"
    ctx.fillText ("Время: " +timeSpcInv + " сек", 8, 20);
}
setInterval(game, 1000/60);