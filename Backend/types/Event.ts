// For the Backend

export enum gameState {
    Lobby,
    Start,
    End,
    YourTurn,
    OpponentTurn,
}

export type Event = {
    gameState: gameState,
    lobbyToken: string,
};

// For the Frontend

export enum gameAction {
    Join,
    Leave,
    Move,
}

export type userEvent = {
    gameAction: gameAction,
    userToken: string,
};