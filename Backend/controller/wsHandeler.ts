import { Context } from "hono";
import { SqlDataBase } from "../db/dbClass.ts";
import { Player } from "../types/Player.ts";
import { WSContext,UpgradeWebSocket,WSReadyState } from "hono/ws";

export class wsHandeler {
    private playerList = new Map<Number, WSContext | undefined>()


    async connectionCloseHandeler(ctx: Context, db: SqlDataBase){
        return ctx.json({message: "Connection closed" , error: ""})
    }

    connectionErrorHandeler(event: Event, ws: WSContext){
        console.log("There was an error in the connectixon : " + event.type)
        ws.close()
        return ws.send(JSON.stringify({message: "There was an error in the connection : " + event.type , error: event.type}))
    }

    async onMessageHandeler(ctx: Context, db: SqlDataBase, ws: WSContext, event: MessageEvent){
        this.playerList.set(Math.random(), ws) //test
        
        const message = JSON.parse(event.data)
        const lobbyCode = ctx.req.param('lobbyCode')

        const lobby = db.getLobby(lobbyCode)

        if(lobby == undefined || lobby == null || lobby.length == 0){
            // return ctx.json({message: "Lobby not found" , error: "Lobby not found error"})
            console.log("Lobby not found")
            ws.close()
            return ws.send(JSON.stringify({message: "Lobby not found" , error: "Lobby not found error"}))
        }

        console.log("Message from client: " + event.data)
        console.log(this.playerList)
        for(const player of this.playerList.values()){
            player.send(JSON.stringify({message: "LobbyUpdate" , lobby: lobby[0]}))
        }

        // switch (event.data.gameState) {
        //     case "Lobby":
        //         console.log(`Message from client: ${event.data}`)
        //         break;
        //     case "Start":
        //         console.log(`Message from client: ${event.data}`)
        //         break;
        //     case "End":
        //         console.log(`Message from client: ${event.data}`)
        //         break;
        //     case "YourTurn":
        //         console.log(`Message from client: ${event.data}`)
        //         break;
        //     case "OpponentTurn":
        //         console.log(`Message from client: ${event.data}`)
        //         break;
        //     case "Join":
        //         console.log(`Message from client: ${event.data}`)
        //         break;
        //     case "Leave":
        //         console.log(`Message from client: ${event.data}`)
        //         break;
        //     case "Move":
        //         console.log(`Message from client: ${event.data}`)
        //         break;
        //     default:
        //         console.log(`Message from client: ${event.data}`)
        //         break;
        // }
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




    