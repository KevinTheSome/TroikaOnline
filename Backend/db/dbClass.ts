import { Database } from "jsr:@db/sqlite";
import { User } from "../types/User.ts";

export class SqlDataBase {
    private db:Database 


    constructor() {
        this.db = new Database("db/db.db");
        this.db.prepare(
            `
              CREATE TABLE IF NOT EXISTS players (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT,
                password TEXT
              );
            `,
          ).run();
    }


    newPlayer(user:User): void {
        this.db.prepare(
            `
              INSERT INTO players (username, password) VALUES (?, ?);
            `,
          ).run(user.username, user.password); //todo encrypt this password
    }

    getPlayers(username:string): Record<string, any>[] {
        const stmt = this.db.prepare("SELECT * FROM players WHERE username = ?");
        stmt.run(username);
        return stmt.all();
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



