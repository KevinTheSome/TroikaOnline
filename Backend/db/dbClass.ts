import { Database } from "jsr:@db/sqlite";
import { Player } from "../types/Player.ts";

export class SqlDataBase {
    private db:Database 


    constructor() {
        this.db = new Database("db/db.db");
        this.db.prepare(
            `
              CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
              );

              CREATE TABLE IF NOT EXISTS lobbies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                public BOOLEAN NOT NULL,
                code TEXT NOT NULL UNIQUE
              );
            `,
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
      const stmt = this.db.prepare("SELECT * FROM players WHERE username= ? ;");
      // stmt.run(username);
      return stmt.all<Player>(username);
  }

    delPlayer(id:number): void {
      const stmt =this.db.prepare(`DELETE FROM players WHERE id = ?;`,)
      stmt.run(id);
      return 
    }

    delDB(): void { //TODO make it nuke evrything
        this.db.close();
    }

    deconnect(): void {
        this.db.close();
    }


}



