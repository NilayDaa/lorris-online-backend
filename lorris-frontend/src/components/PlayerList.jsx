export default function PlayerList({
    game,
    playerName
}) {

    return (

        <div>

            <h2>
                Players
            </h2>

            <ul>

                {game.players.map((player, index) => (

                    <li key={index}>

                        {player.name}

                        {
                            game.players[
                                game.currentBidderIndex
                            ]?.name === player.name &&
                            " 🟢"
                        }

                        {
                            player.name === playerName &&
                            " (You)"
                        }

                    </li>

                ))}

            </ul>

        </div>

    );

}