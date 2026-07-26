package com.nilay.lorrisbackend.model;


import java.util.LinkedHashMap;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class Trick {


    // Keeps play order
    private Map<String, Card> playedCards;


    private Player winner;


    private String leadSuit;



    public Trick(){


        playedCards = new LinkedHashMap<>();

        winner = null;

        leadSuit = null;

    }





    public void addCard(
            Player player,
            Card card
    ){


        // First card decides lead suit
        if(playedCards.isEmpty()){


            leadSuit =
                GameRules.getLeadSuit(card);


        }



        playedCards.put(
                player.getName(),
                card
        );


    }





    public boolean isComplete(){


        return playedCards.size() == 6;


    }





    public void clear(){


        playedCards.clear();

        winner = null;

        leadSuit = null;


    }



}