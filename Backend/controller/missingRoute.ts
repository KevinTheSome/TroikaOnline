import { Context } from "hono";

export function missingRoute(ctx: Context){
    return ctx.text("The route dosn't not exists " + ctx.req.url + " on method " + ctx.req.method ,404)
} 