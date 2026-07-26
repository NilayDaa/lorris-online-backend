export default function PlayerSeat({

    player,

    isCurrentTurn,

    isYou

}){

    if(!player){

        return null;

    }

    return(

        <div

            style={{

                background:"#14532d",

                border:isCurrentTurn
                    ?"3px solid gold"
                    :"2px solid #2d8a58",

                borderRadius:"15px",

                padding:"12px",

                width:"140px",

                color:"white",

                textAlign:"center",

                transition:"0.3s",

                boxShadow:isCurrentTurn
                    ?"0 0 20px gold"
                    :"0 4px 10px rgba(0,0,0,.3)"

            }}

        >

            <div
                style={{
                    fontSize:"30px"
                }}
            >

                👤

            </div>

            <h3
                style={{
                    margin:"5px 0"
                }}
            >

                {isYou ? "You" : player.name}

            </h3>

            <p>

                🃏 {player.hand.length} Cards

            </p>

            {

                isCurrentTurn &&

                <div

                    style={{

                        marginTop:"8px",

                        background:"gold",

                        color:"black",

                        borderRadius:"8px",

                        padding:"4px",

                        fontWeight:"bold"

                    }}

                >

                    YOUR TURN

                </div>

            }

        </div>

    );

}