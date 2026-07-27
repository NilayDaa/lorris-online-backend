import Card from "./Card";
import "./BidPanel.css";

export default function BidPanel({

    game,

    playerName,

    hand,

    onBid

}) {


    const yourTurn =
        game.players[
            game.currentBidderIndex
        ]?.name === playerName;


    return (

        <div className="bid-page">


            <div className="bid-card">


                <h1>

                    🎯 Place Your Bid

                </h1>



                <div className="bid-info">


                    <span>

                        Highest Bid

                    </span>


                    <strong>

                        {game.highestBid}

                    </strong>


                </div>



                {

                yourTurn ?


                <>


                    <div className="turn-box">

                        ✅ Your Turn

                    </div>



                    <div className="bid-grid">


                    {

                    [0,1,2,3,4,5,6,7,8]

                    .map(bid=>(


                        <button

                            key={bid}

                            className={
                                bid===0
                                ?"pass"
                                :"bid"
                            }

                            onClick={()=>onBid(bid)}

                        >

                            {

                            bid===0

                            ?

                            "PASS"

                            :

                            bid

                            }


                        </button>


                    ))

                    }


                    </div>


                </>


                :


                <div className="waiting-box">

                    ⏳ Waiting for

                    <strong>

                    {

                    game.players[
                        game.currentBidderIndex
                    ]?.name

                    }

                    </strong>

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