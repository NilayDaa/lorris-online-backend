import api from "./api";

export async function playCard(
    gameId,
    playerName,
    card
) {

    const response = await api.post(

        `/games/${gameId}/play`,

        {

            playerName,
            suit: card.suit,
            rank: card.rank

        }

    );

    return response.data;

}