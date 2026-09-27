import Card from "./Card";
import toast from 'react-hot-toast';
import "./TrumpPanel.css";

export default function TrumpPanel({

    game,

    playerName,

    hand,

    onTrump

}) {


    const isDeclarer =
        game.declarer?.name === playerName;


    const suits = [

        {
            name:"Hearts",
            icon:"♥",
            color: "#dc2626"
        },

        {
            name:"Diamonds",
            icon:"♦",
            color: "#ea580c"
        },

        {
            name:"Clubs",
            icon:"♣",
            color: "#14532d"
        },

        {
            name:"Spades",
            icon:"♠",
            color: "#1e3a8a"
        }

    ];


    return (

        <div className="trump-page">


            <div className="trump-card">


                <h1>

                    👑 Choose Trump Suit

                </h1>


                <div className="declarer-box">

                    Declarer

                    <strong>

                        {game.declarer?.name}

                    </strong>

                    <div style={{
                        fontSize: '14px',
                        color: '#666',
                        marginTop: '4px'
                    }}>
                        Bid: {game.highestBid} tricks
                    </div>

                </div>



                {

                isDeclarer ?

                <div className="suit-grid">

                    {
                        suits.map(suit=>(

                            <button

                                key={suit.name}

                                className={
                                    suit.name
                                }

                                onClick={()=>
                                    onTrump(
                                        suit.name
                                    )
                                }

                            >

                                <span>

                                    {suit.icon}

                                </span>

                                {suit.name}

                            </button>

                        ))
                    }


                </div>


                :

                <div className="waiting-box">

                    ⏳ Waiting for

                    <br/>

                    <strong>

                    {game.declarer?.name}

                    </strong>

                    <br/>

                    to choose trump suit

                </div>

                }



                <div className="my-hand">

                    <h3>

                        Your Hand ({hand.length} cards)

                    </h3>


                    <div className="hand-row">


                    {
                        hand.map((card,index)=>(

                            <Card

                                key={index}

                                card={card}

                                disabled={true}

                            />

                        ))
                    }


                    </div>


                </div>


            </div>


        </div>

    );

}