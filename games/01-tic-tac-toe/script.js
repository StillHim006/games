const boardElement = document.getElementById('board');
const statusMsg = document.getElementById('status-msg');
const resetBtn = document.getElementById('reset-btn');
const xPanel = document.getElementById('player-x');
const oPanel = document.getElementById('player-o');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function initBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.dataset.index = index;
        cellDiv.addEventListener('click', handleCellClick);
        boardElement.appendChild(cellDiv);
    });
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (board[index] !== '' || !gameActive) return;

    board[index] = currentPlayer;
    renderCell(e.target, currentPlayer);

    if (checkWin()) {
        endGame(`${currentPlayer} Dominates!`);
    } else if (board.every(cell => cell !== '')) {
        endGame("It's a Stalemate!");
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

function renderCell(element, player) {
    const span = document.createElement('span');
    span.textContent = player;
    element.appendChild(span);
    element.classList.add(player.toLowerCase() + '-mark');
}

function checkWin() {
    return winPatterns.some(pattern => {
        return pattern.every(index => board[index] === currentPlayer);
    });
}

function updateStatus() {
    statusMsg.textContent = `Target Lock: Player ${currentPlayer}`;
    if (currentPlayer === 'X') {
        xPanel.classList.add('active');
        oPanel.classList.remove('active');
    } else {
        oPanel.classList.add('active');
        xPanel.classList.remove('active');
    }
}

function endGame(msg) {
    gameActive = false;
    statusMsg.textContent = msg;
    statusMsg.style.color = 'var(--primary)';
    if (msg.includes('O')) statusMsg.style.color = 'var(--accent)';
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusMsg.textContent = 'Your Turn, Player X';
    statusMsg.style.color = '';
    xPanel.classList.add('active');
    oPanel.classList.remove('active');
    initBoard();
}

resetBtn.addEventListener('click', resetGame);

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
updateStatus();
