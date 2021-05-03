class Card {
    constructor(card) {
        this.id = card.id
        this.name = card.name
        this.filename = card.filename
    }


    appendCardName() {
        const gamelog = document.querySelector("#gamelog")
        const cardName = document.createElement("li")
        if (this.name) {
            cardName.innerText = this.name
        } else {
            cardName.innerText = "Unnamed card: Number " + this.id
        }
        gamelog.append(cardName)
    }

    static getCards() {
        fetch("http://localhost:3000/cards")
        .then( r => r.json())
        .then(cards => this.listCards(cards))
        .catch(e => alert(e))
    
    }

    static listCards(cards) {
        for (let card of cards) {
            // console.log("cards:")
            // console.log(card)
            let newCard = new Card(card)
            allDeck.addCardtoDeck(card)
            newCard.appendCardName()
        }
        this.dealCards()

    }

    static dealCards() {
        const totalCards = allDeck.dealtCards.length
        const totalNamedCards = allDeck.namedCards.length
        if (totalNamedCards <= totalCards/2) {
            computerDeck.dealtCards = allDeck.namedCards
            let unnamedCards = allDeck.dealtCards.filter(card => !allDeck.namedCards.includes(card))
            let holder 
            for (let i = 0; i < allDeck.namedCards.length; i++) {
                holder = unnamedCards.splice([Math.floor(Math.random()*unnamedCards.length)],1)
                userDeck.addCardtoDeck(holder[0])
            }
        } else {
            //deal half to each person, perhaps limited at 20 or 25
            console.log("can not get here yet")
        }
        this.createStacks()
        this.dealUserHand()
        
    }

    static createStacks() {
        const computerPile = document.querySelector("#computerPile")
        computerPile.innerText = computerDeck.dealtCards.length
        computerDeck.unplayedCards = [...computerDeck.dealtCards]
        const playerPile = document.querySelector("#playerPile")
        playerPile.innerText = userDeck.dealtCards.length
        userDeck.unplayedCards = [...userDeck.dealtCards]
    }

    static dealUserHand() {
        const firstPos = document.querySelector("#firstPos")
        const secondPos = document.querySelector("#secondPos")
        const thirdPos = document.querySelector("#thirdPos")
        this.placeCard(firstPos)
        this.placeCard(secondPos)
        this.placeCard(thirdPos)
    }

    static placeCard(pos) {
        if (pos.children[0]) {
            console.log("got a card there")
        } else {
            const cardIMG = document.createElement("IMG")
            let randomCard = userDeck.drawCard()
            cardIMG.setAttribute("src", "cards/" + randomCard.filename)
            cardIMG.dataset.id = randomCard.id
            pos.append(cardIMG)
            pos.addEventListener('click',this.playCard)
        }

    }

    static playCard(e) {
        console.log(e.target.parentElement)
        console.log('clicked')
        const playerPlayed = document.querySelector("#playerPlayed")
        playerPlayed.append(e.target)
        e.target.remove
        //place in player pos
    }

}



