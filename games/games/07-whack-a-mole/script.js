const bugGrid = document.getElementById('bug-grid');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');

let score = 0;
let level = 1;
const maxLevels = 10;
let scoreGoal = 10;
let timeLeft = 30;
let timerId = null;
let bugTimeout = null;
let lastHole = null;
let gameActive = false;

function initGrid() {
    bugGrid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.className = 'hole';
        const bug = document.createElement('div');
        bug.className = 'bug';
        bug.addEventListener('mousedown', whack);
        hole.appendChild(bug);
        bugGrid.appendChild(hole);
    }
}

function randomHole() {
    const holes = document.querySelectorAll('.hole');
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) return randomHole();
    lastHole = hole;
    return hole;
}

function showBug() {
    if (!gameActive) return;
    const hole = randomHole();
    hole.classList.add('active');

    // Visibility duration decreases with level
    const displayTime = Math.max(200, 1000 - (level * 80));

    bugTimeout = setTimeout(() => {
        hole.classList.remove('active');
        if (gameActive) {
            // Wait slightly before showing next bug
            setTimeout(showBug, Math.max(100, 500 - (level * 40)));
        }
    }, displayTime);
}

function whack(e) {
    if (!e.isTrusted) return; // Anti-cheat
    if (!gameActive) return;

    const hole = this.parentElement;
    if (!hole.classList.contains('active')) return;

    score++;
    scoreDisplay.textContent = score;
    hole.classList.remove('active');
    hole.classList.add('hit');

    if (score >= scoreGoal) {
        if (level < maxLevels) {
            nextLevel();
        } else {
            endGame(true);
        }
    }

    // Visual feedback
    setTimeout(() => hole.classList.remove('hit'), 200);
}

function nextLevel() {
    gameActive = false;
    clearInterval(timerId);
    clearTimeout(bugTimeout);
    level++;
    scoreGoal += 5;
    alert(`LEVEL ${level - 1} CLEAR! Score Goal reached. Advancing to Level ${level}`);
    startGame();
}

function startGame() {
    if (level === 1) score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    document.getElementById('level').textContent = level;
    timerDisplay.textContent = timeLeft + 's';
    gameActive = true;
    resetBtn.disabled = true;
    resetBtn.style.opacity = '0.5';

    initGrid();
    showBug();

    timerId = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft + 's';
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function endGame(win) {
    gameActive = false;
    clearInterval(timerId);
    clearTimeout(bugTimeout);
    resetBtn.disabled = false;
    resetBtn.style.opacity = '1';
    resetBtn.textContent = 'Restart Sweep';
    if (win) {
        alert(`ULTIMATE SWEEP COMPLETE! Final Score: ${score}`);
        level = 1;
        scoreGoal = 10;
    } else {
        alert(`SYSTEM OVERRUN! Bugs Squashed: ${score}. Level reached: ${level}`);
        level = 1;
        scoreGoal = 10;
    }
}

resetBtn.addEventListener('click', startGame);

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
initGrid();
ctx = null; // Unused but preventing errors if accidentally called
