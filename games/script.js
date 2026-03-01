document.addEventListener('DOMContentLoaded', () => {
    const gameGrid = document.getElementById('game-grid');
    
    // Simulate slight delay for premium feel
    setTimeout(() => {
        fetch('games.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Mainframe connection lost. Please refresh.');
                }
                return response.json();
            })
            .then(games => {
                renderGames(games);
            })
            .catch(error => {
                showError(error.message);
            });
    }, 800);
});

function renderGames(games) {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = ''; // Remove loader

    games.forEach((game, index) => {
        const card = document.createElement('article');
        card.className = 'game-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const thumbnail = game.thumbnail || 'https://via.placeholder.com/400x250/151632/00f2fe?text=' + encodeURIComponent(game.title);

        card.innerHTML = `
            <div class="card-image">
                <img src="${thumbnail}" alt="${game.title}" loading="lazy">
            </div>
            <div class="card-content">
                <div class="category">${game.category || 'Game'}</div>
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <a href="${game.url}" class="play-btn">Launch Game</a>
            </div>
        `;
        gameGrid.appendChild(card);
    });
}

function showError(message) {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = `
        <div class="error-state">
            <span class="error-icon">⚠️</span>
            <h3>System Failure</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="play-btn">Retry Connection</button>
        </div>
    `;
}
