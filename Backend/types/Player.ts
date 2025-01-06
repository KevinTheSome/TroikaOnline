export interface Player {
        id: number | undefined;
        username: string;
        password: string;
    }

export function newPlayer(id: number | undefined, username: string, password: string): Player {
    return {id, username, password};
}