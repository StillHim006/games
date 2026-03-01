const canvas = document.getElementById('frogger-canvas');
const ctx = canvas.getContext('2d');
const levelDisplay = document.getElementById('level');
const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');

const gridSize = 40;
let score = 0;
let level = 1;
const maxLevels = 10;
let timeLeft = 45;
let timeRemaining = timeLeft;
let timerInterval = null;
let gameActive = false;

let player = {
    x: 180,
    y: 360,
    width: 30,
    height: 30,
    color: '#00f2fe'
};

let lanes = [];

function startLevel() {
    player.x = canvas.width / 2 - 15;
    player.y = canvas.height - 40;
    lanes = [];
    levelDisplay.textContent = level;

    const baseSpeed = 1.0 + (level * 0.4);

    for (let i = 1; i <= 6; i++) {
        lanes.push({
            y: i * 45 + 20,
            speed: (i % 2 === 0 ? 1 : -1) * (baseSpeed + Math.random() * level),
            cars: [],
            spawnTimer: 0,
            spawnRate: 40 + Math.random() * (100 - level * 8)
        });
        // Pre-populate some cars
        for (let j = 0; j < 3; j++) {
            lanes[i - 1].cars.push({ x: Math.random() * canvas.width, width: 40 + Math.random() * 40 });
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.shadowBlur = 0;
}

function drawLanes() {
    lanes.forEach((lane) => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fillRect(0, lane.y, canvas.width, 35);

        ctx.fillStyle = (lane.speed > 0) ? '#ff00c1' : '#4facfe';
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;

        lane.cars.forEach((car, index) => {
            ctx.fillRect(car.x, lane.y + 5, car.width, 25);
            car.x += lane.speed;

            if (lane.speed > 0 && car.x > canvas.width) car.x = -car.width;
            if (lane.speed < 0 && car.x < -car.width) car.x = canvas.width;

            if (player.x < car.x + car.width && player.x + player.width > car.x &&
                player.y < lane.y + 30 && player.y + player.height > lane.y) {
                gameOver();
            }
        });

        lane.spawnTimer++;
        if (lane.spawnTimer > lane.spawnRate) {
            lane.cars.push({ x: lane.speed > 0 ? -100 : canvas.width + 100, width: 40 + Math.random() * 40 });
            lane.spawnTimer = 0;
        }
        ctx.shadowBlur = 0;
    });
}

function update() {
    if (!gameActive) return;

    if (player.y < 30) {
        if (level < maxLevels) {
            level++;
            alert(`LAYER ${level - 1} PENETRATED! Moving to Layer ${level}`);
            timeLeft = Math.max(20, 45 - (level * 2));
            timeRemaining = timeLeft;
            startLevel();
        } else {
            gameActive = false;
            clearInterval(timerInterval);
            alert("MAINFRAME ACCESSED! Ultimate Victory.");
            resetGame();
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 242, 254, 0.05)';
    ctx.fillRect(0, 360, canvas.width, 40);
    ctx.fillRect(0, 0, canvas.width, 40);

    drawLanes();
    drawPlayer();

    if (gameActive) {
        update();
        requestAnimationFrame(draw);
    }
}

function gameOver() {
    gameActive = false;
    clearInterval(timerInterval);
    alert("CONNECTION SEVERED: System Rebooting.");
    resetGame();
}

function resetGame() {
    level = 1;
    timeLeft = 45;
    timeRemaining = timeLeft;
    levelDisplay.textContent = level;
    timerDisplay.textContent = timeRemaining + "s";
    startLevel();
    resetBtn.textContent = "Launch Probe";
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = timeRemaining + "s";
        if (timeRemaining <= 0) {
            gameOver();
        }
    }, 1000);
}

window.addEventListener('keydown', e => {
    if (!gameActive) return;
    switch (e.key) {
        case 'ArrowUp': if (player.y > 0) player.y -= 40; break;
        case 'ArrowDown': if (player.y < 360) player.y += 40; break;
        case 'ArrowLeft': if (player.x > 0) player.x -= 40; break;
        case 'ArrowRight': if (player.x < canvas.width - 40) player.x += 40; break;
    }
});

resetBtn.addEventListener('click', () => {
    if (!gameActive) {
        gameActive = true;
        startTimer();
        draw();
        resetBtn.textContent = "Abort Mission";
    } else {
        gameOver();
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

startLevel();
ctx.fillStyle = "#00f2fe";
ctx.font = "16px Orbitron";
ctx.textAlign = "center";
ctx.fillText("Ready to Breach?", canvas.width / 2, 200);
