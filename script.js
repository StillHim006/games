document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    setTimeout(() => {
        fetch('games.json')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(games => {
                renderGames(games);
            })
            .catch(error => {
                let msg = error.message;
                if (window.location.protocol === 'file:') {
                    msg = 'SECURITY PROTOCOL ACTIVE: Browser security prevents loading games.json via file://. Please upload to GitHub for clearance.';
                }
                showError(msg);
            });
    }, 800);
});

function renderGames(games) {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = '';

    games.forEach(game => {
        const card = document.createElement('a');
        card.href = game.url;
        card.className = 'game-card';

        card.innerHTML = `
            <span class="card-icon">${game.icon}</span>
            <div class="card-content">
                <div class="card-tagline">${game.tagline}</div>
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <div class="launch-btn">Execute Simulation</div>
            </div>
        `;

        gameGrid.appendChild(card);
    });
}

function showError(message) {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = `
        <div class="error-node" style="grid-column: 1/-1; padding: 40px; border: 1px solid var(--terminal-magenta); background: rgba(255, 0, 193, 0.02); text-align: center;">
            <h3 style="color: var(--terminal-magenta); margin-bottom: 20px; font-family: 'Orbitron'; font-size: 1.2rem;">SYSTEM ERROR // ACCESS DENIED</h3>
            <p style="color: var(--text-dim); line-height: 1.8; font-family: 'Orbitron'; font-size: 0.8rem;">${message}</p>
            <button onclick="location.reload()" style="margin-top: 30px; padding: 12px 24px; background: transparent; border: 1px solid var(--terminal-magenta); color: var(--terminal-magenta); cursor: pointer; font-family: 'Orbitron'; text-transform: uppercase; letter-spacing: 2px;">Retry Link</button>
        </div>
    `;
}
