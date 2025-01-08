import { Context } from "hono";
import { encodeHex } from "jsr:@std/encoding/hex";
import { SqlDataBase } from "../db/dbClass.ts";
import { newPlayer } from "../types/Player.ts";

export async function signupRoute(ctx: Context, db: SqlDataBase){

    const json = await ctx.req.json()
    const username = String(json.username).trim()
    const password = String(json.password).trim()
    const passwordConfirme = String(json.passwordConfirme)

    if(username == "" || username == null || username == undefined || password == "" || password == null || password == undefined || passwordConfirme == "" || passwordConfirme == null || passwordConfirme == undefined){
        return ctx.json({message: "All fields are required" , error: "All fields are required error"})
    }


    if(password != passwordConfirme){
        return ctx.json({message: "Password don't match" , error: "Password don't match error"})
    }else{

        const messageBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
        const hash = encodeHex(hashBuffer);

        try {
            db.newPlayer(newPlayer(undefined, username, hash))
        } catch (_error) {
            return ctx.json({message: "User already exists" , error: "User already exists error"})
        }

        
        return ctx.json({ message: "User created" , error: ""})
    }
}