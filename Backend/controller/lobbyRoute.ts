import { Context } from "hono";
import { SqlDataBase } from "../db/dbClass.ts";

export async function newLobbbyRoute(ctx: Context , db: SqlDataBase){
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const json = await ctx.req.json()
    let pBool = undefined

    if(json.pBool == undefined){
        return ctx.json({message: "Private bool not found" , error: "Private bool not found, use pBool"})
    }

    if(json.pBool != "true" && json.pBool != "false"){
        return ctx.json({message: "Private bool is not valid" , error: "Private bool not is not valid"})
    }

    if(json.pBool == "true"){  //quick fix
        pBool = false
    }else{
        pBool = true
    }

    let code = ''

    for (let i = 0; i < 6; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    try{
        db.newLobby(pBool , code)
    } catch (_error) {
        db.newLobby(pBool , code)
    }
    
    return ctx.json({message: "Lobby created" , error: ""})
}

export async function joinLobbbyRoute(ctx: Context,db: SqlDataBase){

    const json = await ctx.req.json()
    const userToken = String(json.userToken).trim()
    const lobbyCode = String(json.lobbyCode).trim()

    if(userToken == "" || userToken == null || userToken == undefined || lobbyCode == "" || lobbyCode == null || lobbyCode == undefined){
        return ctx.text("All fields are required" , 404)
    }

    const lobbys = db.getLobby(lobbyCode)

    if(lobbys == undefined || lobbys == null || lobbys.length == 0){
        return ctx.text("No lobby found" , 404)
    }

    if(lobbys[0].players >= 4){                             //Hard coded lobby size 😓
        return ctx.text("Lobby is full" , 404)
    }

    db.updateLobby(lobbyCode , lobbys[0].players + 1, lobbys[0].public)

    return ctx.json({message: "Lobby joined" , code: lobbyCode , playerCount: lobbys[0].players, error: ""})
}

export function explorLobby(ctx: Context, db: SqlDataBase){
    const lobbys = db.getPublicLobby()

    if(lobbys == undefined || lobbys == null || lobbys.length == 0){
        return ctx.text("No lobbys found" , 404)
    }

    return ctx.json(lobbys)
}