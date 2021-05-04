class Deck {

    constructor() {
        this.dealtCards = []
    }

    addCardtoDeck(card) {
        this.dealtCards.push(card)
    }

}

class PlayableDeck extends Deck {

    constructor() {
        super()
        this.unplayedCards = []
        this.playedCards = []
    }

    drawCard() {
        let randomCard = this.unplayedCards.splice([Math.floor(Math.random()*this.unplayedCards.length)],1)
        this.moveCardToPlayed(randomCard[0])
        return randomCard[0]
    }

    moveCardToPlayed(card) {
        this.playedCards.push(card)
    }

    findCard(id) {
        return this.dealtCards.find(card => card.id === id)
    }

}

class AllCards extends Deck {

    constructor() {
        super()
        this.namedCards = []
    }

    addCardtoDeck(card) {
        super.addCardtoDeck(card)
        if (card.name) {
            this.namedCards.push(card)
        }
    }

}