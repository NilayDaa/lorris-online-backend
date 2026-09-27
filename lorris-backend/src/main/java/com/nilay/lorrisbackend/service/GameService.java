package com.nilay.lorrisbackend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ScheduledExecutorService;

import org.springframework.stereotype.Service;

import com.nilay.lorrisbackend.model.Card;
import com.nilay.lorrisbackend.model.Deck;
import com.nilay.lorrisbackend.model.Game;
import com.nilay.lorrisbackend.model.GameStatus;
import com.nilay.lorrisbackend.model.Player;

@Service
public class GameService {

    private final Map<String, Game> games = new HashMap<>();
    private final TrickService trickService;
    private final GameSocketService socketService;
    private final ScoreService scoreService;
    private final ScheduledExecutorService scheduler;
    private final ContinueService continueService;

    // Single constructor with Spring Dependency Injection
    public GameService(TrickService trickService, GameSocketService socketService, ScoreService scoreService, ScheduledExecutorService scheduler, ContinueService continueService) {
        this.trickService = trickService;
        this.socketService = socketService;
        this.scoreService = scoreService;
        this.scheduler = scheduler;
        this.continueService = continueService;
    }

    public Game createGame() {

        String id = UUID.randomUUID()
                .toString()
                .substring(0, 6)
                .toUpperCase();

        Game game = new Game(id);

        games.put(id, game);

        socketService.sendGameUpdate(game);

        return game;
    }

    public Game getGame(String id) {
        Game g = games.get(id);
        if (g == null) {
            throw new RuntimeException("Game not found");
        }
        return g;
    }

    public Game joinGame(String gameId, String playerName) {
        Game game = games.get(gameId);

        if (game == null) {
            throw new RuntimeException("Game not found");
        }

        if (game.getPlayers().size() >= 6) {
            throw new RuntimeException("Game full");
        }

        // Check for duplicate name
        for (Player p : game.getPlayers()) {
            if (p.getName().equalsIgnoreCase(playerName)) {
                throw new RuntimeException("Name already taken");
            }
        }

        game.getPlayers().add(new Player(playerName));

        if (game.getPlayers().size() == 6) {
            startGame(game);
        }

        // Notify subscribers over WebSocket
        socketService.sendGameUpdate(game);

        return game;
    }

    private void startGame(Game game) {
        Deck deck = game.getDeck();
        deck.shuffle();

        for (int i = 0; i < 8; i++) {
            for (Player player : game.getPlayers()) {
                player.addCard(deck.dealCard());
            }
        }

        game.setStatus(GameStatus.BIDDING);
    }

    private void restartRound(Game game) {
        // Clear all players' hands
        for (Player player : game.getPlayers()) {
            player.getHand().clear();
        }

        // Reset bidding state
        game.setHighestBid(0);
        game.setDeclarer(null);
        game.setCurrentBidderIndex(0);
        game.setBidsMade(0);
        game.setBiddingFinished(false);

        // Create new deck and re-deal
        game.setDeck(new Deck());
        Deck deck = game.getDeck();
        deck.shuffle();

        for (int i = 0; i < 8; i++) {
            for (Player player : game.getPlayers()) {
                player.addCard(deck.dealCard());
            }
        }

        game.setStatus(GameStatus.BIDDING);
    }

    public List<Player> getPlayers(String gameId) {
        Game game = games.get(gameId);

        if (game == null) {
            throw new RuntimeException("Game not found");
        }

        return game.getPlayers();
    }

    public List<Card> getPlayerHand(String gameId, String playerName) {
        Game game = games.get(gameId);

        if (game == null) {
            throw new RuntimeException("Game not found");
        }

        for (Player player : game.getPlayers()) {
            if (player.getName().equalsIgnoreCase(playerName)) {
                return player.getHand();
            }
        }

        throw new RuntimeException("Player not found");
    }

