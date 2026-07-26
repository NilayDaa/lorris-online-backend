import Card from "./Card";
import "./CurrentTrick.css";

export default function CurrentTrick({ game }) {

    const trick = game.currentTrick;

    if (!trick) {

        return null;

    }

    const entries = Object.entries(
        trick.playedCards || {}
    );

    return (

        <div className="trick-table">

            {

                entries.map(([player, card], index) => (

                    <div

                        key={player}

                        className={`played-card seat-${index}`}

                    >

                        <small>{player}</small>

                        <Card

                            card={card}

                            disabled={true}

                        />

                    </div>

                ))

            }

        </div>

    );

}