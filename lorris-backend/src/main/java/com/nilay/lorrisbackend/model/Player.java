package com.nilay.lorrisbackend.model;


import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class Player {


    private String id;

    private String name;

    private List<Card> hand;



    private int team;



    public Player(String name){


        this.id =
                UUID.randomUUID()
                .toString()
                .substring(0,6);


        this.name = name;


        this.hand =
                new ArrayList<>();


    }




    public void addCard(Card card){

        hand.add(card);

    }



    public boolean removeCard(Card card){

        return hand.remove(card);

    }



    public boolean hasCard(Card card){

        return hand.contains(card);

    }



    public void clearHand(){

        hand.clear();

    }


}