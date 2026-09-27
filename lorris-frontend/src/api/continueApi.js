import api from "./api";

export async function continueToNextTrick(gameId, playerName) {
    const response = await api.post(
        `/games/${gameId}/continue`,
        { playerName }
    );
    return response.data;
}
