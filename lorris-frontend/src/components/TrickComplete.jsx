import "./TrickComplete.css";

export default function TrickComplete({ game, playerName, onContinue }) {

    const trick = game.currentTrick;
    const winner = trick?.winner;
    const hasConfirmed = game.playersReadyForNextTrick?.includes(playerName);

    return (
        <div className="trick-complete-overlay">
            <div className="trick-complete-card">

                <h2>🎯 Trick Complete!</h2>

                <div className="winner-section">
                    <span className="winner-label">Winner:</span>
                    <span className="winner-name">{winner?.name || "Unknown"}</span>
                </div>

                <div className="cards-played">
                    <h3>Cards Played:</h3>
                    <div className="played-cards-grid">
                        {Object.entries(trick?.playedCards || {}).map(([player, card]) => (
                            <div key={player} className="played-card-item">
                                <span className="player-name-small">{player}</span>
                                <span className="card-display">
                                    {card.rank}{card.suit[0]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ready-status">
                    <p>
                        {game.playersReadyForNextTrick?.length || 0} / {game.players?.length || 6} players ready
                    </p>
                </div>

                <button
                    className={`continue-btn ${hasConfirmed ? 'confirmed' : ''}`}
                    onClick={onContinue}
                    disabled={hasConfirmed}
                >
                    {hasConfirmed ? '✓ Waiting for others...' : 'Continue'}
                </button>

            </div>
        </div>
    );
}
