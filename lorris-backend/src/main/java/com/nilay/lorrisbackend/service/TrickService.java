package com.nilay.lorrisbackend.service;


import org.springframework.stereotype.Service;

import com.nilay.lorrisbackend.model.Card;
import com.nilay.lorrisbackend.model.Game;
import com.nilay.lorrisbackend.model.GameRules;
import com.nilay.lorrisbackend.model.Player;
import com.nilay.lorrisbackend.model.Trick;


@Service
public class TrickService {


    public void playCard(
            Game game,
            Player player,
            Card card
    ){


        if(game.getCurrentTrick() == null){

            game.setCurrentTrick(new Trick());

        }


        Trick trick = game.getCurrentTrick();



        // Check turn

        Player currentPlayer =
                game.getPlayers()
                .get(game.getCurrentPlayerIndex());


        if(currentPlayer != player){

            throw new RuntimeException(
                    "Not your turn"
            );

        }



        // Check card ownership

        if(!player.getHand().contains(card)){

            throw new RuntimeException(
                    "You don't have this card"
            );

        }



        // Follow suit rule

        if(trick.getLeadSuit()!=null){


            boolean valid =
                    GameRules.isValidPlay(
                            player.getHand(),
                            card,
                            trick.getLeadSuit()
                    );


            if(!valid){

                throw new RuntimeException(
                        "You must follow suit"
                );

            }

        }



        // Remove card

        player.getHand()
        .remove(card);



        // Add card to trick

        trick.addCard(
                player,
                card
        );



        // Trick completed

        if(trick.isComplete()){



            Player winner =
                    calculateWinner(
                            game,
                            trick,
                            game.getTrump()
                    );



            trick.setWinner(winner);



            updateScore(
                    game,
                    winner
            );



            // winner starts next trick

            game.setCurrentPlayerIndex(
                    game.getPlayers()
                    .indexOf(winner)
            );



            // create new trick

            game.setCurrentTrick(
                    new Trick()
            );


        }


        else{


            int nextPlayer =

                    (game.getCurrentPlayerIndex()+1)
                    %
                    game.getPlayers().size();


            game.setCurrentPlayerIndex(
                    nextPlayer
            );


        }


    }







    private Player calculateWinner(
            Game game,
            Trick trick,
            String trump
    ){

        Player winner = null;

        Card winningCard = null;

        for (var entry : trick.getPlayedCards().entrySet()) {

            String playerName = entry.getKey();

            Card currentCard = entry.getValue();

            Player currentPlayer =
                    game.getPlayers()
                            .stream()
                            .filter(player ->
                                    player.getName().equals(playerName))
                            .findFirst()
                            .orElseThrow(() ->
                                    new RuntimeException("Player not found"));

            if (winningCard == null) {

                winningCard = currentCard;
                winner = currentPlayer;
                continue;

            }

            if (cardBeats(
                    currentCard,
                    winningCard,
                    trick.getLeadSuit(),
                    trump
            )) {

                winningCard = currentCard;
                winner = currentPlayer;

            }

        }

        return winner;

    }








    private boolean cardBeats(
            Card newCard,
            Card oldCard,
            String leadSuit,
            String trump
    ){



        /*
         * Joker is strongest
         */

        if(isJoker(newCard)){

            return true;

        }


        if(isJoker(oldCard)){

            return false;

        }




        /*
         * Trump comparison
         */

        boolean newTrump =
                newCard.getSuit()
                .equals(trump);


        boolean oldTrump =
                oldCard.getSuit()
                .equals(trump);



        if(newTrump && !oldTrump){

            return true;

        }


        if(!newTrump && oldTrump){

            return false;

        }





        /*
         * Same category
         * Compare same suit
         */

        if(newCard.getSuit()
                .equals(oldCard.getSuit())){


            return rankValue(newCard)
                    >
                    rankValue(oldCard);

        }






        /*
         * Lead suit beats other suits
         */

        if(newCard.getSuit()
                .equals(leadSuit)
                &&
                !oldCard.getSuit()
                .equals(leadSuit)){


            return true;

        }



        return false;


    }









    private boolean isJoker(Card card){


        return card.getSuit()
                .equalsIgnoreCase("Joker");


    }









    private int rankValue(Card card){


        switch(card.getRank()){


            case "A":
                return 14;


            case "K":
                return 13;


            case "Q":
                return 12;


            case "J":
                return 11;


            case "10":
                return 10;


            case "9":
                return 9;


            case "8":
                return 8;


            case "7":
                return 7;


            case "6":
                return 6;


            case "5":
                return 5;


            case "4":
                return 4;


            case "3":
                return 3;


            case "Joker":
                return 20;


            default:
                return 0;

        }


    }









    private void updateScore(
            Game game,
            Player winner
    ){



        int index =
                game.getPlayers()
                .indexOf(winner);



        if(index % 2 == 0){


            game.setTricksTeamA(
                    game.getTricksTeamA()+1
            );


        }

        else{


            game.setTricksTeamB(
                    game.getTricksTeamB()+1
            );


        }


    }


}