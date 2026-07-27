import "./ScoreBoard.css";

export default function ScoreBoard({ game }) {

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
                <span className="title">A Score</span>
                <span className="value">
                    {game.teamAScore}
                </span>
            </div>

            <div className="score-item scoreB">
                <span className="title">B Score</span>
                <span className="value">
                    {game.teamBScore}
                </span>
            </div>

        </div>

    );

}