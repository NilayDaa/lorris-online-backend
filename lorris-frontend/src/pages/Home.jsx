import {useState} from "react";
import {useNavigate} from "react-router-dom";

import {
    createGame,
    joinGame
}
from "../api/gameApi";


export default function Home(){


    const navigate =
        useNavigate();


    const [name,setName]=useState("");

    const [gameId,setGameId]=useState("");




    async function handleCreate(){


        try{


            const game =
                await createGame();



            await joinGame(
                game.gameId,
                name
            );
            
            localStorage.setItem("playerName", name);


            navigate(
                `/lobby/${game.gameId}`
            );


        }
        catch(error){

            console.log(error);

        }

    }





    async function handleJoin(){


        try{


            await joinGame(
                gameId,
                name
            );

            localStorage.setItem("playerName", name);



            navigate(
                `/lobby/${gameId}`
            );


        }
        catch(error){

            console.log(error);

        }


    }





return (

<div>


<h1>
Lorris Online
</h1>


<h2>Create Game</h2>


<input

placeholder="Your name"

value={name}

onChange={
e=>setName(e.target.value)
}

/>


<button
onClick={handleCreate}
>

Create Game

</button>



<hr/>


<h2>
Join Game
</h2>



<input

placeholder="Game ID"

value={gameId}

onChange={
e=>setGameId(e.target.value)
}

/>



<button
onClick={handleJoin}
>

Join

</button>




</div>

);


}