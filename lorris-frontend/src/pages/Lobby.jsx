import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Lobby.css";

import { getGame } from "../api/gameApi";
import { useNavigate } from "react-router-dom";
import {
    connectGameSocket,
    disconnectSocket
} from "../socket/gameSocket";

import PlayerSeat from "../components/PlayerSeat";

export default function Lobby(){

    const { gameId } = useParams();

    const navigate = useNavigate();

    const playerName =
        localStorage.getItem("playerName");

    const [game,setGame] =
        useState(null);


    useEffect(()=>{

        loadGame();

        connectGameSocket(
            gameId,
            updatedGame=>{

                setGame(updatedGame);

            }
        );

        return ()=>disconnectSocket();

    },[]);

    useEffect(() => {

        if (!game) return;

        if (game.status === "BIDDING") {

            navigate(`/game/${game.gameId}`);

        }

    }, [game, navigate]);

    async function loadGame(){

        const data =
            await getGame(gameId);

        setGame(data);

    }


    if(!game){

        return <h2>Loading...</h2>;

    }


    return(

        <div className="lobby-page">

            <h1>

                Lorris Lobby

            </h1>

            <div className="lobby-table">

                <div className="l2">
                    <PlayerSeat
                        player={game.players[1]}
                        isYou={game.players[1]?.name===playerName}
                    />
                </div>

                <div className="l3">
                    <PlayerSeat
                        player={game.players[2]}
                        isYou={game.players[2]?.name===playerName}
                    />
                </div>

                <div className="l1">
                    <PlayerSeat
                        player={game.players[0]}
                        isYou={game.players[0]?.name===playerName}
                    />
                </div>

                <div className="l4">
                    <PlayerSeat
                        player={game.players[3]}
                        isYou={game.players[3]?.name===playerName}
                    />
                </div>

                <div className="l6">
                    <PlayerSeat
                        player={game.players[5]}
                        isYou={game.players[5]?.name===playerName}
                    />
                </div>

                <div className="l5">
                    <PlayerSeat
                        player={game.players[4]}
                        isYou={game.players[4]?.name===playerName}
                    />
                </div>

                <div className="center-info">

                    <h2>

                        Game ID

                    </h2>

                    <h1>

                        {game.gameId}

                    </h1>

                    <p>

                        {game.players.length} / 6 Players

                    </p>

                    {

                        game.players.length<6

                        ?

                        <div className="waiting">

                            Waiting for players...

                        </div>

                        :

                        <div className="ready">

                            All Players Joined

                        </div>

                    }

                </div>

            </div>

        </div>

    );

}