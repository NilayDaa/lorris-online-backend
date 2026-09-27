import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
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

    const [copied, setCopied] = useState(false);


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

        try {
            const data =
                await getGame(gameId);

            setGame(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load game");
            navigate("/");
        }

    }

    async function copyGameId() {
        try {
            await navigator.clipboard.writeText(gameId);
            setCopied(true);
            toast.success("Game ID copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = gameId;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            toast.success("Game ID copied!");
            setTimeout(() => setCopied(false), 2000);
        }
    }

    function shareGame() {
        const shareUrl = `${window.location.origin}/lobby/${gameId}`;

        if (navigator.share) {
            navigator.share({
                title: 'Join my Lorris game!',
                text: `Join my Lorris game with ID: ${gameId}`,
                url: shareUrl,
            }).catch(() => {
                // User cancelled, do nothing
            });
        } else {
            // Fallback: copy link
            navigator.clipboard.writeText(shareUrl);
            toast.success("Game link copied to clipboard!");
        }
    }


    if(!game){

        return (
            <div className="lobby-page">
                <Toaster position="top-center" />
                <div className="loading-container">
                    <div className="spinner-large"></div>
                    <h2>Loading game...</h2>
                </div>
            </div>
        );

    }


    return(

        <div className="lobby-page">

            <Toaster position="top-center" />

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

                    <h1 className="game-id-display">

                        {game.gameId}

                    </h1>

                    <div className="action-buttons">
                        <button
                            className="copy-btn"
                            onClick={copyGameId}
                        >
                            {copied ? "✓ Copied!" : "📋 Copy ID"}
                        </button>
                        <button
                            className="share-btn"
                            onClick={shareGame}
                        >
                            🔗 Share
                        </button>
                    </div>

                    <p>

                        {game.players.length} / 6 Players

                    </p>

                    {

                        game.players.length<6

                        ?

                        <div className="waiting">

                            <div className="waiting-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            Waiting for players...

                        </div>

                        :

                        <div className="ready">

                            All Players Joined!<br/>
                            Starting game...

                        </div>

                    }

                </div>

            </div>

        </div>

    );

}