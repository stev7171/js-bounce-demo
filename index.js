const canvas = document.getElementById("gameCanvas");

const GS_PAUSE = 0;
const GS_PLAY = 1;
const GS_OVER = 2;

const circleSize = 10;

let x = 50;
let y = 50;

let dx = 1;
let dy = 1;

let paddleX = (canvas.width/2) - 50;
let padLeft = false;
let padRight = false;

let score = 0;
let scrMargin = 10;

let ballSpeed = 2;

let gameState = GS_PLAY;

function init() {
    x = 50;
    y = 50;

    dx = 1;
    dy = 1;

    paddleX = (canvas.width/2) - 50;
    padLeft = false;
    padRight = false;

    score = 0;

    ballSpeed = 2;
}

function update() {
    if (gameState === GS_PLAY) {
        let lastScore = score;

        if (x >= canvas.width - circleSize) {
            dx = -ballSpeed;
        }

        if (x <= 0 + circleSize) {
            dx = ballSpeed;
        }

        if (y >= canvas.height - circleSize - 10 && x > paddleX && x < paddleX + 50) {
            y = canvas.height - circleSize - 10;
            if (score === lastScore) {
                score += 1;
                ballSpeed += 0.01;
            }
            dy = -ballSpeed;
        }

        if (y <= 0 + circleSize) {
            dy = ballSpeed;
        }

        if (y >= canvas.height + 5) {
            gameState = GS_OVER
        }

        x += dx;
        y += dy;

        if (padLeft && paddleX > 0) { paddleX -= 5; }
        if (padRight && paddleX < canvas.width - 50) { paddleX += 5; }
    } 
}

function draw() {
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgb(200 0 0)";
        ctx.beginPath();
        ctx.arc(x, y, circleSize, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillRect(paddleX, canvas.height - 10, 50, 10);

        if (gameState === GS_PLAY) {
            ctx.fillStyle = "rgb(0 0 0)";
            ctx.font = "32px arial";
            let len = ctx.measureText(score.toString());
            ctx.fillText(score.toString(), (canvas.width/2)-(len.width/2), canvas.height/2)
        }

        if (gameState === GS_PAUSE) {
            ctx.fillStyle = "rgb(0 0 0)";
            ctx.font = "48px arial";
            let len = ctx.measureText("PAUSED");
            ctx.fillText("PAUSED", (canvas.width/2)-(len.width/2), canvas.height/2)
        }

        if (gameState === GS_OVER) {
            ctx.fillStyle = "rgb(0 0 0)";
            ctx.font = "48px arial";
            let len = ctx.measureText("GAME OVER!");
            ctx.fillText("GAME OVER!", (canvas.width/2)-(len.width/2), canvas.height/2)

            ctx.font = "32px arial";
            let scr = ctx.measureText("SCORE : " + score.toString());
            ctx.fillText("SCORE : " + score.toString(), (canvas.width/2)-(scr.width/2), (canvas.height/2)+32+scrMargin);

            ctx.fillText("SPACE TO RESTART", (canvas.width/2)-(ctx.measureText("SPACE TO RESTART").width/2), (canvas.height/2)+32*2+scrMargin);
        }

        update();
    }
}

function keydown(event) {
    if (event.key === "Escape") {
        if (gameState === GS_PLAY) {
            gameState = GS_PAUSE;
        } else if (gameState === GS_PAUSE) {
            gameState = GS_PLAY;
        }
    }

    if (gameState === GS_OVER) {
        if (event.key === " ") {
            gameState = GS_PLAY;
            init();
        }
    }

    if (gameState === GS_PLAY) {
        if (event.key === "ArrowLeft") {
            padLeft = true;
        }

        if (event.key === "ArrowRight") {
            padRight = true;
        }
    }
}

function keyup(event) {
    if (gameState === GS_PLAY) {
        if (event.key === "ArrowLeft") {
            padLeft = false;
        }

        if (event.key === "ArrowRight") {
            padRight = false;
        }
    }
}

addEventListener('keydown', keydown);
addEventListener('keyup', keyup);
setInterval(draw, 10);