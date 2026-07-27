import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export function connect(gameId, onGameUpdate) {

    const apiUrl = import.meta.env.VITE_API_URL;

    const socket = new SockJS(`${apiUrl}/ws`);

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