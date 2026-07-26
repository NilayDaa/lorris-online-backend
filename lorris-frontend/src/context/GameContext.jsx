import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {

    const [game, setGame] = useState(null);
    const [playerName, setPlayerName] = useState("");

    return (
        <GameContext.Provider
            value={{
                game,
                setGame,
                playerName,
                setPlayerName,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    return useContext(GameContext);
}