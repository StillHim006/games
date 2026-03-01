const canvas = document.getElementById('breakout-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const resetBtn = document.getElementById('reset-btn');
const levelDisplay = document.getElementById('level'); // Assuming a level display element exists

let score = 0;
let lives = 3;
let gameRunning = false;
let level = 1;
const maxLevels = 10;

const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 3,
    dy: -3,
    radius: 8
};

const paddle = {
    h: 12,
    w: 80,
    x: (canvas.width - 80) / 2,
    speed: 8
};

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 55;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 15;

let bricks = [];

function initBricks() {
    bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            let active = getBrickActive(r, c);
            bricks[c][r] = { x: 0, y: 0, status: active ? 1 : 0 };
        }
    }
}

function getBrickActive(r, c) {
    switch (level) {
        case 1: return true; // Full grid
        case 2: return r % 2 === 0; // Even rows
        case 3: return c % 2 === 0; // Even columns
        case 4: return (r + c) % 2 === 0; // Chessboard
        case 5: return r >= c && r >= (brickColumnCount - 1 - c); // Pyramid
        case 6: return r === 0 || r === brickRowCount - 1 || c === 0 || c === brickColumnCount - 1; // Border
        case 7: return r === 2 || c === 3; // Cross
        case 8: return r === c || r === brickColumnCount - 1 - c; // X shape
        case 9: return r > 1 && r < 4; // Horizontal band
        case 10: return Math.random() > 0.4; // Random noise
        default: return true;
    }
}

// Controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.w / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score += 10;
                    scoreDisplay.textContent = score;
                    if (score === getActiveBrickCount() * 10) {
                        if (level < maxLevels) {
                            level++;
                            nextLevel();
                        } else {
                            document.getElementById('status').textContent = "SYSTEM PURIFIED"; // Assuming a status element exists
                            alert("ULTIMATE VICTORY! Breakout complete.");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ffffff";
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, canvas.height - paddle.h, paddle.w, paddle.h);
    ctx.fillStyle = "#00f2fe";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00f2fe";
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = r === 0 ? "#ff00c1" : (r === 1 ? "#00f2fe" : "#4facfe");
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) ball.dx = -ball.dx;
    if (ball.y + ball.dy < ball.radius) ball.dy = -ball.dy;
    else if (ball.y + ball.dy > canvas.height - ball.radius) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
            ball.dy = -ball.dy;
            // Add slight angle change based on where it hits paddle
            ball.dx = paddle.speed * ((ball.x - (paddle.x + paddle.w / 2)) / paddle.w);
        } else {
            lives--;
            livesDisplay.textContent = lives;
            if (!lives) {
                alert("CRITICAL FAILURE! Game Over.");
                document.location.reload();
            } else {
                resetBall();
            }
        }
    }

    if (rightPressed && paddle.x < canvas.width - paddle.w) paddle.x += paddle.speed;
    else if (leftPressed && paddle.x > 0) paddle.x -= paddle.speed;

    ball.x += ball.dx;
    ball.y += ball.dy;
    requestAnimationFrame(draw);
}

function nextLevel() {
    gameRunning = false;
    alert(`LEVEL ${level - 1} CLEAR! Entering Level ${level}`);

    // Increase difficulty
    ball.dx = (ball.dx > 0 ? 1 : -1) * (3 + level * 0.5);
    ball.dy = (ball.dy > 0 ? 1 : -1) * (3 + level * 0.5);
    paddle.w = Math.max(40, 80 - (level * 4));

    resetBall();
    initBricks();
    score = 0; // Reset score per level for simplicity in calculation above
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    gameRunning = true;
    draw();
}

function getActiveBrickCount() {
    let count = 0;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (getBrickActive(r, c)) count++;
        }
    }
    return count;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.dx = (ball.dx > 0 ? 1 : -1) * (3 + level * 0.5); // Reset speed to current level's speed
    ball.dy = (ball.dy > 0 ? 1 : -1) * (3 + level * 0.5); // Reset speed to current level's speed
    paddle.x = (canvas.width - paddle.w) / 2;
}

resetBtn.addEventListener('click', () => {
    if (!gameRunning) {
        level = 1;
        lives = 3;
        score = 0;
        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;
        levelDisplay.textContent = level;
        initBricks();
        resetBall(); // Ensure ball and paddle are reset for new game
        gameRunning = true;
        draw();
        resetBtn.textContent = "Re-Initialize";
    } else {
        document.location.reload(); // Full reload for a true reset during game
    }
});

document.getElementById('fullscreen-btn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        document.getElementById('fullscreen-btn').textContent = '↘ Exit Full';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            document.getElementById('fullscreen-btn').textContent = '⛶ Full Screen';
        }
    }
});

initBricks();
drawBricks();
ctx.fillStyle = "#00f2fe";
ctx.font = "20px Orbitron";
ctx.textAlign = "center";
ctx.fillText("Ready for Engagement?", canvas.width / 2, canvas.height / 2 + 20);
