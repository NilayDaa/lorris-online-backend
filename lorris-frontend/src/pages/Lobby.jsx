import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import { getGame } from "../api/gameApi";
import {
    connectGameSocket,
    disconnectSocket
} from "../socket/gameSocket";


export default function Lobby() {


    const { gameId } = useParams();
    const navigate = useNavigate();


    const [game, setGame] = useState(null);



    useEffect(() => {


        loadGame();


        connectGameSocket(
            gameId,
            (updatedGame)=>{

                console.log(
                    "Lobby update",
                    updatedGame
                );

                setGame(updatedGame);

            }
        );



        return ()=>{

            disconnectSocket();

        };


    },[]);



    async function loadGame(){


        const data =
            await getGame(gameId);


        setGame(data);

    }

    useEffect(() => {

        if (game?.status === "BIDDING") {
            navigate(`/game/${gameId}`);
        }

    }, [game]);




    if(!game){

        return <h1>
            Loading lobby...
        </h1>

    }



    return (

        <div>


            <h1>
                Lobby
            </h1>


            <h2>
                Game ID:
                {game.gameId}
            </h2>



            <h2>
                Players
                {
                    game.players.length
                }
                /6
            </h2>



            <ul>

            {
                game.players.map(
                    (player,index)=>(

                        <li key={index}>
                            {player.name}
                        </li>

                    )
                )
            }

            </ul>



            {
                game.status==="BIDDING"
                &&
                <h2>
                    Game Started!
                </h2>
            }


        </div>

    );


}