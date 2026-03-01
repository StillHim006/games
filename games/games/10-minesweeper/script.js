const grid = document.getElementById('mine-grid');
const mineCountDisplay = document.getElementById('mine-count');
const statusDisplay = document.getElementById('game-status');
const resetBtn = document.getElementById('reset-btn');

const size = 10;
const mineCount = 10;
let cells = [];
let mines = [];
let flags = 0;
let gameActive = true;

function initBoard() {
    grid.innerHTML = '';
    cells = [];
    mines = [];
    flags = 0;
    gameActive = true;
    mineCountDisplay.textContent = mineCount;
    statusDisplay.textContent = 'SECURE';
    statusDisplay.style.color = '';

    // Create mines
    while (mines.length < mineCount) {
        let r = Math.floor(Math.random() * size * size);
        if (!mines.includes(r)) mines.push(r);
    }

    // Create cells
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => revealCell(i));
        cell.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            toggleFlag(i);
        });
        grid.appendChild(cell);
        cells.push({
            element: cell,
            isMine: mines.includes(i),
            isRevealed: false,
            isFlagged: false,
            mineCount: 0
        });
    }

    // Calculate neighbor counts
    cells.forEach((cell, i) => {
        if (cell.isMine) return;
        let neighbors = getNeighbors(i);
        cell.mineCount = neighbors.filter(n => cells[n].isMine).length;
    });
}

function getNeighbors(i) {
    let neighbors = [];
    let r = Math.floor(i / size);
    let c = i % size;

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            let nr = r + dr;
            let nc = c + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                neighbors.push(nr * size + nc);
            }
        }
    }
    return neighbors;
}

function revealCell(i) {
    if (!gameActive || cells[i].isRevealed || cells[i].isFlagged) return;

    cells[i].isRevealed = true;
    cells[i].element.classList.add('revealed');

    if (cells[i].isMine) {
        gameOver();
        return;
    }

    if (cells[i].mineCount > 0) {
        cells[i].element.textContent = cells[i].mineCount;
        cells[i].element.dataset.count = cells[i].mineCount;
    } else {
        // Recursive Reveal
        let neighbors = getNeighbors(i);
        neighbors.forEach(n => revealCell(n));
    }

    checkWin();
}

function toggleFlag(i) {
    if (!gameActive || cells[i].isRevealed) return;

    cells[i].isFlagged = !cells[i].isFlagged;
    cells[i].element.classList.toggle('flagged');

    flags += cells[i].isFlagged ? 1 : -1;
    mineCountDisplay.textContent = mineCount - flags;
}

function gameOver() {
    gameActive = false;
    statusDisplay.textContent = 'BREACHED';
    statusDisplay.style.color = '#ff4b2b';

    cells.forEach((cell, i) => {
        if (cell.isMine) {
            cell.element.classList.add('mine');
            cell.element.textContent = '💣';
        }
    });
    alert("CRITICAL SYSTEM FAILURE: Mine detonated.");
}

function checkWin() {
    const safeCells = cells.filter(c => !c.isMine);
    if (safeCells.every(c => c.isRevealed)) {
        gameActive = false;
        statusDisplay.textContent = 'SYSTEM SECURED';
        statusDisplay.style.color = '#00f2fe';
        alert("THREAT DECRYPTED: All mines located.");
    }
}

resetBtn.addEventListener('click', initBoard);

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

initBoard();
