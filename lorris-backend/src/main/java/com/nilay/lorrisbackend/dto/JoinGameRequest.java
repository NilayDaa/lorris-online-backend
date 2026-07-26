package com.nilay.lorrisbackend.dto;

public class JoinGameRequest {

    private String playerName;

    public JoinGameRequest() {
    }

    public JoinGameRequest(String playerName) {
        this.playerName = playerName;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }
}