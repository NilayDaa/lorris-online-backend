import "./RoundResult.css";
import { nextRound } from "../api/nextRoundApi";

export default function RoundResult({ game }) {

    async function handleNextRound() {

        try {

            await nextRound(game.gameId);

        } catch (err) {

            console.error(err);

        }

    }

    const matchFinished = game.status === "FINISHED";

    return (

        <div className="result-overlay">

            <div className="result-card">

                <h1>

                    {matchFinished ? "🏆 MATCH OVER" : "🎉 ROUND COMPLETE"}

                </h1>

                <h2>

                    Winner

                </h2>

                <div className="winner-name">

                    {game.winnerTeam}

                </div>

                <div className="result-grid">

                    <div>

                        <span>Highest Bid</span>

                        <strong>{game.highestBid}</strong>

                    </div>

                    <div>

                        <span>Trump</span>

                        <strong>{game.trump}</strong>

                    </div>

                    <div>

                        <span>Declarer</span>

                        <strong>

                            {game.declarer?.name || "-"}

                        </strong>

                    </div>

                    <div>

                        <span>Team A Tricks</span>

                        <strong>{game.tricksTeamA}</strong>

                    </div>

                    <div>

                        <span>Team B Tricks</span>

                        <strong>{game.tricksTeamB}</strong>

                    </div>

                    <div>

                        <span>Score</span>

                        <strong>

                            {game.teamAScore} - {game.teamBScore}

                        </strong>

                    </div>

                </div>

                {

                    !matchFinished &&

                    <button

                        className="next-round-btn"

                        onClick={handleNextRound}

                    >

                        Next Round

                    </button>

                }

            </div>

        </div>

    );

}