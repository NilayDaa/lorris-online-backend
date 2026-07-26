import { chooseTrump } from "../api/trumpApi";

export default function TrumpPanel({

    game,

    playerName

}) {

    const isDeclarer =
        game.declarer?.name === playerName;

    async function handleTrump(trump) {

        try {

            await chooseTrump(
                game.gameId,
                playerName,
                trump
            );

        }

        catch (error) {

            console.error(error);

        }

    }

    if (!isDeclarer) {

        return (

            <div>

                <h2>

                    Waiting for

                    {" "}

                    {game.declarer?.name}

                    {" "}

                    to choose trump...

                </h2>

            </div>

        );

    }

    return (

        <div>

            <h2>

                Choose Trump

            </h2>

            <button
                onClick={() => handleTrump("HEARTS")}
            >
                ♥ Hearts
            </button>

            <button
                onClick={() => handleTrump("SPADES")}
            >
                ♠ Spades
            </button>

            <button
                onClick={() => handleTrump("DIAMONDS")}
            >
                ♦ Diamonds
            </button>

            <button
                onClick={() => handleTrump("CLUBS")}
            >
                ♣ Clubs
            </button>

        </div>

    );

}