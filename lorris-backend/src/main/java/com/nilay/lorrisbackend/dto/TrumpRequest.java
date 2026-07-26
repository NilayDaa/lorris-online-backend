package com.nilay.lorrisbackend.dto;

public class TrumpRequest {

    private String playerName;
    private String trump;

    public TrumpRequest() {
    }

    public TrumpRequest(String playerName, String trump) {
        this.playerName = playerName;
        this.trump = trump;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getTrump() {
        return trump;
    }

    public void setTrump(String trump) {
        this.trump = trump;
    }
}