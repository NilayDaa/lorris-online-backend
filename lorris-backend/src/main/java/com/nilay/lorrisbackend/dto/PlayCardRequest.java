package com.nilay.lorrisbackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayCardRequest {

    private String playerName;

    private String suit;

    private String rank;

}