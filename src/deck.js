class Deck {

    constructor() {
        this.unplayedCards = []
    }

    addCardtoDeck(card) {
        this.unplayedCards.push(card)
    }

    
    findCard(id) {
        return this.unplayedCards.find(card => card.id === id)
    }

}

class PlayableDeck extends Deck {

    constructor() {
        super()
        this.playedCards = []
    }

    drawCard() {
       
        let randomIndex = Math.floor(Math.random()*this.unplayedCards.length)
        let randomCard = this.unplayedCards.splice([randomIndex],1)
        this.moveCardToPlayed(randomCard[0])
        // debugger
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

    totalUnplayedCards() {
        return this.unplayedCards.length
    }

    clear() {
        this.unplayedCards = []
        this.playedCards = []
    }

}

class AllCards extends Deck {

    constructor() {
        super()
        this.namedCards = []
    }

    resetNamed() {
        this.namedCards = this.unplayedCards.filter(card => card.name)
    }

}