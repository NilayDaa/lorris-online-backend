import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";


let client = null;


export function connectGameSocket(gameId, callback) {


    const API_URL = import.meta.env.VITE_API_URL_1;

    client = new Client({
        webSocketFactory: () =>
            new SockJS(`${API_URL}/ws`
                ),


        reconnectDelay: 5000,


        onConnect: () => {


            console.log(
                "WebSocket connected"
            );


            client.subscribe(

                `/topic/game/${gameId}`,

                message => {


                    const data =
                        JSON.parse(
                            message.body
                        );


                    console.log(
                        "Received update",
                        data
                    );


                    callback(
                        data.game
                    );

                }

            );


        }

    });


    client.activate();

}




export function disconnectSocket(){


    if(client){

        client.deactivate();

        client=null;

    }

}