import { Context } from "hono";
import { encodeHex } from "jsr:@std/encoding/hex";
import { SqlDataBase } from "../db/dbClass.ts";
import { newPlayer } from "../types/Player.ts";

export async function signupRoute(ctx: Context, db: SqlDataBase){

    const username = ctx.req.param('username')
    const password = ctx.req.param('password')
    const passwordConfirme = ctx.req.param('passwordConfirme')

    if(password != passwordConfirme){
        return ctx.text("Password don't match" , 403)
    }else{

        const messageBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
        const hash = encodeHex(hashBuffer);
        
        db.newPlayer(newPlayer(undefined, username, hash))
        return ctx.text("User created" , 200)
    }
}