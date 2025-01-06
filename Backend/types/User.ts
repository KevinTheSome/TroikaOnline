export interface User {
        id: number | undefined;
        username: string;
        password: string;
    }

export function createUser(id: number | undefined, username: string, password: string): User {
    return {id, username, password};
}