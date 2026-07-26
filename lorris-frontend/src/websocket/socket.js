import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export function connect(gameId, onGameUpdate) {

    const socket = new SockJS("http://localhost:8080/ws");

    stompClient = new Client({
        webSocketFactory: () => socket,

        reconnectDelay: 5000,

        onConnect: () => {

            console.log("Connected");

            stompClient.subscribe(
                `/topic/game/${gameId}`,
                message => {
                    const game = JSON.parse(message.body);
                    onGameUpdate(game);
                }
            );

        }
    });

    stompClient.activate();
}

export function disconnect() {

    if (stompClient) {
        stompClient.deactivate();
    }

}