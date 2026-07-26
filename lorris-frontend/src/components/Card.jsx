import "./Card.css";

export default function Card({

    card,

    onPlay,

    disabled

}){

    const suits={

        Hearts:"♥",
        Diamonds:"♦",
        Clubs:"♣",
        Spades:"♠",
        Joker:"🃏",

        HEARTS:"♥",
        DIAMONDS:"♦",
        CLUBS:"♣",
        SPADES:"♠"

    };

    const color=

        card.suit==="Hearts" ||
        card.suit==="Diamonds" ||
        card.suit==="HEARTS" ||
        card.suit==="DIAMONDS"

        ?"red"

        :"black";

    return(

        <button

            className={`playing-card ${color}`}

            disabled={disabled}

            onClick={onPlay}

        >

            <div className="card-rank">

                {card.rank}

            </div>

            <div className="card-suit">

                {suits[card.suit]}

            </div>

            <div className="card-rank">

                {card.rank}

            </div>

        </button>

    );

}