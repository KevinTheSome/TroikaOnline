import { Context } from "hono";

export function newLobbbyRoute(ctx: Context){
    return ctx.text("The route dosn't not exists " + ctx.req.url + " on method " + ctx.req.method ,404)
}

export function joinLobbbyRoute(ctx: Context){
    return ctx.text("The route dosn't not exists " + ctx.req.url + " on method " + ctx.req.method ,404)
}