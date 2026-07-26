package com.nilay.lorrisbackend.model;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class Card {


    private String suit;

    private String rank;



    public Card(String suit, String rank){

        this.suit = suit;
        this.rank = rank;

    }



    public boolean isJoker(){

        return suit != null
                &&
               suit.equalsIgnoreCase("Joker");

    }



    public int getRankValue(){


        switch(rank.toUpperCase()){


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

            case "JOKER":
                return 20;

            default:
                return 0;

        }

    }



    @Override
    public boolean equals(Object obj){

        if(this == obj)
            return true;


        if(!(obj instanceof Card))
            return false;


        Card other = (Card)obj;


        return suit.equalsIgnoreCase(other.suit)
                &&
               rank.equalsIgnoreCase(other.rank);

    }



    @Override
    public int hashCode(){

        return (suit.toLowerCase()
                +
                rank.toLowerCase())
                .hashCode();

    }



    @Override
    public String toString(){

        return suit+"-"+rank;

    }

}