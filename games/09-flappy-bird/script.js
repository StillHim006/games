const canvas = document.getElementById('flappy-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const resetBtn = document.getElementById('reset-btn');

let score = 0;
let highScore = localStorage.getItem('flutter-high-score') || 0;
highScoreDisplay.textContent = highScore;

let gameActive = false;
let frames = 0;

const bird = {
    x: 50,
    y: 150,
    w: 30,
    h: 24,
    gravity: 0.25,
    jump: 4.6,
    speed: 0,
    rotation: 0
};

let pipes = [];
const pipeGap = 120;
const pipeWidth = 50;

function initGame() {
    bird.y = 150;
    bird.speed = 0;
    bird.rotation = 0;
    score = 0;
    scoreDisplay.textContent = score;
    pipes = [];
    frames = 0;
    gameActive = false;
}

function update() {
    if (!gameActive) return;

    bird.speed += bird.gravity;
    bird.y += bird.speed;
    bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.speed * 0.1));

    if (bird.y + bird.h >= canvas.height) gameOver();

    // Pipes
    if (frames % 100 === 0) {
        let h = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({ x: canvas.width, top: h, bottom: canvas.height - h - pipeGap });
    }

    pipes.forEach((p, i) => {
        p.x -= 2;

        // Collision
        if (bird.x + bird.w > p.x && bird.x < p.x + pipeWidth) {
            if (bird.y < p.top || bird.y + bird.h > canvas.height - p.bottom) {
                gameOver();
            }
        }

        // Score
        if (p.x + pipeWidth === bird.x) {
            score++;
            scoreDisplay.textContent = score;
            if (score > highScore) {
                highScore = score;
                highScoreDisplay.textContent = highScore;
                localStorage.setItem('flutter-high-score', highScore);
            }
        }

        if (p.x + pipeWidth < 0) pipes.splice(i, 1);
    });

    frames++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Grid
    ctx.strokeStyle = "rgba(0, 242, 254, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
    }

    // Bird
    ctx.save();
    ctx.translate(bird.x + bird.w / 2, bird.y + bird.h / 2);
    ctx.rotate(bird.rotation);
    ctx.fillStyle = "#ff00c1";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff00c1";
    ctx.fillRect(-bird.w / 2, -bird.h / 2, bird.w, bird.h);
    ctx.fillStyle = "#fff";
    ctx.fillRect(5, -5, 10, 5); // Eye
    ctx.restore();

    // Pipes
    ctx.fillStyle = "#00f2fe";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00f2fe";
    pipes.forEach(p => {
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        ctx.fillRect(p.x, canvas.height - p.bottom, pipeWidth, p.bottom);
    });
    ctx.shadowBlur = 0;

    if (gameActive) {
        update();
        requestAnimationFrame(draw);
    }
}

function gameOver() {
    gameActive = false;
    alert("TRANSMISSION TERMINATED! Final Score: " + score);
    initGame();
}

resetBtn.addEventListener('click', () => {
    if (!gameActive) {
        gameActive = true;
        draw();
        resetBtn.textContent = "Restart Link";
    } else {
        initGame();
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

canvas.addEventListener('mousedown', flap);
window.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'ArrowUp') flap(); });

function flap() {
    if (gameActive) bird.speed = -bird.jump;
}

// Init
initGame();
draw();
ctx.fillStyle = "#00f2fe";
ctx.font = "18px Orbitron";
ctx.textAlign = "center";
ctx.fillText("Ready to Fly?", canvas.width / 2, 240);
