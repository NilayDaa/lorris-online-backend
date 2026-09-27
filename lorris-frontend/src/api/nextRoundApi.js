import axios from "./api";

export async function nextRound(gameId){

    const response = await axios.post(
        `/games/${gameId}/next-round`
    );

    return response.data;
}