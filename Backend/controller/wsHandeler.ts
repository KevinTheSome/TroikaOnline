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
            case "Start":
                console.log(`Message from client: ${event.data}`)
                break;
            case "Test":
                this.sendToLobby("Test", "Hello evryone in the lobby " + lobbyCode, lobbyCode)
                break;
            case "End":
                console.log(`Message from client: ${event.data}`)
                break;
            case "YourTurn":
                console.log(`Message from client: ${event.data}`)
                break;
            case "OpponentTurn":
                console.log(`Message from client: ${event.data}`)
                break;
            case "Leave":
                this.playerList.delete(message["data"])
                this.sendToLobby("LobbyUpdate", message["data"], lobbyCode)
                break;
            case "Login":
                console.log("Login from: " + message.data.token + " username: " + message.data.username)
                this.playerList.set(message["data"]["token"], [ws, lobbyCode])
                this.sendToLobby("LobbyUpdate", {"type": "Login" , "username": message["data"]["username"]} , lobbyCode)
                break;
            default:
                console.log(`Message from client: ${event.data}`)
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




    