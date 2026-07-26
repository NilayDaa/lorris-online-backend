import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";


let client = null;


export function connectGameSocket(gameId, callback) {


    client = new Client({

        webSocketFactory: () =>
            new SockJS(
                "http://localhost:8080/ws"
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