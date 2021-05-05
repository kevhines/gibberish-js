class Game {

    constructor() {
        this.allDeck = new AllCards()
        this.computerDeck = new PlayableDeck()
        this.userDeck = new PlayableDeck()
    }

    dealCards() {
        this.fetchCards()
        
    }

    fetchCards() {
        fetch("http://localhost:3000/cards")
        .then( r => r.json())
        .then(cards => {this.buildDecks(cards)})
        .catch(e => alert(e))
    
    }

    buildDecks(cards) {

        for (let card of cards) {
            let newCard = new Card(card)
            this.allDeck.addCardtoDeck(newCard)
            newCard.appendCardName()
        }

        this.sortCards()
    }

    sortCards() {
        const totalCards = this.allDeck.dealtCards.length
        const totalNamedCards = this.allDeck.namedCards.length

        if (totalNamedCards <= totalCards/2) {
            this.computerDeck.dealtCards = [...this.allDeck.namedCards]
            let unnamedCards = this.allDeck.dealtCards.filter(card => !this.allDeck.namedCards.includes(card))
            let randomCard 
            for (let i = 0; i < this.allDeck.namedCards.length; i++) {
                randomCard = unnamedCards.splice([Math.floor(Math.random()*unnamedCards.length)],1)
                this.userDeck.addCardtoDeck(randomCard[0])
            }
        } else {
            //deal half to each person, perhaps limited at 20 or 25
            console.log("can not get here yet")
        }

        this.createPiles()
        this.dealUserHand()
        
    }

    createPiles() {
        const computerPile = document.querySelector("#computerPile")
        computerPile.innerText = this.computerDeck.dealtCards.length
        this.computerDeck.unplayedCards = [...this.computerDeck.dealtCards]
        const playerPile = document.querySelector("#playerPile")
        playerPile.innerText = this.userDeck.dealtCards.length
        this.userDeck.unplayedCards = [...this.userDeck.dealtCards]
    }

    dealUserHand() {
        const firstPos = document.querySelector("#firstPos")
        const secondPos = document.querySelector("#secondPos")
        const thirdPos = document.querySelector("#thirdPos")
        const playerCards = document.querySelector("#playerCards")
        this.placeCard(firstPos)
        this.placeCard(secondPos)
        this.placeCard(thirdPos)
        playerCards.addEventListener('click',this.playCard) 
    }

    placeCard(pos) {
        if (pos.children[0]) {
            console.log("got a card there")
        } else {
            const cardIMG = document.createElement("IMG")
            let randomCard = this.userDeck.drawCard()
            cardIMG.setAttribute("src", "cards/" + randomCard.filename)
            cardIMG.dataset.id = randomCard.id
            pos.append(cardIMG)
        }

    }

    getCardName(namelessCard) {
        const formSpace = document.querySelector("#new-card-form")
        formSpace.innerHTML = `
        Hey, this card has never been played. Enter a name for it:<br><br>
        <form id="add-name">
            <label><strong>Name for this card:</strong></label>
            <input type="text" id="cardName"><br><br>
            <input type="submit" value="Submit">
        </form>
        `
        const form = document.querySelector("#add-name");
        form.addEventListener("submit", namelessCard.updateName.bind(namelessCard))

    }

    ruleForm(computerID, userID) {
        let computerCard = this.computerDeck.findCard(computerID)
        let playerCard = this.userDeck.findCard(userID)
        const formSpace = document.querySelector("#new-card-form")
        formSpace.innerHTML = `
        I don't know who wins this hand. You decide!<br><br>
        <form id="add-rule">
            <label><strong>Choose a Card that wins:</strong></label><br>
            <select id="ruleWinner" name="ruleWinner" >  
                <option value="${computerID}">${computerCard.name}</option>  
                <option value="${userID}">${playerCard.name}</option>  
            </select><br><br>

            <label><strong>Why does this card win?</strong></label>
            <input type="text" id="ruleWhy"><br><br>

            <input type="submit" value="Submit">
        </form>
        `
        const form = document.querySelector("#add-rule");
        form.addEventListener("submit", Rule.createRule.bind(Rule))

    }

    playCard(e) {
        const playerPlayed = document.querySelector("#playerPlayed")
        if (e.target.nodeName === "IMG") {
            e.currentTarget.removeEventListener(e.type, game.playCard);
            playerPlayed.append(e.target)
        }
        //debugger
        game.hasCardBeenNamed(parseInt(e.target.dataset.id, 10))
    }

    
    hasCardBeenNamed(id) {
        let card = this.userDeck.findCard(id)
        if (!!card.name) {
            this.playComputerCard()
        } else {
            this.getCardName(card)
        }
    }

    playComputerCard() {
        const formSpace = document.querySelector("#new-card-form")
        formSpace.innerHTML = ""

        const computerPlayed = document.querySelector("#computerPlayed")
        let randomCard = this.computerDeck.drawCard()
        const cardIMG = document.createElement("IMG")
        cardIMG.setAttribute("src", "cards/" + randomCard.filename)
        cardIMG.dataset.id = randomCard.id
        computerPlayed.append(cardIMG)
        this.findRule(randomCard.id)
    }

    findRule(cardID) {
        console.log("find a rule!")
        let card = this.computerDeck.findCard(cardID)
        const playerPlayed = document.querySelector("#playerPlayed")
        let userID = parseInt(playerPlayed.children[0].dataset.id,10)
// debugger
        if (card.rules.length > 0) {
            console.log("might have a rule!")
            let ruleForCards = card.rules.find(rule => ((rule.winner_id === cardID && rule.loser_id === userID) || (rule.winner_id === userID && rule.loser_id === cardID)))
           // console.log(ruleforCards)
            if (ruleForCards) {
                // debugger
                console.log("found a rule")
                // debugger
                this.enactRule(ruleForCards, cardID)
            } else {
                this.ruleForm(cardID, userID)
            }
        } else {
            this.ruleForm(cardID, userID)
        }

    }

    enactRule(rule, computerID) {

        const winnerCard = this.allDeck.findCard(rule.winner_id)
        const loserCard = this.allDeck.findCard(rule.loser_id)
        if (rule.winner_id === computerID) {
            console.log("computer wins")
            //remove loserCard from user deck
            game.computerDeck.moveCardToPlayed(loserCard)
            game.userDeck.removeCardFromDeck(loserCard)
        } else {
            console.log("user wins!")
          //remove loserCard from user deck
            //add loser card to user deck
        }
        this.clearPlayedCards()
    }

    clearPlayedCards() {
        const computerPlayed = document.querySelector("#computerPlayed")
        const playerPlayed = document.querySelector("#playerPlayed")
        computerPlayed.children[0].remove()
        playerPlayed.children[0].remove()

        const computerPile = document.querySelector("#computerPile")
        computerPile.innerText = this.computerDeck.dealtCards.length

        const playerPile = document.querySelector("#playerPile")
        playerPile.innerText = this.userDeck.dealtCards.length

        this.dealUserHand()
    }

}



        //then draw users hand again