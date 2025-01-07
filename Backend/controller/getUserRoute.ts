import { Context } from "hono";
import { SqlDataBase } from "../db/dbClass.ts";

export function getUserRoute(ctx: Context , db: SqlDataBase){
    const username = ctx.req.param('username')
    const player = db.getPlayersStats(username)
    
    if(player == undefined || player == null || player.length == 0){
        return ctx.text("User not found by name: " + username , 404)
    }

    return ctx.json(player)

}