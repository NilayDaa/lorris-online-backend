import PlayerSeat from "./PlayerSeat";
import "./TablePlayers.css";

export default function TablePlayers({

    players,

    currentPlayerIndex,

    playerName,

    children

}){

    return(

        <div className="table-layout">

            <div className="seat p2">
                <PlayerSeat
                    player={players[1]}
                    isCurrentTurn={currentPlayerIndex===1}
                    isYou={players[1]?.name===playerName}
                />
            </div>

            <div className="seat p1">
                <PlayerSeat
                    player={players[0]}
                    isCurrentTurn={currentPlayerIndex===0}
                    isYou={players[0]?.name===playerName}
                />
            </div>

            <div className="seat p3">
                <PlayerSeat
                    player={players[2]}
                    isCurrentTurn={currentPlayerIndex===2}
                    isYou={players[2]?.name===playerName}
                />
            </div>

            <div className="center">

                {children}

            </div>

            <div className="seat p6">
                <PlayerSeat
                    player={players[5]}
                    isCurrentTurn={currentPlayerIndex===5}
                    isYou={players[5]?.name===playerName}
                />
            </div>

            <div className="seat p4">
                <PlayerSeat
                    player={players[3]}
                    isCurrentTurn={currentPlayerIndex===3}
                    isYou={players[3]?.name===playerName}
                />
            </div>

            <div className="seat you">
                <PlayerSeat
                    player={players[4]}
                    isCurrentTurn={currentPlayerIndex===4}
                    isYou={players[4]?.name===playerName}
                />
            </div>

        </div>

    );

}