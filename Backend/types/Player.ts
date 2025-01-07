export interface Player {
        id: number | undefined;
        username: string;
        password: string;
        wins: number | undefined;
        losses: number | undefined;
    }

export function newPlayer(id: number | undefined, username: string, password: string): Player {
    return {id, username, password , wins: 0, losses: 0};
}