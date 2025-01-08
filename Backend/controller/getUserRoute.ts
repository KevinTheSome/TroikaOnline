import { Context } from "hono";
import { SqlDataBase } from "../db/dbClass.ts";

export function getUserRoute(ctx: Context , db: SqlDataBase){
    const username = ctx.req.param('username')
    const player = db.getPlayersStats(username)
    
    if(player == undefined || player == null || player.length == 0){
        return ctx.json({message: "User not found" , error: "User not found error"})
    }

    return ctx.json(player)

}