import { Context } from "hono";
import { encodeHex } from "jsr:@std/encoding/hex";
import { SqlDataBase } from "../db/dbClass.ts";
import { Player } from "../types/Player.ts";

export async function signinRoute(ctx: Context, db: SqlDataBase){

    const json = await ctx.req.json()
    const username = String(json.username).trim()
    const password = String(json.password).trim()
    let player : Record<string, any>[] | undefined
    
    

    const messageBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
    const hash = encodeHex(hashBuffer);

    try {
        player = db.getPlayers(username)
    } catch (error) {
        return ctx.text(String(error) , 404)
    }

    if(player == undefined || player == null || player.length == 0){
        return ctx.json({message: "User not found" , error: "User not found error"})
    }
    
    if(player[0].password != hash){
        return ctx.json({message: "Password don't match" , error: "Password don't match error"})
    }else{
        const tokenBuffer = new TextEncoder().encode(player[0].username + player[0].password);
        const hashTokenBuffer = await crypto.subtle.digest("SHA-256", tokenBuffer);
        const Token = encodeHex(hashTokenBuffer);
        return ctx.json({message: "User found" , token: Token ,username: player[0].username, wins: player[0].wins, losses: player[0].losses, error: ""})
    }


    // return ctx.json(player)








}