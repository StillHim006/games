const gridElement = document.getElementById('memory-grid');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const pairsDisplay = document.getElementById('pairs');
const resetBtn = document.getElementById('reset-btn');

const symbols = ['🛡️', '⚔️', '💎', '👾', '🚀', '⭐', '🔋', '📡'];
let cards = [...symbols, ...symbols];
let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let timer = 0;
let interval = null;
let lockBoard = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initGame() {
    clearInterval(interval);
    timer = 0;
    moves = 0;
    matchedCount = 0;
    flippedCards = [];
    lockBoard = false;

    movesDisplay.textContent = moves;
    timerDisplay.textContent = '00:00';
    pairsDisplay.textContent = '0/8';

    shuffle(cards);
    gridElement.innerHTML = '';

    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.symbol = symbol;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${symbol}</div>
            </div>
        `;
        card.addEventListener('click', flipCard);
        gridElement.appendChild(card);
    });

    startTimer();
}

function startTimer() {
    interval = setInterval(() => {
        timer++;
        const mins = Math.floor(timer / 60).toString().padStart(2, '0');
        const secs = (timer % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
}

function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return;
    if (this.classList.contains('matched')) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.symbol === card2.dataset.symbol;

    if (isMatch) {
        matchedCount++;
        pairsDisplay.textContent = `${matchedCount}/8`;
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        if (matchedCount === 8) {
            clearInterval(interval);
            setTimeout(() => alert(`System Restored! Completed in ${moves} moves and ${timerDisplay.textContent}.`), 500);
        }
    } else {
        lockBoard = true;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 1000);
    }
}

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

initGame();
