export type Card = {
    card: string;
};

export function createCard(string: string = ""): Card {
    return {card: string};
  }