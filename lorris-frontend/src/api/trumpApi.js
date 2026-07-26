import api from "./api";

export async function chooseTrump(
    gameId,
    playerName,
    trump
) {

    const response = await api.post(

        `/games/${gameId}/trump`,

        {

            playerName,
            trump

        }

    );

    return response.data;

}