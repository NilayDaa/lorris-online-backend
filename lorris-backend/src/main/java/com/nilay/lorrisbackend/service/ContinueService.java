package com.nilay.lorrisbackend.service;

import org.springframework.stereotype.Service;

import com.nilay.lorrisbackend.model.Game;
import com.nilay.lorrisbackend.model.Trick;

@Service
public class ContinueService {

    private final GameSocketService socketService;

    public ContinueService(GameSocketService socketService) {
        this.socketService = socketService;
    }

    public void playerReady(Game game, String playerName) {

        if (!game.isWaitingForContinue()) {
            throw new RuntimeException("Not waiting for continue");
        }

        // Add player to ready list if not already there
        if (!game.getPlayersReadyForNextTrick().contains(playerName)) {
            game.getPlayersReadyForNextTrick().add(playerName);
        }

        // Check if all players are ready
        if (game.getPlayersReadyForNextTrick().size() == game.getPlayers().size()) {

            // All players ready - start next trick
            game.setWaitingForContinue(false);
            game.getPlayersReadyForNextTrick().clear();

            // Set next player to trick winner
            game.setCurrentPlayerIndex(
                    game.getPlayers().indexOf(game.getCurrentTrick().getWinner())
            );

            // Create new trick
            game.setCurrentTrick(new Trick());
        }

        socketService.sendGameUpdate(game);
    }
}
