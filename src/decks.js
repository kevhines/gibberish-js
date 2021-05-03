class Deck {

    constructor() {
        this.dealtCards = []
        this.unplayedCards = []
        this.playedCards = []
    }

    addCardtoDeck(card) {
        this.dealtCards.push(card)
    }

    drawCard() {
        let randomCard = this.unplayedCards.splice([Math.floor(Math.random()*this.unplayedCards.length)],1)
        this.moveCardToPlayed(randomCard[0])
        return randomCard[0]
    }

    moveCardToPlayed(card) {
        this.playedCards.push(card)
    }
}

class AllCards extends Deck {

    constructor() {
        super()
        this.namedCards = []
    }

    addCardtoDeck(card) {
        // debugger
        super.addCardtoDeck(card)
        if (card.name) {
            this.namedCards.push(card)
        }
    }

}