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
    data: string,
};

// For the Frontend

export enum gameAction {
    Join,
    Leave,
    Move,
    Login,
}

export type userEvent = {
    gameAction: gameAction,
    data: string,
};