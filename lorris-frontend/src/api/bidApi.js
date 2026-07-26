import api from "./api";

export async function placeBid(
    gameId,
    playerName,
    bid
) {

    const response = await api.post(

        `/games/${gameId}/bid`,

        {

            playerName,

            bid

        }

    );

    return response.data;

}