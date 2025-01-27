import { ESuits } from "../types/Game.ts";

//thank you to https://github.com/sudbasnet/Callbreak-Backend-Node-Typescript for the deck code

export class Game {
    
    deck: Card[] = Deck.getFullCardDeck();
    players: string[] = [];

    // constructor(
    //     public players: string[]
    // )
}



export class Card {
    constructor(
        public suit: ESuits,
        public value: string,
        public playedBy: string = ''
    ) { }

    numericValue(): number {
        let num: number;
        try {
            if (this.value === 'jack') {
                num = 11;
            } else if (this.value === 'queen') {
                num = 12;
            } else if (this.value === 'king') {
                num = 13;
            } else if (this.value === 'ace') {
                num = 14
            } else {
                num = +this.value
            }
        } catch (err:any) {
            throw new Error(err.message);
        }
        return num
    }
}

function randomLocation(len: number): number {
    return Math.floor(Math.random() * Math.floor(len));
}

function compareCards(cardA: Card, cardB: Card) {
    if (cardA.suit === cardB.suit) {
        if (cardA.numericValue() > cardB.numericValue()) {
            return -1;
        } else {
            return 0;
        }
    } else if (cardA.suit === ESuits.SPADES) {
        return -1;
    } else if (cardA.suit === ESuits.HEARTS && cardB.suit != ESuits.SPADES) {
        return -1;
    } else if (cardA.suit === ESuits.CLUBS && cardB.suit != ESuits.SPADES && cardB.suit != ESuits.HEARTS) {
        return -1;
    } else {
        return 0;
    }
}

export class Deck{

    static suites: ESuits[] = [ESuits.HEARTS, ESuits.SPADES, ESuits.DIAMONDS, ESuits.CLUBS];
    static cardValues: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', "ace", "king", "queen", "jack"];

    static getFullCardDeck(): Card[] {
        const deck: Card[] = [];
        Deck.suites.forEach(
            suit => Deck.cardValues.forEach(
                cardValue => deck.push(new Card(suit, cardValue))
            )
        );
        return deck;
    }

    static calculateCallbreakWinner(cardA: Card, cardB: Card, playingSuit: ESuits): Card {
        cardA = new Card(cardA.suit, cardA.value, cardA.playedBy)
        cardB = new Card(cardB.suit, cardB.value, cardB.playedBy)

        if (cardA.suit === cardB.suit) {
            return cardA.numericValue() > cardB.numericValue() ? cardA : cardB
        } else if (cardA.suit === ESuits.SPADES) {
            return cardA
        } else if (cardB.suit === ESuits.SPADES) {
            return cardB
        } else if (cardA.suit === playingSuit) {
            return cardA
        } else {
            return cardB
        }
    };

    static dealCards(numberOfCards: number, numberOfPlayers: number): { arrayOfDealtCards: Card[][], remainingCards: Card[] } {
        // eg: to deal 5 cards to 3 players, dealCards(5, 3)
        const deck = Deck.getFullCardDeck();
        const dealtCards: Card[][] = [];
        let i = 0;
        while (i < numberOfPlayers) {
            dealtCards.push([]);
            i++;
        }
        let cardsDealt = 0;
        let randomPosition = 0;
        let randomCard: Card;
        while (deck.length > 0 && cardsDealt < numberOfCards * numberOfPlayers) {
            randomPosition = randomLocation(deck.length);
            randomCard = deck[randomPosition];
            dealtCards[cardsDealt % numberOfPlayers].push(randomCard);
            deck.splice(randomPosition, 1); // remove 1 card from position "randomPosition"
            cardsDealt++;
        }
        const dealtCardsSorted = dealtCards.map(c => c.sort(compareCards));
        return {
            arrayOfDealtCards: dealtCardsSorted,
            remainingCards: deck
        };
    }

}