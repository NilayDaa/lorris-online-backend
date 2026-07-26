package com.nilay.lorrisbackend.dto;

import com.nilay.lorrisbackend.model.Game;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GameUpdate {

    private String type;

    private Game game;

}