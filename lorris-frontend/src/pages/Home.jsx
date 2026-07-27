import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createGame,
    joinGame
} from "../api/gameApi";

import "./Home.css";


export default function Home(){

    const navigate = useNavigate();


    const [createName,setCreateName] = useState("");

    const [joinName,setJoinName] = useState("");

    const [gameId,setGameId] = useState("");

    const [loading,setLoading] = useState(false);



    async function handleCreate(){


        if(!createName.trim()){

            alert("Enter your name");

            return;

        }


        try{

            setLoading(true);


            // create game

            const game =
                await createGame();



            // join as creator

            await joinGame(
                game.gameId,
                createName
            );



            localStorage.setItem(
                "playerName",
                createName
            );



            navigate(
                `/lobby/${game.gameId}`
            );


        }

        catch(error){

            console.error(error);

            alert(
                "Failed to create game"
            );

        }

        finally{

            setLoading(false);

        }

    }




    async function handleJoin(){


        if(
            !joinName.trim() ||
            !gameId.trim()
        ){

            alert(
                "Enter name and game ID"
            );

            return;

        }



        try{


            setLoading(true);



            const game =

                await joinGame(
                    gameId,
                    joinName
                );



            localStorage.setItem(
                "playerName",
                joinName
            );



            navigate(
                `/lobby/${game.gameId}`
            );


        }

        catch(error){

            console.error(error);

            alert(
                "Failed to join game"
            );

        }

        finally{

            setLoading(false);

        }

    }




    return (

        <div className="home-page">


            <div className="home-card">


                <div className="logo">
                    🃏
                </div>


                <h1>
                    Lorris Online
                </h1>


                <p className="subtitle">
                    3 vs 3 Trick Taking Game
                </p>



                <h3>
                    Create Game
                </h3>


                <input

                    placeholder="Your name"

                    value={createName}

                    onChange={
                        e=>
                        setCreateName(
                            e.target.value
                        )
                    }

                />


                <button

                    className="create-btn"

                    onClick={handleCreate}

                    disabled={loading}

                >

                    🎮 Create Game

                </button>




                <div className="divider">
                    OR
                </div>




                <h3>
                    Join Game
                </h3>


                <input

                    placeholder="Your name"

                    value={joinName}

                    onChange={
                        e=>
                        setJoinName(
                            e.target.value
                        )
                    }

                />


                <input

                    placeholder="Game ID"

                    value={gameId}

                    onChange={
                        e=>
                        setGameId(
                            e.target.value
                        )
                    }

                />



                <button

                    className="join-btn"

                    onClick={handleJoin}

                    disabled={loading}

                >

                    🚀 Join Game

                </button>



            </div>


        </div>

    );

}