    public Game placeBid(String gameId, String playerName, int bid) {
        Game game = games.get(gameId);

        if (game == null) {
            throw new RuntimeException("Game not found");
        }

        if (game.getStatus() != GameStatus.BIDDING) {
            throw new RuntimeException("Not bidding phase");
        }

        Player player = game.getPlayers().get(game.getCurrentBidderIndex());

        if (!player.getName().equalsIgnoreCase(playerName)) {
            throw new RuntimeException("Not your turn");
        }


        

        // 0 = Pass
        // Otherwise bids must be between 4 and 8
        if (bid != 0 && (bid < 4 || bid > 8)) {
            throw new RuntimeException("Bid must be between 4 and 8");
        }

        // Player is bidding
        if (bid > 0) {

            // Must beat the current highest bid
            if (bid <= game.getHighestBid()) {
                throw new RuntimeException(
                        "Bid must be higher than " + game.getHighestBid()
                );
            }

            game.setHighestBid(bid);
            game.setDeclarer(player);
        }

        game.setBidsMade(game.getBidsMade() + 1);

        game.setCurrentBidderIndex((game.getCurrentBidderIndex() + 1) % 6);

        if (game.getBidsMade() == 6) {
            System.out.println("Bids made: " + game.getBidsMade());
            System.out.println("Highest bid: " + game.getHighestBid());
            System.out.println("Declarer: " + (game.getDeclarer() == null ? "null" : game.getDeclarer().getName()));
            game.setBiddingFinished(true);

            if (game.getDeclarer() == null) {
                // Everyone passed - restart the round with new cards
                System.out.println("All players passed. Restarting round...");
                restartRound(game);
            } else {
                game.setStatus(GameStatus.CHOOSING_TRUMP);
            }
        }

        // Notify subscribers over WebSocket
        socketService.sendGameUpdate(game);

        return game;
    }

    public Game chooseTrump(String gameId, String playerName, String trump) {
        Game game = games.get(gameId);

        if (game == null) {
            throw new RuntimeException("Game not found");
        }

        if (game.getDeclarer() == null || !game.getDeclarer().getName().equalsIgnoreCase(playerName)) {
            throw new RuntimeException("Only declarer can choose trump");
        }

        game.setTrump(trump);
        game.setStatus(GameStatus.PLAYING);

        // Notify subscribers over WebSocket
        socketService.sendGameUpdate(game);

        return game;
    }

    public Game playCard(String gameId, String playerName, Card card) {
        Game game = games.get(gameId);

        if (game == null) {
            throw new RuntimeException("Game not found");
        }

        if (game.getStatus() != GameStatus.PLAYING) {
            throw new RuntimeException("Not in playing phase");
        }

        if (game.getCurrentTrick() != null &&
            game.getCurrentTrick().isComplete()) {

            throw new RuntimeException(
                    "Please wait for next trick."
            );

        }

        Player player = null;
        for (Player p : game.getPlayers()) {
            if (p.getName().equalsIgnoreCase(playerName)) {
                player = p;
                break;
            }
        }

        if (player == null) {
            throw new RuntimeException("Player not found");
        }

        trickService.playCard(game, player, card);

        // Only send immediately while trick is still being played

        if (!game.getCurrentTrick().isComplete()) {
            socketService.sendGameUpdate(game);
        }

        return game;
    }

    public Game nextRound(String gameId){

        Game game = games.get(gameId);

        if(game == null){

            throw new RuntimeException(
                    "Game not found"
            );

        }

        if (game.getStatus() != GameStatus.ROUND_FINISHED) {
            throw new RuntimeException("Round not finished");
        }

        scoreService.nextRound(game);

        socketService.sendGameUpdate(game);

        return game;

    }

    public Game playerContinue(String gameId, String playerName){

        Game game = games.get(gameId);

        if(game == null){
            throw new RuntimeException("Game not found");
        }

        continueService.playerReady(game, playerName);

        return game;

    }


}