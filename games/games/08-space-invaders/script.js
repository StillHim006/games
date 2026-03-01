const canvas = document.getElementById('invaders-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const shieldDisplay = document.getElementById('shield');
const levelDisplay = document.getElementById('level');
const resetBtn = document.getElementById('reset-btn');

let score = 0;
let shield = 100;
let level = 1;
const maxLevels = 10;
let gameActive = false;
let keys = {};

const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 40,
    width: 30,
    height: 20,
    speed: 5,
    color: '#00f2fe'
};

let bullets = [];
let enemies = [];
let enemyRows = 4;
let enemyCols = 8;
const enemyWidth = 30;
const enemyHeight = 20;
let enemyDirection = 1;
let enemySpeed = 1.5;

function initEnemies() {
    enemies = [];
    enemyRows = 3 + Math.floor(level / 2);
    enemyCols = 6 + Math.floor(level / 2);
    enemySpeed = 1.0 + (level * 0.3);
    levelDisplay.textContent = level;

    for (let r = 0; r < enemyRows; r++) {
        for (let c = 0; c < enemyCols; c++) {
            enemies.push({
                x: c * 40 + 50,
                y: r * 30 + 50,
                width: enemyWidth,
                height: enemyHeight,
                color: r < (enemyRows / 2) ? '#ff00c1' : '#4facfe'
            });
        }
    }
}

function update() {
    if (!gameActive) return;

    // Player movement
    if ((keys['ArrowLeft'] || keys['a']) && player.x > 0) player.x -= player.speed;
    if ((keys['ArrowRight'] || keys['d']) && player.x < canvas.width - player.width) player.x += player.speed;

    // Bullet movement
    bullets.forEach((b, i) => {
        b.y -= 7;
        if (b.y < 0) bullets.splice(i, 1);
    });

    // Enemy movement
    let edgeReached = false;
    enemies.forEach(e => {
        e.x += enemySpeed * enemyDirection;
        if (e.x + e.width > canvas.width || e.x < 0) edgeReached = true;
    });

    if (edgeReached) {
        enemyDirection *= -1;
        enemies.forEach(e => e.y += 15);
    }

    // Collision Detection
    bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
            if (b.x < e.x + e.width && b.x + 5 > e.x && b.y < e.y + e.height && b.y + 10 > e.y) {
                bullets.splice(bi, 1);
                enemies.splice(ei, 1);
                score += 50;
                scoreDisplay.textContent = score;
            }
        });
    });

    // Win/Loss
    if (enemies.length === 0) win();
    enemies.forEach(e => {
        if (e.y + e.height > player.y) gameOver();
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars background
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 20; i++) {
        ctx.fillRect(Math.sin(i + Date.now() / 1000) * canvas.width / 2 + canvas.width / 2, (i * 20 + Date.now() / 50) % canvas.height, 1, 1);
    }

    // Player
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Bullets
    ctx.fillStyle = '#fff';
    bullets.forEach(b => ctx.fillRect(b.x, b.y, 2, 8));

    // Enemies
    enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });
    ctx.shadowBlur = 0;

    if (gameActive) {
        update();
        requestAnimationFrame(draw);
    }
}

function win() {
    gameActive = false;
    if (level < maxLevels) {
        level++;
        alert(`SECTOR ${level - 1} CLEAR! Advancing to Sector ${level}`);
        resetGame(false, true);
    } else {
        alert("ULTIMATE VICTORY! All alien fleets decimated.");
        resetGame(true);
    }
}

function gameOver() {
    gameActive = false;
    alert("DEFENSES BREACHED! System Compromised.");
    resetGame(true);
}

function resetGame(fullReset = false, nextLevel = false) {
    if (fullReset) {
        score = 0;
        level = 1;
    }
    scoreDisplay.textContent = score;
    initEnemies();
    bullets = [];
    player.x = canvas.width / 2 - 15;
    gameActive = false;
    resetBtn.textContent = nextLevel ? "Engage Next Wave" : (fullReset ? "Engage Defense" : "Re-Engage");
    draw();
}

window.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (e.key === ' ' && gameActive) {
        if (bullets.length < 3) bullets.push({ x: player.x + player.width / 2, y: player.y });
    }
});
window.addEventListener('keyup', e => keys[e.key] = false);

resetBtn.addEventListener('click', () => {
    if (!gameActive) {
        gameActive = true;
        draw();
    } else {
        resetGame();
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

// Init
initEnemies();
draw();
ctx.fillStyle = "#00f2fe";
ctx.font = "18px Orbitron";
ctx.textAlign = "center";
ctx.fillText("Ready to Defend the Hub?", canvas.width / 2, 200);
