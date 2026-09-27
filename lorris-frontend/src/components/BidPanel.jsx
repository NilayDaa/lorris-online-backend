import Card from "./Card";
import toast from 'react-hot-toast';
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

    function handleBidClick(bid) {
        if (bid > 0 && bid <= game.highestBid) {
            toast.error(`Bid must be higher than ${game.highestBid}`);
            return;
        }
        onBid(bid);
    }


    return (

        <div className="bid-page">


            <div className="bid-card">


                <h1>

                    🎯 Place Your Bid

                </h1>



                <div className="bid-info">


                    <span>

                        Current Highest Bid

                    </span>


                    <strong>

                        {game.highestBid || "None"}

                    </strong>


                </div>



                {

                yourTurn ?


                <>


                    <div className="turn-box">

                        ✅ Your Turn to Bid

                    </div>



                    <div className="bid-grid">


                    {

                    [0, 4, 5, 6, 7, 8]

                    .map(bid=>(


                        <button

                            key={bid}

                            className={
                                bid===0
                                ?"pass"
                                :"bid"
                            }

                            onClick={()=>handleBidClick(bid)}

                            disabled={bid > 0 && bid <= game.highestBid}

                            style={{
                                opacity: bid > 0 && bid <= game.highestBid ? 0.5 : 1,
                                cursor: bid > 0 && bid <= game.highestBid ? 'not-allowed' : 'pointer'
                            }}

                        >

                            {

                            bid===0

                            ?

                            "PASS"

                            :

                            `${bid} Tricks`

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

                    to bid...

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