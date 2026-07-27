package com.nilay.lorrisbackend.controller;


import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nilay.lorrisbackend.dto.BidRequest;
import com.nilay.lorrisbackend.dto.JoinGameRequest;
import com.nilay.lorrisbackend.dto.PlayCardRequest;
import com.nilay.lorrisbackend.dto.TrumpRequest;
import com.nilay.lorrisbackend.model.Card;
import com.nilay.lorrisbackend.model.Game;
import com.nilay.lorrisbackend.model.GameStatus;
import com.nilay.lorrisbackend.model.Player;
import com.nilay.lorrisbackend.service.GameService;



@RestController
@RequestMapping("/games")
public class GameController {


    private final GameService gameService;



    public GameController(GameService gameService){

        this.gameService = gameService;

    }






    // Create game

    @PostMapping
    public Game createGame(){

        return gameService.createGame();

    }







    // Get game state

    @GetMapping("/{gameId}")
    public Game getGame(
            @PathVariable String gameId
    ){

        return gameService.getGame(gameId);

    }








    // Join game

    @PostMapping("/{gameId}/join")
    public Game joinGame(
            @PathVariable String gameId,
            @RequestBody JoinGameRequest request
    ){


        return gameService.joinGame(
                gameId,
                request.getPlayerName()
        );


    }







    // Players list

    @GetMapping("/{gameId}/players")
    public List<Player> getPlayers(
            @PathVariable String gameId
    ){


        return gameService.getPlayers(gameId);


    }








    // Player hand

    @GetMapping("/{gameId}/players/{playerName}/hand")
    public List<Card> getHand(
            @PathVariable String gameId,
            @PathVariable String playerName
    ){


        return gameService.getPlayerHand(
                gameId,
                playerName
        );


    }







    // Status

    @GetMapping("/{gameId}/status")
    public GameStatus status(
            @PathVariable String gameId
    ){

        return gameService.getGame(gameId)
                .getStatus();

    }







    // Bid

    @PostMapping("/{gameId}/bid")
    public Game bid(
            @PathVariable String gameId,
            @RequestBody BidRequest request
    ){


        return gameService.placeBid(
                gameId,
                request.getPlayerName(),
                request.getBid()
        );


    }








    // Choose trump

    @PostMapping("/{gameId}/trump")
    public Game trump(
            @PathVariable String gameId,
            @RequestBody TrumpRequest request
    ){


        return gameService.chooseTrump(
                gameId,
                request.getPlayerName(),
                request.getTrump()
        );


    }








    // Play card

    @PostMapping("/{gameId}/play")
    public Game play(
            @PathVariable String gameId,
            @RequestBody PlayCardRequest request
    ){


        Card card =
                new Card(
                        request.getSuit(),
                        request.getRank()
                );



        return gameService.playCard(
                gameId,
                request.getPlayerName(),
                card
        );


    }

    @PostMapping("/{gameId}/next-round")
        public Game nextRound(

                @PathVariable String gameId

        ){

        return gameService.nextRound(gameId);

        }



}