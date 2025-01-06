import { Hono , Context } from 'hono'
import { upgradeWebSocket } from 'hono/deno'

import { missingRoute } from "./controller/missingRoute.ts";
import { testRoute } from "./controller/testRoute.ts";
import { Card } from "./types/Card.ts";
import { User, createUser } from "./types/User.ts";
import {SqlDataBase} from "./db/dbClass.ts";


const db = new SqlDataBase()  //Db
const app = new Hono()  //Routers

app.get('/', (c: Context) => {          //TODO remove or make in to something
    return c.text('Hello Troika player!')
  })

app.get('/signup', (c: Context) => {    //TODO make a user and ridirect to login
  return c.text('Hello Hono!')
})

app.get('/signin', (c: Context) => {    //TODO return token
  return c.text('Hello Hono!')
})

app.get('/user', (c: Context) => {      //TODO return user stats example wins looses
  return c.text('Hello Hono!')
})

app.get('/newLobby', (c: Context) => {  //TODO easy shit make a lobby in db
  return c.text('Hello Hono!')
})

app.get('/join', (c: Context) => {      //TODO remove or use to make join
  return c.text('Hello Hono!')
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
