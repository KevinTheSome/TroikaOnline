import { Database } from "jsr:@db/sqlite";
import { Player } from "../types/Player.ts";
import { Lobby } from "../types/Lobby.ts";

export class SqlDataBase {
    private db:Database 


    constructor() {
        this.db = new Database("db/db.db");
        this.db.prepare(
            `
              CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT ,
                wins INTEGER NOT NULL DEFAULT 0,
                losses INTEGER NOT NULL DEFAULT 0
              );
            `
          ).run();
          this.db.prepare(
            `
            CREATE TABLE IF NOT EXISTS lobbies (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              code TEXT NOT NULL UNIQUE,
              players INTEGER NOT NULL DEFAULT 0,
              public BOOLEAN NOT NULL
            );
          `
          ).run();          
    }


    newPlayer(user:Player): void {
        this.db.prepare(
            `
              INSERT INTO players (username, password) VALUES (?, ?);
            `,
          ).run(user.username, user.password);
    }

    getPlayers(username:string): Player[] | undefined {
        const stmt = this.db.prepare("SELECT * FROM players WHERE username= ? ;");
        // stmt.run(username);
        return stmt.all<Player>(username);
    }

    getPlayersStats(username:string): Player[] | undefined {   //TODO fix this it dont work :(
      const stmt = this.db.prepare("SELECT username , wins , losses FROM players WHERE username= ? ;");
      // stmt.run(username);
      return stmt.all<Player>(username);
  }

    delPlayer(id:number): void {
      const stmt =this.db.prepare(`DELETE FROM players WHERE id = ?;`,)
      stmt.run(id);
      return 
    }

    newLobby(publicBool:boolean , code:string): void {
      const stmt = this.db.prepare(`INSERT INTO lobbies (public, code , players) VALUES (?, ?, 0);`)
      stmt.run(publicBool, code);
    }

    getPublicLobby(): Record<string, any>[] | undefined {
      const stmt = this.db.prepare(`SELECT * FROM lobbies WHERE public = 1;`)
      return  stmt.all();
    }

    getLobby(code:string): Record<string, any>[] | undefined {
      const stmt = this.db.prepare(`SELECT * FROM lobbies WHERE code = ?;`)
      return stmt.all<Lobby>(code);
    }

    updateLobby(code:string , players:number , publicBool:boolean): Record<string, any>[] | undefined {
      const stmt = this.db.prepare(`UPDATE lobbies SET players = ? , public = ? WHERE code = ?;`)
      return stmt.all<Lobby>(players , publicBool , code);
    }

    delLobby(code:string): Record<string, any>[] | undefined {
      const stmt = this.db.prepare(`DELETE FROM lobbies WHERE code = ?;`)
      return stmt.all<Lobby>(code);
    }

}



