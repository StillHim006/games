const canvas = document.getElementById('platformer-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const statusDisplay = document.getElementById('status');
const levelDisplay = document.getElementById('level');
const resetBtn = document.getElementById('reset-btn');

// Game constants
const gravity = 0.8;
const friction = 0.8;
const jumpStrength = -15;
const moveSpeed = 5;

let player = {
    x: 50,
    y: 300,
    w: 32,
    h: 32,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    color: '#00f2fe'
};

let platforms = [];
let goal = { x: 440, y: 50, w: 30, h: 30 };

let keys = {};
let gameActive = false;
let score = 0;
let level = 1;
const maxLevels = 10;

function initLevel() {
    platforms = [];
    switch (level) {
        case 1:
            platforms = [
                { x: 0, y: 340, w: 480, h: 20 }, // Floor
                { x: 100, y: 260, w: 100, h: 15 },
                { x: 250, y: 180, w: 100, h: 15 },
                { x: 400, y: 100, w: 80, h: 15 }
            ];
            goal = { x: 440, y: 70, w: 30, h: 30 };
            player.x = 50; player.y = 300;
            break;
        case 2:
            platforms = [
                { x: 0, y: 340, w: 100, h: 20 },
                { x: 150, y: 280, w: 100, h: 15 },
                { x: 300, y: 220, w: 100, h: 15 },
                { x: 150, y: 160, w: 100, h: 15 },
                { x: 50, y: 100, w: 80, h: 15 }
            ];
            goal = { x: 70, y: 70, w: 30, h: 30 };
            player.x = 20; player.y = 300;
            break;
        case 3:
            platforms = [
                { x: 0, y: 340, w: 50, h: 20 },
                { x: 100, y: 300, w: 50, h: 15 },
                { x: 200, y: 260, w: 50, h: 15 },
                { x: 300, y: 220, w: 50, h: 15 },
                { x: 400, y: 180, w: 50, h: 15 },
                { x: 300, y: 100, w: 80, h: 15 }
            ];
            goal = { x: 320, y: 70, w: 30, h: 30 };
            player.x = 20; player.y = 300;
            break;
        case 4:
            platforms = [
                { x: 0, y: 340, w: 480, h: 20 },
                { x: 50, y: 250, w: 30, h: 10 },
                { x: 150, y: 200, w: 30, h: 10 },
                { x: 250, y: 150, w: 30, h: 10 },
                { x: 350, y: 100, w: 30, h: 10 }
            ];
            goal = { x: 360, y: 70, w: 30, h: 30 };
            player.x = 20; player.y = 300;
            break;
        case 5:
            platforms = [
                { x: 0, y: 340, w: 150, h: 20 },
                { x: 200, y: 340, w: 280, h: 20 },
                { x: 300, y: 250, w: 150, h: 15 },
                { x: 100, y: 180, w: 150, h: 15 },
                { x: 400, y: 100, w: 80, h: 15 }
            ];
            goal = { x: 440, y: 70, w: 30, h: 30 };
            player.x = 20; player.y = 300;
            break;
        case 6:
            platforms = [
                { x: 0, y: 340, w: 480, h: 10 },
                { x: 100, y: 280, w: 50, h: 10 },
                { x: 100, y: 200, w: 50, h: 10 },
                { x: 100, y: 120, w: 50, h: 10 },
                { x: 400, y: 120, w: 50, h: 10 }
            ];
            goal = { x: 410, y: 90, w: 30, h: 30 };
            player.x = 20; player.y = 300;
            break;
        case 7:
            platforms = [
                { x: 0, y: 340, w: 50, h: 20 },
                { x: 430, y: 340, w: 50, h: 20 },
                { x: 200, y: 250, w: 80, h: 15 },
                { x: 50, y: 150, w: 80, h: 15 },
                { x: 350, y: 150, w: 80, h: 15 }
            ];
            goal = { x: 370, y: 120, w: 30, h: 30 };
            player.x = 20; player.y = 300;
            break;
        case 8:
            platforms = [
                { x: 0, y: 150, w: 100, h: 15 },
                { x: 150, y: 250, w: 100, h: 15 },
                { x: 300, y: 150, w: 100, h: 15 },
                { x: 0, y: 340, w: 480, h: 20 }
            ];
            goal = { x: 340, y: 120, w: 30, h: 30 };
            player.x = 20; player.y = 300;
            break;
        case 9:
            platforms = [
                { x: 0, y: 340, w: 480, h: 20 },
                { x: 50, y: 280, w: 20, h: 10 },
                { x: 150, y: 220, w: 20, h: 10 },
                { x: 250, y: 160, w: 20, h: 10 },
                { x: 350, y: 100, w: 20, h: 10 }
            ];
            goal = { x: 360, y: 70, w: 30, h: 30 };
            player.x = 20; player.y = 300;
            break;
        case 10:
            platforms = [
                { x: 0, y: 340, w: 20, h: 20 },
                { x: 100, y: 280, w: 20, h: 20 },
                { x: 200, y: 220, w: 20, h: 20 },
                { x: 300, y: 160, w: 20, h: 20 },
                { x: 400, y: 100, w: 20, h: 20 },
                { x: 450, y: 50, w: 30, h: 30 }
            ];
            goal = { x: 450, y: 20, w: 30, h: 30 };
            player.x = 20; player.y = 300;
            break;
    }
    levelDisplay.textContent = level;
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = player.color;
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // Core detail
    ctx.fillStyle = "#fff";
    ctx.fillRect(player.x + 8, player.y + 8, 16, 8);
    ctx.shadowBlur = 0;
}

function drawPlatforms() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.strokeStyle = varColor('--secondary');
    ctx.lineWidth = 2;

    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeRect(p.x, p.y, p.w, p.h);

        // Neon edge
        ctx.shadowBlur = 5;
        ctx.shadowColor = varColor('--primary');
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.w, p.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
    });
}

