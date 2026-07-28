import { useEffect, useState } from "react";
import "./Game.css";
import { useParams } from "react-router-dom";
import { placeBid } from "../api/bidApi";
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
import { getTableSeats } from "../utils/tableSeats";
import { chooseTrump } from "../api/trumpApi";
import {
    connectGameSocket,
    disconnectSocket
} from "../socket/gameSocket";

export default function Game() {

    const { gameId } = useParams();

    const [game, setGame] = useState(null);
    const [hand, setHand] = useState([]);
    const playerName =
        localStorage.getItem("playerName");

    useEffect(() => {

        loadGame();

        loadHand();

        connectGameSocket(
            gameId,
            (updatedGame) => {

                setGame(updatedGame);

                loadHand();

            }
        );

        return () => {

            disconnectSocket();

        };

    }, []);

    async function loadGame() {
        const data = await getGame(gameId);
        setGame(data);
    }

    async function loadHand() {

        const cards =
            await getPlayerHand(
                gameId,
                playerName
            );

        setHand(cards);

    }

    async function handleTrump(trump) {

        try {

            await chooseTrump(
                gameId,
                playerName,
                trump
            );

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data ||
                "Failed to choose trump"
            );

        }

    }

    async function handleBid(bid) {

        await placeBid(

            gameId,

            playerName,

            bid

        );

    }

    async function handlePlay(card) {

        try {

            await playCard(

                gameId,

                playerName,

                card

            );

        }

        catch (error) {

            console.error(error);

            alert(error.response?.data || "Cannot play card");

        }

    }

    

    if (!game) {
        return <h2>Loading...</h2>;
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

            <RoundResult

                game={game}

            />

        );

    }
    if (game.status === "BIDDING") {

        return (

            <BidPanel
                game={game}
                onBid={handleBid}
                hand={hand}
                playerName={playerName}
            />

        );

    }
    if (game.status === "CHOOSING_TRUMP") {

        return (

            <TrumpPanel
                game={game}
                playerName={playerName}
                hand={hand}
                onTrump={handleTrump}
            />

        );

    }

        return (

        <div className="game-page">

            <div className="game-header">

                <ScoreBoard game={game}/>

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