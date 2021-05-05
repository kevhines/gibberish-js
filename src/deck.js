class Deck {

    constructor() {
        this.dealtCards = []
    }

    addCardtoDeck(card) {
        this.dealtCards.push(card)
    }

    
    findCard(id) {
        return this.dealtCards.find(card => card.id === id)
    }

}

class PlayableDeck extends Deck {

    constructor() {
        super()
        this.unplayedCards = []
        this.playedCards = []
    }

    drawCard() {
        let randomIndex = Math.floor(Math.random()*this.unplayedCards.length)
        // debugger
        let randomCard = this.unplayedCards.splice([randomIndex],1)
        // debugger
        this.moveCardToPlayed(randomCard[0])
        return randomCard[0]
    }

    moveCardToPlayed(card) {
        this.playedCards.push(card)
    }

    removeCardFromDeck(card) {
        let index = this.playedCards.indexOf(card)
        this.playedCards.splice(index,1)
    }

    totalCards() {
        return this.playedCards.length + this.unplayedCards.length
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