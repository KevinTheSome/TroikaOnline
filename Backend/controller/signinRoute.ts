import { Context } from "hono";
import { encodeHex } from "jsr:@std/encoding/hex";
import { SqlDataBase } from "../db/dbClass.ts";
import { Player } from "../types/Player.ts";

export async function signinRoute(ctx: Context, db: SqlDataBase){

    const body = await ctx.req.parseBody()
    const username = String(body.username).trim()
    const password = String(body.password).trim()
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
        return ctx.text("User not found by name: " + username , 404)
    }
    
    return ctx.json(player)
}