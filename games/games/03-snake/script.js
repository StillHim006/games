const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const resetBtn = document.getElementById('reset-btn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let highScore = localStorage.getItem('snake-high-score') || 0;
highScoreDisplay.textContent = highScore;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let nextDx = 0;
let nextDy = 0;
let gameInterval = null;
let speed = 100;

function initGame() {
    snake = [{ x: 10, y: 10 }];
    generateFood();
    dx = 0;
    dy = 0;
    nextDx = 0;
    nextDy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    speed = 100;

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
}

function gameLoop() {
    update();
    draw();
}

function update() {
    dx = nextDx;
    dy = nextDy;

    if (dx === 0 && dy === 0) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
            localStorage.setItem('snake-high-score', highScore);
        }
        generateFood();
        increaseSpeed();
    } else {
        snake.pop();
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#050614';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0); ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize); ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // Draw Snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#00f2fe' : '#4facfe';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f2fe';
        ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
    });

    // Draw Food
    ctx.fillStyle = '#ff00c1';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00c1';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // Ensure food doesn't spawn on snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        generateFood();
    }
}

function increaseSpeed() {
    if (speed > 50) {
        speed -= 2;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    }
}

function gameOver() {
    clearInterval(gameInterval);
    alert(`NEURAL LINK SEVERED! Final Score: ${score}`);
    initGame();
}

window.addEventListener('keydown', e => {
    switch (e.key.toLowerCase()) {
        case 'arrowup': case 'w': if (dy !== 1) { nextDx = 0; nextDy = -1; } break;
        case 'arrowdown': case 's': if (dy !== -1) { nextDx = 0; nextDy = 1; } break;
        case 'arrowleft': case 'a': if (dx !== 1) { nextDx = -1; nextDy = 0; } break;
        case 'arrowright': case 'd': if (dx !== -1) { nextDx = 1; nextDy = 0; } break;
    }
});

resetBtn.addEventListener('click', initGame);

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

// Initial draw
draw();
ctx.fillStyle = "rgba(0, 242, 254, 0.8)";
ctx.font = "20px Orbitron";
ctx.textAlign = "center";
ctx.fillText("Press Start to Begin", canvas.width / 2, canvas.height / 2);
