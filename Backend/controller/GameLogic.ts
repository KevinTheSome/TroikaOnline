import { ESuits, EStatus } from "../types/Game.ts";

//thank you to https://github.com/sudbasnet/Callbreak-Backend-Node-Typescript for the deck code

export class Game {
    
    deck: Card[] = Deck.getFullCardDeck();
    activeDeck: Card[] = [];
    playedDeck: Card[] = [];
    winner: string = "";

    activePlayer: string = "";
    players: string[] = [];
    status: EStatus = EStatus.STARTED

    constructor(
        public lobbycode: string,
        public playerArr: string[]
    )
    {
        this.players = this.playerArr
    }

    public updatePlayerArr(parr: string[]){
        this.players = parr
    }

    private startGame() { //todo make it workd
        this.status = EStatus.STARTED
        this.activePlayer = this.players[0]
        return {
            deckSize: this.deck.length,
            card: Deck.dealCards(6, this.players.length)
        }
    }

    private winGame(player: string) {
        return JSON.stringify({message: player + " has won!" , error: ""})
    }

    private endGame(player: string) {
        this.status = EStatus.FINISHED
        return JSON.stringify({message: player + " has lost!" , error: ""})
    }

    public move(playedCard: Card, player: string, cardCount: number) {
        if(this.status != EStatus.STARTED){
            return JSON.stringify({message: "Game is not started" , error: "Game is not started"})
        }

        if(playedCard == undefined || player == undefined){
            return JSON.stringify({message: "All fields are required" , error: "All fields are required error"})
        }

        if(!this.players.includes(player)){
            return JSON.stringify({message: "Player is not in the game" , error: "Player is not in the game error"})
        }

        if(this.playedDeck.includes(playedCard)){
            return JSON.stringify({message: "Card is already played" , error: "Card is already played error"})
        }


        if(this.activeDeck.length !<= 0 && cardCount < 6){
            this.playedDeck.push(playedCard)
            return JSON.stringify({message: "Card played" , error: ""}) //give him a card in return
        }

        if(this.activeDeck.length <= 0 && cardCount <= 0){  //win condition
            if(this.winner != "" ){
                return
            }
            this.winner = player
            return this.winGame(player)
        }

        if(playedCard.numericValue() < this.activeDeck[0].numericValue()){
            return JSON.stringify({message: "Card cannot be played" , error: "Card cannot be played error"})
        }

        if(playedCard.numericValue() == 6){ //todo add the special logic
            this.activeDeck.push(playedCard)
            return JSON.stringify({message: "Card played" , error: ""})
        }

        if(playedCard.numericValue() == 10){ //todo add the special logic
            this.playedDeck.push(...this.activeDeck)
            this.activeDeck = []
            this.activeDeck.push(playedCard)
            return JSON.stringify({message: "Card played" , error: ""})
        }

        if(playedCard.numericValue() == this.activeDeck[0].numericValue() && this.activeDeck[0].numericValue() == this.activeDeck[1].numericValue() && this.activeDeck[1].numericValue() == this.activeDeck[2].numericValue()){
            this.playedDeck.push(...this.activeDeck)
            this.activeDeck = []
            this.activeDeck.push(playedCard)
            return JSON.stringify({message: "Card played" , error: ""})
        }


        this.activeDeck.push(playedCard)
        return JSON.stringify({message: "Card played" , error: ""})


    }
}

export class Card {
    constructor(
        public suit: ESuits,
        public value: string,
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
        cardA = new Card(cardA.suit, cardA.value)
        cardB = new Card(cardB.suit, cardB.value)

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