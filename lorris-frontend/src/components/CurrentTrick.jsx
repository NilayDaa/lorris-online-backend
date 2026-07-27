import Card from "./Card";
import "./CurrentTrick.css";

export default function CurrentTrick({ game }) {

    const trick = game.currentTrick;

    if (!trick) {

        return null;

    }

    function seatClass(playerName) {

        if (playerName === game.players[1]?.name) return "top";

        if (playerName === game.players[0]?.name) return "left";

        if (playerName === game.players[2]?.name) return "right";

        if (playerName === game.players[3]?.name) return "bottom-right";

        if (playerName === game.players[4]?.name) return "bottom";

        if (playerName === game.players[5]?.name) return "bottom-left";

        return "";

    }

    return (

        <div className="trick-table">

            {

                Object.entries(trick.playedCards || {}).map(

                    ([playerName, card]) => (

                        <div

                            key={playerName}

                            className={`played-card ${seatClass(playerName)}`}

                        >

                            <Card

                                card={card}

                                disabled={true}

                            />

                        </div>

                    )

                )

            }

        </div>

    );

}