import "jsr:@std/dotenv/load";

import { Hono , Context } from 'hono'
import { upgradeWebSocket } from 'hono/deno'

import { missingRoute } from "./controller/missingRoute.ts";
import { signupRoute } from "./controller/signupRoute.ts";
import { signinRoute } from "./controller/signinRoute.ts";
import { getUserRoute } from "./controller/getUserRoute.ts";
import { newLobbbyRoute , joinLobbbyRoute , explorLobby } from "./controller/lobbyRoute.ts";

import { Card } from "./types/Card.ts";
import {SqlDataBase} from "./db/dbClass.ts";


const db = new SqlDataBase()    //Db
const app = new Hono()          //Routers

//@ts-ignore: we got a null operator on it I dont think it can be undefined
const port = +Deno.env.get("PORT") || 8000  
const hostname = Deno.env.get("HOSTNAME") || "127.0.0.1"

app.get('/', (c: Context) => {                  //TODO remove or make in to something
    return c.text('Hello Troika player!')
  })

app.post('/signup', (c: Context) => {           
  return signupRoute(c, db)
})

app.post('/signin', (c: Context) => {           
  return signinRoute(c, db)
})

app.get('/user/:username', (c: Context) => {      
  return getUserRoute(c, db)
})

app.post('/lobby/new', (c: Context) => {        
  return newLobbbyRoute(c , db)
})

app.post('/lobby/join', (c: Context) => {        //TODO remove or use to make join
  return joinLobbbyRoute(c)
})

app.get('/explor', (c: Context) => {          
  return explorLobby(c , db)
})

app.get(                                        //TODO pain
  '/ws',
  upgradeWebSocket((c:Context) => {
    return {
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`)
        ws.send('Hello from server!')
      },
      onClose: () => {
        console.log('Connection closed')
      },
    }
  })
)

app.notFound((c: Context) => {      
  return missingRoute(c)
})


// Deno.serve({ port: 8000, hostname:"127.0.0.1" } , app.fetch)

Deno.serve({ port: port, hostname: hostname } , app.fetch)
