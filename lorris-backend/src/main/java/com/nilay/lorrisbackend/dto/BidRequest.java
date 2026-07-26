package com.nilay.lorrisbackend.dto;

public class BidRequest {

    private String playerName;
    private int bid;

    public BidRequest() {
    }

    public BidRequest(String playerName, int bid) {
        this.playerName = playerName;
        this.bid = bid;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public int getBid() {
        return bid;
    }

    public void setBid(int bid) {
        this.bid = bid;
    }
}