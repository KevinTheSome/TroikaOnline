import { Context } from "hono";
import { encodeHex } from "jsr:@std/encoding/hex";
import { SqlDataBase } from "../db/dbClass.ts";
import { Player } from "../types/Player.ts";

export async function signinRoute(ctx: Context, db: SqlDataBase){

    const username = ctx.req.param('username')
    const password = ctx.req.param('password')

    const messageBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
    const hash = encodeHex(hashBuffer);

    const player = db.getPlayers(username)

    if(hash != player[0].password){
        return ctx.text("Password don't match" , 403)
    }else{
        return ctx.text("" , 200) //idk user token but how do i make a user token?
    }
}