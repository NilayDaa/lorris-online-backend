package com.nilay.lorrisbackend.service;

import org.springframework.stereotype.Service;

import com.nilay.lorrisbackend.model.Deck;
import com.nilay.lorrisbackend.model.Game;
import com.nilay.lorrisbackend.model.GameStatus;
import com.nilay.lorrisbackend.model.Player;
import com.nilay.lorrisbackend.model.Trick;

@Service
public class ScoreService {

    public void finishRound(Game game) {

        boolean declarerTeamA =
                game.getPlayers()
                        .indexOf(game.getDeclarer()) % 2 == 0;

        int tricksWon =
                declarerTeamA
                        ? game.getTricksTeamA()
                        : game.getTricksTeamB();

        boolean contractMade =
                tricksWon >= game.getHighestBid();

        int earnedPoints;

        // 8 tricks = 16 points
        if (tricksWon == 8) {

            earnedPoints = 16;

        } else {

            earnedPoints = game.getHighestBid();

        }

        if (contractMade) {

            applyPoints(
                    game,
                    declarerTeamA,
                    earnedPoints
            );

        } else {

            applyPenalty(
                    game,
                    declarerTeamA,
                    game.getHighestBid() * 2
            );

        }

        // Match winner
        if (game.getTeamAScore() >= 32) {

            game.setWinnerTeam("Team A");
            game.setStatus(GameStatus.FINISHED);
            return;

        }

        if (game.getTeamBScore() >= 32) {

            game.setWinnerTeam("Team B");
            game.setStatus(GameStatus.FINISHED);
            return;

        }

        // Round winner
        if (game.getTricksTeamA() > game.getTricksTeamB()) {

            game.setWinnerTeam("Team A");

        } else {

            game.setWinnerTeam("Team B");

        }

        game.setStatus(GameStatus.ROUND_FINISHED);

    }
    private void applyPenalty(
            Game game,
            boolean teamA,
            int penalty
    ) {

        if (teamA) {

            game.setTeamAScore(
                    Math.max(
                            0,
                            game.getTeamAScore() - penalty
                    )
            );

        } else {

            game.setTeamBScore(
                    Math.max(
                            0,
                            game.getTeamBScore() - penalty
                    )
            );

        }

    }

    private void applyPoints(
            Game game,
            boolean teamA,
            int points
    ) {

        if (teamA) {

            if (game.getTeamBScore() > 0) {

                int reduce =
                        Math.min(
                                points,
                                game.getTeamBScore()
                        );

                game.setTeamBScore(
                        game.getTeamBScore() - reduce
                );

                points -= reduce;

            }

            game.setTeamAScore(
                    game.getTeamAScore() + points
            );

        } else {

            if (game.getTeamAScore() > 0) {

                int reduce =
                        Math.min(
                                points,
                                game.getTeamAScore()
                        );

                game.setTeamAScore(
                        game.getTeamAScore() - reduce
                );

                points -= reduce;

            }

            game.setTeamBScore(
                    game.getTeamBScore() + points
            );

        }

    }

    public void nextRound(Game game) {

        // Rotate dealer
        game.setDealerIndex(
                (game.getDealerIndex() + 1)
                        % game.getPlayers().size()
        );

        // Reset round values
        game.setHighestBid(0);
        game.setDeclarer(null);
        game.setTrump(null);

        game.setPassCount(0);
        game.setBidsMade(0);
        game.setBiddingFinished(false);

        game.setTricksTeamA(0);
        game.setTricksTeamB(0);

        game.setWinnerTeam(null);

        // New deck
        game.setDeck(new Deck());

        game.getDeck().shuffle();

        // Clear hands
        for (Player player : game.getPlayers()) {

            player.getHand().clear();

        }

        // Clear trick history
        game.getCompletedTricks().clear();

        game.setCurrentTrick(new Trick());

        // Deal again
        for (int i = 0; i < 8; i++) {

            for (Player player : game.getPlayers()) {

                player.addCard(
                        game.getDeck().dealCard()
                );

            }

        }

        // First bidder = player after dealer
        game.setCurrentBidderIndex(

                (game.getDealerIndex() + 1)
                        % game.getPlayers().size()

        );

        game.setCurrentPlayerIndex(
                game.getCurrentBidderIndex()
        );

        game.setStatus(
                GameStatus.BIDDING
        );

    }

}