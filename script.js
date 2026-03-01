document.addEventListener('DOMContentLoaded', () => {
    const gameGrid = document.getElementById('game-grid');

    // Simulate loading delay for "Pro" feel
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
                    msg = 'System Blocked: Browser security prevents loading games.json via file://.<br><br><b>To Fix:</b><br>1. Upload to GitHub<br>2. OR use "Live Server" in VS Code<br>3. OR run a local Python server.';
                }
                showError(msg);
            });
    }, 600);
});

function renderGames(games) {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = ''; // Clear loader

    games.forEach(game => {
        const card = document.createElement('a');
        card.href = game.url;
        card.className = 'game-card';

        card.innerHTML = `
            <div class="card-content">
                <h3>${game.title}</h3>
                <p>${game.desc}</p>
                <div class="play-label">Launch System</div>
            </div>
        `;

        gameGrid.appendChild(card);
    });
}

function showError(message) {
    const gameGrid = document.getElementById('game-grid');
    gameGrid.innerHTML = `
        <div class="error-container" style="grid-column: 1/-1; text-align: left; padding: 40px; border: 1px solid var(--accent); border-radius: 12px; background: rgba(255, 0, 193, 0.05);">
            <h3 style="color: var(--accent); margin-bottom: 15px; font-family: 'Orbitron';">System Breach Detected</h3>
            <p style="color: var(--text-dim); line-height: 1.6;">${message}</p>
            <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: var(--accent); border: none; border-radius: 4px; color: white; cursor: pointer; font-family: 'Orbitron'; font-size: 0.8rem;">Re-initialize</button>
        </div>
    `;
}
