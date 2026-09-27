import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
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

    const [errors, setErrors] = useState({});



    function validateName(name) {
        if (!name.trim()) {
            return "Name is required";
        }
        if (name.length < 2) {
            return "Name must be at least 2 characters";
        }
        if (name.length > 20) {
            return "Name must be less than 20 characters";
        }
        return null;
    }

    function validateGameId(id) {
        if (!id.trim()) {
            return "Game ID is required";
        }
        if (id.length !== 6) {
            return "Game ID must be 6 characters";
        }
        return null;
    }


    async function handleCreate(){

        const nameError = validateName(createName);
        if (nameError) {
            setErrors({ createName: nameError });
            toast.error(nameError);
            return;
        }

        setErrors({});

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

            localStorage.setItem(
                "lastGameId",
                game.gameId
            );

            localStorage.setItem(
                "joinedAt",
                Date.now()
            );


            toast.success("Game created successfully!");

            navigate(
                `/lobby/${game.gameId}`
            );


        }

        catch(error){

            console.error(error);

            toast.error(
                error.response?.data || "Failed to create game. Please try again."
            );

        }

        finally{

            setLoading(false);

        }

    }




    async function handleJoin(){


        const nameError = validateName(joinName);
        const idError = validateGameId(gameId);

        if (nameError || idError) {
            setErrors({
                joinName: nameError,
                gameId: idError
            });
            toast.error(nameError || idError);
            return;
        }

        setErrors({});


        try{


            setLoading(true);



            const game =

                await joinGame(
                    gameId.toUpperCase(),
                    joinName
                );



            localStorage.setItem(
                "playerName",
                joinName
            );

            localStorage.setItem(
                "lastGameId",
                game.gameId
            );

            localStorage.setItem(
                "joinedAt",
                Date.now()
            );


            toast.success("Joined game successfully!");

            navigate(
                `/lobby/${game.gameId}`
            );


        }

        catch(error){

            console.error(error);

            toast.error(
                error.response?.data || "Failed to join game. Please check the Game ID and try again."
            );

        }

        finally{

            setLoading(false);

        }

    }




    return (

        <div className="home-page">

            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '12px',
                        padding: '12px 20px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />


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
                        e=> {
                            setCreateName(
                                e.target.value
                            );
                            if (errors.createName) {
                                setErrors({ ...errors, createName: null });
                            }
                        }
                    }

                    className={errors.createName ? "input-error" : ""}

                    maxLength={20}

                    disabled={loading}

                />

                {errors.createName && (
                    <div className="error-text">{errors.createName}</div>
                )}


                <button

                    className="create-btn"

                    onClick={handleCreate}

                    disabled={loading}

                >

                    {loading ? (
                        <span className="button-content">
                            <span className="spinner"></span>
                            Creating...
                        </span>
                    ) : (
                        "🎮 Create Game"
                    )}

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
                        e=> {
                            setJoinName(
                                e.target.value
                            );
                            if (errors.joinName) {
                                setErrors({ ...errors, joinName: null });
                            }
                        }
                    }

                    className={errors.joinName ? "input-error" : ""}

                    maxLength={20}

                    disabled={loading}

                />

                {errors.joinName && (
                    <div className="error-text">{errors.joinName}</div>
                )}


                <input

                    placeholder="Game ID (6 characters)"

                    value={gameId}

                    onChange={
                        e=> {
                            setGameId(
                                e.target.value.toUpperCase()
                            );
                            if (errors.gameId) {
                                setErrors({ ...errors, gameId: null });
                            }
                        }
                    }

                    className={errors.gameId ? "input-error" : ""}

                    maxLength={6}

                    disabled={loading}

                />

                {errors.gameId && (
                    <div className="error-text">{errors.gameId}</div>
                )}



                <button

                    className="join-btn"

                    onClick={handleJoin}

                    disabled={loading}

                >

                    {loading ? (
                        <span className="button-content">
                            <span className="spinner"></span>
                            Joining...
                        </span>
                    ) : (
                        "🚀 Join Game"
                    )}

                </button>



            </div>


        </div>

    );

}