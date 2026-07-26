import api from "./api";

export async function getPlayerHand(gameId, playerName) {

    const response = await api.get(
        `/games/${gameId}/players/${playerName}/hand`
    );

    return response.data;
}