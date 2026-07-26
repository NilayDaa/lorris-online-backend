package com.nilay.lorrisbackend.model;


import java.util.List;


public class GameRules {



    public static boolean hasSuit(
            List<Card> hand,
            String suit
    ){

        for(Card c: hand){

            if(c.getSuit().equalsIgnoreCase(suit)
                    &&
               !c.isJoker()){

                return true;

            }

        }


        return false;

    }





    public static boolean isValidPlay(
            List<Card> hand,
            Card card,
            String leadSuit
    ){


        // Joker can always play
        if(card.isJoker()){

            return true;

        }



        // First card
        if(leadSuit==null){

            return true;

        }



        boolean hasLead =
                hasSuit(hand, leadSuit);



        // Must follow suit
        if(hasLead){

            return card.getSuit()
                    .equalsIgnoreCase(leadSuit);

        }



        // No lead suit available
        return true;


    }






    public static String getLeadSuit(Card firstCard){


        if(firstCard.isJoker()){

            return "Spades";

        }


        return firstCard.getSuit();

    }


}