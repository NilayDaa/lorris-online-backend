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
import { getPlayerHand } from "../api/playerApi";
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

        return (

        <div className="game-page">

        <div className="game-table">

        <div className="table-header">

        <div>

        <h2>Lorris Online</h2>

        <p>Game ID: {game.gameId}</p>

        </div>

        <ScoreBoard

            game={game}

        />

        </div>

        <div className="table-center">

        <div className="p2">
            <PlayerSeat
            player={game.players[1]}
            isCurrentTurn={game.currentPlayerIndex===1}
            isYou={game.players[1]?.name===playerName}
            />        </div>

        <div className="p3">
            <PlayerSeat
            player={game.players[2]}
            isCurrentTurn={game.currentPlayerIndex===2}
            isYou={game.players[2]?.name===playerName}
            />        </div>

        <div className="p1">
            <PlayerSeat

                player={game.players[0]}

                isCurrentTurn={game.currentPlayerIndex === 0}

                isYou={game.players[0]?.name === playerName}

            />
        </div>

        <div className="p4">
            <PlayerSeat
            player={game.players[3]}
            isCurrentTurn={game.currentPlayerIndex===3}
            isYou={game.players[3]?.name===playerName}
            />
        </div>

        <div className="p5">
            <PlayerSeat
            player={game.players[4]}
            isCurrentTurn={game.currentPlayerIndex===4}
            isYou={game.players[4]?.name===playerName}
            />        </div>

        <div className="p6">
            <PlayerSeat
            player={game.players[5]}
            isCurrentTurn={game.currentPlayerIndex===5}
            isYou={game.players[5]?.name===playerName}
            />        </div>

        <div className="center">

            <CurrentTrick

                game={game}

            />

        </div>

        </div>


        <div className="hand-area">

            {

            hand.map((card,index)=>(

            <Card

            key={index}

            card={card}

            disabled={
            game.players[
            game.currentPlayerIndex
            ]?.name!==playerName
            }

            onPlay={()=>

            handlePlay(card)

            }

            />

            ))

            }

            </div>

        </div>

        </div>

        );

    }