import { Context } from "hono";
import { SqlDataBase } from "../db/dbClass.ts";
import { Player } from "../types/Player.ts";
import { Game } from "../controller/GameLogic.ts";
import { WSContext } from "hono/ws";


export class wsHandeler {
    private playerList = new Map<string, [WSContext | undefined, string | undefined]>()
    private gameList = new Map<string, Game>()

    private GetPLayersInLobby(lobbyCode: string): string[] {
        const players: string[] = []
        for (const [playerName, playerData] of this.playerList.entries()) {   //I love ai ;3
            if (playerData[1] === lobbyCode) {
                players.push(playerName)
            }
        }
        return players  
    }

    private sendToLobby(gameState: string, data: string|object,lobbyCode: string){
        for (const [_playerName, playerData] of this.playerList.entries()) {   //I love ai ;3
            if (playerData[1] === lobbyCode) {
                console.log("sent: " + JSON.stringify({gameState: gameState, data: data} + " to " + lobbyCode))
                playerData[0]?.send(JSON.stringify({gameState: gameState, data: data}));
            }
        }
    }
    connectionCloseHandeler(ctx: Context, _db: SqlDataBase){
        return ctx.json({message: "Connection closed" , error: ""})
    }

    connectionErrorHandeler(event: Event, ws: WSContext){
        console.log("There was an error in the connectixon : " + event.type)
        ws.close()
        return ws.send(JSON.stringify({message: "There was an error in the connection : " + event.type , error: event.type}))
    }



    onMessageHandeler(ctx: Context, db: SqlDataBase, ws: WSContext, event: MessageEvent){
        
        const message = JSON.parse(event.data)
        const clientData = JSON.parse(message["data"])
        const lobbyCode = ctx.req.param('lobbyCode')
        const lobby = db.getLobby(lobbyCode)

        if(lobby == undefined || lobby == null || lobby.length == 0){
            // return ctx.json({message: "Lobby not found" , error: "Lobby not found error"})
            console.log("Lobby not found")
            ws.close()
            return ws.send(JSON.stringify({message: "Lobby not found" , error: "Lobby not found error"}))
        }

        console.log("Client gameAction: " + message["gameAction"] + " data: " + message["data"] + " lobbyCode: " + lobbyCode)

        switch (message["gameAction"]) {
            case "Login":
                console.log("Login from: " + clientData.token + " username: " + clientData.username)
                this.playerList.set(clientData["token"], [ws, lobbyCode])
                db.updateLobby(lobbyCode, lobby[0].players + 1, lobby[0].public)
                this.sendToLobby("LobbyUpdate", {"type": "Login" , "username": clientData["username"]} , lobbyCode)
                break;
            case "Leave":
                this.playerList.delete(clientData["token"])
                this.sendToLobby("LobbyUpdate", {"type": "Leave" , "username": clientData["username"]} , lobbyCode)

                db.updateLobby(lobbyCode, lobby[0].players - 1, lobby[0].public)
                if(db.getLobby(lobbyCode)[0].players == 0){ //go f yourself TS 
                    db.delLobby(lobbyCode)
                }
                break;
            case "Start":
                this.sendToLobby("Start", {"message": "Game started"} , lobbyCode)
                this.gameList.set(lobbyCode, new Game(lobbyCode,this.GetPLayersInLobby(lobbyCode)))
                db.delLobby(lobbyCode)
                console.log(this.gameList)
                break;
            case "End":
                this.sendToLobby("End", {"message": "Game ended"} , lobbyCode)
                this.playerList.delete(clientData["token"])
                this.gameList.delete(lobbyCode)
                db.delLobby(lobbyCode)
                break;
            case "GameTurn":
                this.sendToLobby("GameTurn", {"username": clientData["username"],"move": clientData["move"]} , lobbyCode)

                break;
            case "Test":
                this.sendToLobby("Test", "Hello evryone in the lobby " + lobbyCode, lobbyCode)
                break;
            default:
                console.log("Unknown gameAction: " + message["gameAction"] + " data: " + clientData + " lobbyCode: " + lobbyCode)
                break;
        }


    }

    async handleConnection(ctx: Context, db: SqlDataBase){
        return {
            onMessage: (event : MessageEvent, ws : WSContext) => {
                return this.onMessageHandeler(ctx, db, ws, event)
            },
            onClose: () => {
                return this.connectionCloseHandeler(ctx, db)
            },
            onError: (event : MessageEvent, ws : WSContext) => {
                return this.connectionErrorHandeler(event, ws)
            }
        }

    }
}




    