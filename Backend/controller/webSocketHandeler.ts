import { Context } from "hono";
import { encodeHex } from "jsr:@std/encoding/hex";
import { SqlDataBase } from "../db/dbClass.ts";
import { Player } from "../types/Player.ts";
import { WSContext } from "hono/ws";


export async function connectionCloseHandeler(ctx: Context, db: SqlDataBase){
    return ctx.json({message: "Connection closed" , error: ""})
}

export function connectionErrorHandeler(event: Event, ws: WSContext){
    console.log("There was an error in the connection : " + event.type)
    return ws.send(JSON.stringify({message: "There was an error in the connection : " + event.type , error: event.type}))
}

export async function onMessageHandeler(ctx: Context, db: SqlDataBase, ws: WSContext, event: MessageEvent){
    const playerList = new Map<string, Player>() //fuck

    const lobbyCode = ctx.req.param('lobbyCode')

    const lobby = db.getLobby(lobbyCode)

    if(lobby == undefined || lobby == null || lobby.length == 0){
        // return ctx.json({message: "Lobby not found" , error: "Lobby not found error"})
        console.log("Lobby not found")
        ws.send(JSON.stringify({message: "Lobby not found" , error: "Lobby not found error"}))
        
        
    }
    
    console.log("Message from client: " + event.data)
    ws.send(JSON.stringify({message: "Message from client: " + event.data , error: ""}))
    

    
    

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