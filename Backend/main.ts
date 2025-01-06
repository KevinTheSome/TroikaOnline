import { Hono , Context } from 'hono'
import { upgradeWebSocket } from 'hono/deno'

import { missingRoute } from "./controller/missingRoute.ts";
import { signupRoute } from "./controller/signupRoute.ts";
import { signinRoute } from "./controller/signinRoute.ts";
import { getUserRoute } from "./controller/getUserRoute.ts";
import { newLobbbyRoute , joinLobbbyRoute } from "./controller/lobbyRoute.ts";



import { Card } from "./types/Card.ts";
import {SqlDataBase} from "./db/dbClass.ts";


const db = new SqlDataBase()  //Db
const app = new Hono()  //Routers

app.get('/', (c: Context) => {          //TODO remove or make in to something
    return c.text('Hello Troika player!')
  })

app.post('/signup', (c: Context) => {    //TODO make a user and ridirect to login
  return signupRoute(c, db)
})

app.post('/signin', (c: Context) => {    //TODO return token
  return signinRoute(c, db)
})

app.get('/user/:username', (c: Context) => {      //TODO return user stats example wins looses
  return getUserRoute(c, db)
})

app.post('/newLobby', (c: Context) => {  //TODO easy shit make a lobby in db and rerout join
  return newLobbbyRoute(c)
})

app.post('/join/:uid', (c: Context) => {      //TODO remove or use to make join
  return joinLobbbyRoute(c)
})

app.get('/explorer', (c: Context) => {  //TODO return all not private lobbies
  return c.text('Hello Hono!')
})

app.get(  //TODO pain
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

app.notFound((c: Context) => {      //TODO return 404
  return missingRoute(c)
})


Deno.serve({ port: 8000, hostname:"127.0.0.1" } , app.fetch)
