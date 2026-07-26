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

                <span className="title">Highest Bid</span>

                <span className="value">

                    {game.highestBid}

                </span>

            </div>

            <div className="score-item">

                <span className="title">Declarer</span>

                <span className="value">

                    {

                        game.declarer
                            ? game.declarer.name
                            : "-"

                    }

                </span>

            </div>

            <div className="score-item">

                <span className="title">

                    Team A

                </span>

                <span className="value">

                    {game.tricksTeamA}

                </span>

            </div>

            <div className="score-item">

                <span className="title">

                    Team B

                </span>

                <span className="value">

                    {game.tricksTeamB}

                </span>

            </div>

        </div>

    );

}