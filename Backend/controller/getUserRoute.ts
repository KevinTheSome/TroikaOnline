import { Context } from "hono";
import { SqlDataBase } from "../db/dbClass.ts";

export function getUserRoute(ctx: Context , db: SqlDataBase){
    const username = ctx.req.param('username')
    const player = db.getPlayersStats(username)
    return ctx.json(player)

}