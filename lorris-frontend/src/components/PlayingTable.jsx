export default function PlayingTable({ game }) {

    const trick = game.currentTrick;

    if (!trick) {

        return <h2>No cards played yet</h2>;

    }
    console.log(trick.playedCards);

    const entries =
        Object.entries(trick.playedCards || {});

    const suitSymbol = {

        HEARTS: "♥",
        DIAMONDS: "♦",
        CLUBS: "♣",
        SPADES: "♠",
        Hearts: "♥",
        Diamonds: "♦",
        Clubs: "♣",
        Spades: "♠",
        Joker: "🃏"

    };

    return (

        <div>

            <h2>Current Trick</h2>

            {

                entries.length === 0 ?

                    <p>Waiting for first card...</p>

                    :

                    entries.map(([player, card]) => (

                        <div key={player}>

                            <b>{player}</b>

                            {"  "}

                            {suitSymbol[card.suit]}

                            {" "}

                            {card.rank}

                        </div>

                    ))

            }

        </div>

    );

}