import axios from "axios";

export async function nextRound(gameId){

    const response = await axios.post(

        `http://localhost:8080/games/${gameId}/next-round`

    );

    return response.data;

}