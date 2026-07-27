import Card from "./Card";
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
            icon:"♥"
        },

        {
            name:"Diamonds",
            icon:"♦"
        },

        {
            name:"Clubs",
            icon:"♣"
        },

        {
            name:"Spades",
            icon:"♠"
        }

    ];


    return (

        <div className="trump-page">


            <div className="trump-card">


                <h1>

                    👑 Choose Trump

                </h1>


                <div className="declarer-box">

                    Declarer

                    <strong>

                        {game.declarer?.name}

                    </strong>

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

                    to choose trump

                </div>

                }



                <div className="my-hand">

                    <h3>

                        Your Hand

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