import { Context } from "jsr:@oak/oak";
import { Card , createCard } from "../types/Card.ts";

export function testRoute(ctx: Context): string {
  Math.random();

  if(Math.random() > 0.5) {
    return JSON.stringify(createCard("2_clubs"));
  }else{
    return JSON.stringify(createCard("r_jocker"));
  }
  
}