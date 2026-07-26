import api from "./api";

export async function createGame() {
    const response = await api.post("/games");
    return response.data;
}

export async function joinGame(gameId, playerName) {
    const response = await api.post(`/games/${gameId}/join`, {
        playerName,
    });

    return response.data;
}

export async function getGame(gameId) {
    const response = await api.get(`/games/${gameId}`);
    return response.data;
}

