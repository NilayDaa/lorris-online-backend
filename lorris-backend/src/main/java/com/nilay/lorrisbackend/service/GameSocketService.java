package com.nilay.lorrisbackend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.nilay.lorrisbackend.dto.GameUpdate;
import com.nilay.lorrisbackend.model.Game;

@Service
public class GameSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public GameSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendGameUpdate(Game game) {

        messagingTemplate.convertAndSend(
                "/topic/game/" + game.getGameId(),
                new GameUpdate("GAME_UPDATED", game)
        );

    }

}