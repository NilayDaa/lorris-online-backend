import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";


let client = null;


export function connectGameSocket(gameId, callback) {


    const API_URL = import.meta.env.VITE_API_URL_1 || "http://localhost:8080";

    client = new Client({
        webSocketFactory: () =>
            new SockJS(`${API_URL}/ws`
                ),


        reconnectDelay: 5000,

        debug: (str) => {
            console.log("STOMP Debug:", str);
        },

        onConnect: () => {


            console.log(
                "WebSocket connected to game:", gameId
            );


            client.subscribe(

                `/topic/game/${gameId}`,

                message => {


                    const data =
                        JSON.parse(
                            message.body
                        );


                    console.log(
                        "Received game update:",
                        data
                    );


                    callback(
                        data.game
                    );

                }

            );


        },

        onStompError: (frame) => {
            console.error("STOMP error:", frame);
        },

        onWebSocketError: (error) => {
            console.error("WebSocket error:", error);
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