function drawGoal() {
    ctx.fillStyle = "#ff00c1";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff00c1";
    ctx.beginPath();
    ctx.arc(goal.x + goal.w / 2, goal.y + goal.h / 2, goal.w / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
}

function varColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function update() {
    if (!gameActive) return;

    // Movement
    if (keys['ArrowRight'] || keys['d']) {
        if (player.velocityX < moveSpeed) player.velocityX++;
    }
    if (keys['ArrowLeft'] || keys['a']) {
        if (player.velocityX > -moveSpeed) player.velocityX--;
    }

    // Physics
    player.velocityX *= friction;
    player.velocityY += gravity;

    player.x += player.velocityX;
    player.y += player.velocityY;

    // Jumping
    if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && !player.isJumping) {
        player.velocityY = jumpStrength;
        player.isJumping = true;
    }

    // Platform Collision
    player.isJumping = true;
    platforms.forEach(p => {
        if (player.x < p.x + p.w &&
            player.x + player.w > p.x &&
            player.y < p.y + p.h &&
            player.y + player.h > p.y) {

            // Re-check collision specifically from top
            if (player.velocityY > 0 && player.y + player.h - player.velocityY <= p.y) {
                player.y = p.y - player.h;
                player.velocityY = 0;
                player.isJumping = false;
            }
        }
    });

    // Screen boundaries
    if (player.x < 0) player.x = 0;
    if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;

    if (player.y > canvas.height) {
        gameOver();
    }

    // Goal Check
    if (player.x < goal.x + goal.w &&
        player.x + player.w > goal.x &&
        player.y < goal.y + goal.h &&
        player.y + player.h > goal.y) {
        if (level < maxLevels) {
            level++;
            alert(`SECTOR ${level - 1} SECURED! Proceeding to Sector ${level}`);
            resetGame();
        } else {
            statusDisplay.textContent = "MISSION COMPLETE";
            alert("ULTIMATE VICTORY! You have bypassed all security layers.");
            gameActive = false;
        }
    }

    score = Math.max(score, Math.floor(600 - player.y + player.x / 2));
    scoreDisplay.textContent = score + "m";
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid background
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    drawPlatforms();
    drawGoal();
    drawPlayer();

    if (gameActive) {
        requestAnimationFrame(draw);
        update();
    }
}

function gameOver() {
    gameActive = false;
    statusDisplay.textContent = "SIGNAL LOST";
    statusDisplay.style.color = "#ff4b2b";
    alert("CRITICAL ERROR: Neural Connection Severed.");
    resetGame();
}

function win() {
    // This function is now mostly handled by the goal check in update()
    // but keeping it for consistency if needed elsewhere or for final level.
    gameActive = false;
    statusDisplay.textContent = "UPLINK COMPLETE";
    statusDisplay.style.color = "#00f2fe";
    alert("SYSTEM SECURED: Level Data Transferred.");
    resetGame();
}

function resetGame() {
    initLevel();
    player.velocityX = 0;
    player.velocityY = 0;
    player.isJumping = false;
    score = 0;
    scoreDisplay.textContent = "0m";
    gameActive = false;
    statusDisplay.textContent = "STANDBY";
    statusDisplay.style.color = "";
    draw();
}

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

resetBtn.addEventListener('click', () => {
    if (!gameActive) {
        level = 1;
        initLevel();
        gameActive = true;
        statusDisplay.textContent = "ACTIVE";
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

// Initial draw
draw();
ctx.fillStyle = "#00f2fe";
ctx.font = "20px Orbitron";
ctx.textAlign = "center";
ctx.fillText("Reach the Pink Core to Secure System", canvas.width / 2, canvas.height / 2 + 50);
