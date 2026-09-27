import { useEffect, useState } from "react";
import "./Game.css";
import { useParams } from "react-router-dom";
import { placeBid } from "../api/bidApi";
import toast, { Toaster } from 'react-hot-toast';
import PlayerList from "../components/PlayerList";
import BidPanel from "../components/BidPanel";
import TrumpPanel from "../components/TrumpPanel";
import Card from "../components/Card";
import { playCard } from "../api/playApi";
import ScoreBoard from "../components/ScoreBoard";
import PlayingTable from "../components/PlayingTable";
import PlayerSeat from "../components/PlayerSeat";
import { getGame } from "../api/gameApi";
import CurrentTrick from "../components/CurrentTrick";
import TablePlayers from "../components/TablePlayers";
import { getPlayerHand } from "../api/playerApi";
import RoundResult from "../components/RoundResult";
import TrickComplete from "../components/TrickComplete";
import { getTableSeats } from "../utils/tableSeats";
import { chooseTrump } from "../api/trumpApi";
import { continueToNextTrick } from "../api/continueApi";
import {
    connectGameSocket,
    disconnectSocket
} from "../socket/gameSocket";

export default function Game() {

    const { gameId } = useParams();

    const [game, setGame] = useState(null);
    const [hand, setHand] = useState([]);
    const [loading, setLoading] = useState(true);
    const playerName =
        localStorage.getItem("playerName");

    // Vibration feedback for mobile
    function vibrateOnAction() {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    useEffect(() => {

        loadGame();

        loadHand();

        const socketClient = connectGameSocket(
            gameId,
            (updatedGame) => {

                setGame(updatedGame);

                // Don't reload hand on every socket update; the server sends full state
            }
        );

        return () => {

            if (socketClient) {
                socketClient.deactivate();
            }
            disconnectSocket();

        };

    }, [gameId]);

    async function loadGame() {
        try {
            const data = await getGame(gameId);
            setGame(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load game");
        } finally {
            setLoading(false);
        }
    }

    async function loadHand() {

        try {
            const cards =
                await getPlayerHand(
                    gameId,
                    playerName
                );

            setHand(cards);
        } catch (error) {
            console.error(error);
        }

    }

    async function handleTrump(trump) {

        try {

            vibrateOnAction();

            await chooseTrump(
                gameId,
                playerName,
                trump
            );

            toast.success(`Trump set to ${trump}!`);

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data ||
                "Failed to choose trump"
            );

        }

    }

    async function handleBid(bid) {

        try {

            vibrateOnAction();

            await placeBid(

                gameId,

                playerName,

                bid

            );

            if (bid === 0) {
                toast.success("You passed");
            } else {
                toast.success(`Bid placed: ${bid} tricks`);
            }

        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data ||
                "Failed to place bid"
            );
        }

    }

    async function handlePlay(card) {

        try {

            vibrateOnAction();

            await playCard(

                gameId,

                playerName,

                card

            );

            toast.success("Card played!");

        }

        catch (error) {

            console.error(error);

            toast.error(error.response?.data || "Cannot play this card");

        }

    }

    async function handleContinue() {

        try {

            vibrateOnAction();

            await continueToNextTrick(gameId, playerName);

        } catch (error) {

            console.error(error);

            toast.error("Failed to continue");

        }

    }



    if (loading || !game) {
        return (
            <div className="game-page">
                <Toaster position="top-center" />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    gap: '20px',
                    color: 'white'
                }}>
                    <div className="spinner-large" style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '4px solid white',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                    }}></div>
                    <h2>Loading game...</h2>
                </div>
            </div>
        );
    }

    const myTurn =
    game.players[game.currentPlayerIndex]?.name === playerName;

    const seats = getTableSeats(
    game.players,
    playerName);

    if (

        game.status === "ROUND_FINISHED" ||

        game.status === "FINISHED"

    ){

        return (

            <>
                <Toaster position="top-center" />
                <RoundResult

                    game={game}

                />
            </>

        );

    }
    if (game.status === "BIDDING") {

        return (

            <>
                <Toaster position="top-center" />
                <BidPanel
                    game={game}
                    onBid={handleBid}
                    hand={hand}
                    playerName={playerName}
                />
            </>

        );

    }
    if (game.status === "CHOOSING_TRUMP") {

        return (

            <>
                <Toaster position="top-center" />
                <TrumpPanel
                    game={game}
                    playerName={playerName}
                    hand={hand}
                    onTrump={handleTrump}
                />
            </>

        );

    }

        return (

        <div className="game-page">

            <Toaster position="top-center" />

            {game.waitingForContinue && (
                <TrickComplete
                    game={game}
                    playerName={playerName}
                    onContinue={handleContinue}
                />
            )}

            <div className="game-header">

                <ScoreBoard game={game} playerName={playerName}/>

            </div>

            <div className="game-content">

                <TablePlayers

                    players={game.players}

                    currentPlayerIndex={game.currentPlayerIndex}

                    playerName={playerName}

                >

                    <CurrentTrick

                        game={game}

                    />

                </TablePlayers>

            </div>

            <div className="hand-area">

                <div className="hand-container">

                    <div className="hand-title">
                        Your Hand ({hand.length} {hand.length === 1 ? 'card' : 'cards'})
                        {myTurn && " - Your turn!"}
                    </div>

                    <div className="hand-area">

                        {
                            hand.map((card,index)=>(

                                <Card

                                    key={index}

                                    card={card}

                                    disabled={!myTurn || game.currentTrick?.complete}

                                    onPlay={()=>handlePlay(card)}

                                />

                            ))
                        }

                    </div>

                </div>

            </div>

        </div>

        )

    }