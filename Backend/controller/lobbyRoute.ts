import { Context } from "hono";
import { SqlDataBase } from "../db/dbClass.ts";

export async function newLobbbyRoute(ctx: Context , db: SqlDataBase){
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const body = await ctx.req.parseBody()
    let pBool = undefined

    if(body.pBool == undefined){
        return ctx.text("Private bool not found" , 404)
    }

    if(body.pBool != "true" && body.pBool != "false"){
        return ctx.text("Private bool not valid" , 404)
    }

    if(body.pBool == "true"){  //quick fix
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
    
    return ctx.text("Lobby created" , 200)
}

export async function joinLobbbyRoute(ctx: Context){
    const body = await ctx.req.parseBody()
    const code = String(body.code).trim() //If the code is not valid it will throw an error and something
    return ctx.text("Lobby joined" , 200)
}

export async function explorLobby(ctx: Context, db: SqlDataBase){
    const lobbys = db.getPublicLobby()

    if(lobbys == undefined || lobbys == null || lobbys.length == 0){
        return ctx.text("No lobbys found" , 404)
    }

    return ctx.json(lobbys)
}