package com.nilay.lorrisbackend.model;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class Game {


    private String gameId;

    private GameStatus status;


    private Deck deck;

    private List<Player> players;



    // Trump
    private String trump;



    // Scores
    private int teamAScore;

    private int teamBScore;



    // Bidding
    private int highestBid;

    private Player declarer;

    private int currentBidderIndex;

    private int passCount;

    private int bidsMade;

    private boolean biddingFinished;



    // Playing
    private int currentPlayerIndex;
    private List<Trick> completedTricks;

    private int dealerIndex;

    private int contractBid;

    private String winnerTeam;

    private Trick currentTrick;


    private int tricksTeamA;

    private int tricksTeamB;




    public Game(){

        players = new ArrayList<>();

    }




    public Game(String gameId){


        this.gameId = gameId;


        this.status =
                GameStatus.WAITING_FOR_PLAYERS;



        this.deck =
                new Deck();



        this.players =
                new ArrayList<>();

        this.completedTricks = new ArrayList<>();

        this.dealerIndex = 0;


        // bidding

        this.highestBid = 0;

        this.declarer = null;

        this.currentBidderIndex = 0;

        this.passCount = 0;

        this.bidsMade = 0;

        this.biddingFinished = false;



        // playing

        this.currentPlayerIndex = 0;

        this.currentTrick = new Trick();
        



        this.tricksTeamA = 0;

        this.tricksTeamB = 0;



        this.teamAScore = 0;

        this.teamBScore = 0;


    }

}