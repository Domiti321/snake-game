const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const userNameElement = document.getElementById("userName");
const deathScreen = document.getElementById("deathScreen");
const finalScore = document.getElementById("finalScore");
const respawnBtn = document.getElementById("respawnBtn");
const menuBtn = document.getElementById("menuBtn");

let foodX, foodY;
let snakeX=5, snakeY=5;
let velocityX=0, velocityY=0;
let snakeBody=[];
let gameOver=false;
let setIntervalId;
let score=0;

const playerName = localStorage.getItem("snake-username")||"Player";
userNameElement.textContent = playerName;
let highScore = localStorage.getItem("high-score")||0;
highScoreElement.textContent=`High Score: ${highScore}`;

// save leaderboard + trigger live update, scor minim 1
function saveScoreToLeaderboard(name, score){
    if(score<1) return; // scor minim 1

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard"))||[];
    const idx = leaderboard.findIndex(e=>e.name===name);
    if(idx!==-1){if(score>leaderboard[idx].score) leaderboard[idx].score=score;}
    else leaderboard.push({name,score});
    leaderboard.sort((a,b)=>b.score-a.score);
    leaderboard = leaderboard.slice(0,10);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    window.dispatchEvent(new Event("leaderboardUpdated"));
}

// change food
const changeFoodPosition=()=>{foodX=Math.floor(Math.random()*30)+1;foodY=Math.floor(Math.random()*30)+1;};

// GAME OVER
const handleGameOver=()=>{
    gameOver=true;
    clearInterval(setIntervalId);
    saveScoreToLeaderboard(playerName,score);
    finalScore.textContent=score;
    deathScreen.classList.remove("hidden");
};
respawnBtn.onclick=()=>{location.reload();};
menuBtn.onclick=()=>{window.location.href="menu.html";};

// direction fix 180° + WASD
const changeDirection = (e) => {
    let key = e.key.toLowerCase();
    if(key==="w") key="arrowup";
    if(key==="s") key="arrowdown";
    if(key==="a") key="arrowleft";
    if(key==="d") key="arrowright";

    if(snakeBody.length>1){
        if(key==="arrowup" && velocityY===1) return;
        if(key==="arrowdown" && velocityY===-1) return;
        if(key==="arrowleft" && velocityX===1) return;
        if(key==="arrowright" && velocityX===-1) return;
    }

    if(key==="arrowup"){velocityX=0;velocityY=-1;}
    else if(key==="arrowdown"){velocityX=0;velocityY=1;}
    else if(key==="arrowleft"){velocityX=-1;velocityY=0;}
    else if(key==="arrowright"){velocityX=1;velocityY=0;}
};

// INIT GAME
const initGame=()=>{
    if(gameOver) return handleGameOver();
    let htmlMarkup=`<div class="food" style="grid-area:${foodY}/${foodX}"></div>`;

    if(snakeX===foodX && snakeY===foodY){
        changeFoodPosition();
        snakeBody.push([foodX,foodY]);
        score++;
        scoreElement.textContent=`Score: ${score}`;
        if(score>highScore){highScore=score;localStorage.setItem("high-score",highScore);highScoreElement.textContent=`High Score: ${highScore}`;}
    }

    snakeX+=velocityX; snakeY+=velocityY;
    if(snakeX<1||snakeX>30||snakeY<1||snakeY>30) return (gameOver=true);

    for(let i=snakeBody.length-1;i>0;i--) snakeBody[i]=snakeBody[i-1];
    snakeBody[0]=[snakeX,snakeY];

    for(let i=0;i<snakeBody.length;i++){
        htmlMarkup+=`<div class="snake" style="grid-area:${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;
        if(i!==0 && snakeBody[0][0]===snakeBody[i][0] && snakeBody[0][1]===snakeBody[i][1])
            return (gameOver=true);
    }

    playBoard.innerHTML=htmlMarkup;
};

changeFoodPosition();
setIntervalId=setInterval(initGame,100);
document.addEventListener("keydown",changeDirection);
