export default function BidPanel({

    game,

    playerName,

    onBid

}) {

    const yourTurn =
        game.players[
            game.currentBidderIndex
        ]?.name === playerName;

    return (

        <div>

            <h2>

                Highest Bid

            </h2>

            <h1>

                {game.highestBid}

            </h1>

            {

                yourTurn ?

                <>

                    <h3>

                        Your Turn

                    </h3>

                    {

                        [0,1,2,3,4,5,6,7,8].map(bid => (

                            <button

                                key={bid}

                                onClick={() => onBid(bid)}

                            >

                                {bid === 0 ? "Pass" : bid}

                            </button>

                        ))

                    }

                </>

                :

                <h3>

                    Waiting for

                    {

                        game.players[
                            game.currentBidderIndex
                        ]?.name

                    }

                </h3>

            }

        </div>

    );

}