import "./ScoreBoard.css";

export default function ScoreBoard({ game, playerName }) {

    // Team A: Players at even indices (0, 2, 4)
    const teamA = game.players?.filter((_, index) => index % 2 === 0) || [];

    // Team B: Players at odd indices (1, 3, 5)
    const teamB = game.players?.filter((_, index) => index % 2 === 1) || [];

    return (

        <div className="score-board">

            <div className="score-item">
                <span className="title">Trump</span>
                <span className="value">
                    {game.trump || "-"}
                </span>
            </div>

            <div className="score-item">
                <span className="title">Bid</span>
                <span className="value">
                    {game.highestBid || "-"}
                </span>
            </div>

            <div className="score-item">
                <span className="title">Declarer</span>
                <span className="value small">
                    {game.declarer?.name || "-"}
                </span>
            </div>

            <div className="score-item">
                <span className="title">Dealer</span>
                <span className="value small">
                    {game.players?.[game.dealerIndex]?.name || "-"}
                </span>
            </div>

            <div className="score-item">
                <span className="title">A Tricks</span>
                <span className="value">
                    {game.tricksTeamA}
                </span>
            </div>

            <div className="score-item">
                <span className="title">B Tricks</span>
                <span className="value">
                    {game.tricksTeamB}
                </span>
            </div>

            <div className="score-item scoreA">
                <span className="title">Team A</span>
                <span className="value">
                    {game.teamAScore}
                </span>
                <div className="team-players">
                    {teamA.map((player, idx) => (
                        <span key={idx} className="player-name">
                            {player.name}
                            {player.name === playerName && " ⭐"}
                        </span>
                    ))}
                </div>
            </div>

            <div className="score-item scoreB">
                <span className="title">Team B</span>
                <span className="value">
                    {game.teamBScore}
                </span>
                <div className="team-players">
                    {teamB.map((player, idx) => (
                        <span key={idx} className="player-name">
                            {player.name}
                            {player.name === playerName && " ⭐"}
                        </span>
                    ))}
                </div>
            </div>

        </div>

    );

}