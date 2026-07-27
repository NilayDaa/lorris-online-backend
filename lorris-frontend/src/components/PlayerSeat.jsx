import "./PlayerSeat.css";

export default function PlayerSeat({

    player,

    isCurrentTurn,

    isYou

}){

    if(!player){

        return null;

    }

    return(

        <div className={`player-seat ${isCurrentTurn ? "current-turn" : ""}`}>

            <div className="avatar">

                👤

            </div>

            <div className="player-name">

                {isYou ? "YOU" : player.name}

            </div>

            <div className="card-count">

                🃏 {player.hand.length}

            </div>

            {

                isCurrentTurn &&

                <div className="turn-indicator">

                    TURN

                </div>

            }

        </div>

    );

}