import { Context } from "hono";
import { encodeHex } from "jsr:@std/encoding/hex";
import { SqlDataBase } from "../db/dbClass.ts";
import { newPlayer } from "../types/Player.ts";

export async function signupRoute(ctx: Context, db: SqlDataBase){

    const body = await ctx.req.parseBody()
    const username = String(body.username).trim()
    const password = String(body.password).trim()
    const passwordConfirme = String(body.passwordConfirme)

    if(password != passwordConfirme){
        return ctx.text("Password don't match" , 403)
    }else{

        const messageBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
        const hash = encodeHex(hashBuffer);

        try {
            db.newPlayer(newPlayer(undefined, username, hash))
        } catch (error) {
            return ctx.text("User already exists error: " + error + " " + username + " " + hash , 404)
        }

        
        return ctx.text("User created" , 200)
    }
}