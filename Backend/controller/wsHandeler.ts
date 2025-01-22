import { Context } from "hono";
import { SqlDataBase } from "../db/dbClass.ts";
import { Player } from "../types/Player.ts";
import { WSContext } from "hono/ws";


export class wsHandeler {
    private playerList = new Map<string, [WSContext | undefined, string | undefined]>()
    private lobbyList = []

    private sendToLobby(gameState: string, data: string|object,lobbyCode: string){
        for (const [playerName, playerData] of this.playerList.entries()) {   //I love ai ;3
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
                this.sendToLobby("LobbyUpdate", {"type": "Login" , "username": clientData["username"]} , lobbyCode)
                break;
            case "Leave":
                this.playerList.delete(clientData["token"])
                this.sendToLobby("LobbyUpdate", {"type": "Leave" , "username": clientData["username"]} , lobbyCode)
                break;
            case "Start":
                this.sendToLobby("Start", {"message": "Game started"} , lobbyCode)
                break;
            case "End":
                this.sendToLobby("End", {"message": "Game ended"} , lobbyCode)
                this.playerList.delete(clientData["token"])
                db.delLobby(lobbyCode)
                break;
            case "YourTurn":
                console.log(`Message from client: ${event.data}`) //todo maybe make in one call
                break;
            case "OpponentTurn":
                console.log(`Message from client: ${event.data}`) //todo maybe make in one call
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




    