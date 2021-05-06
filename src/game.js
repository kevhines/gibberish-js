class Game {

    constructor() {
        this.allDeck = new AllCards()
        this.computerDeck = new PlayableDeck()
        this.userDeck = new PlayableDeck()
    }

    startGameForm() {
        const formSpace = document.querySelector("#new-card-form")
        formSpace.innerHTML = `
        <strong>To start the game click this button!</strong><br><br>
        <form id="start-game-name">
            <center><input type="submit" value="Start Game"></center>
        </form>
        `
    
        const form = document.querySelector("#start-game-name");
        form.addEventListener("submit", this.dealCards.bind(this))
    }

    dealCards(e) {
        e.preventDefault();
        const formSpace = document.querySelector("#new-card-form")
        formSpace.innerHTML = ""
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
        }

        this.sortCards()
    }

    sortCards() {

        const cardsPerPile = (this.allDeck.dealtCards.length) / 2

        this.appendtoGameLog(cardsPerPile + " cards dealt to each player!")

        const totalNamedCards = this.allDeck.namedCards.length
        let unnamedCards = this.allDeck.dealtCards.filter(card => !this.allDeck.namedCards.includes(card))
        let randomCard 
        if (totalNamedCards <= cardsPerPile) {
            this.computerDeck.dealtCards = [...this.allDeck.namedCards]
 
            for (let i = 0; i < this.allDeck.namedCards.length; i++) {
                randomCard = unnamedCards.splice([Math.floor(Math.random()*unnamedCards.length)],1)
                this.userDeck.addCardtoDeck(randomCard[0])
            }
        } else {
            //deal half to each person, perhaps limited at 20 or 25

            let cardsForComputer = [...this.allDeck.namedCards]
            for (let i = 0; i < cardsPerPile; i++) {
                randomCard = cardsForComputer.splice([Math.floor(Math.random()*cardsForComputer.length)],1)
                this.computerDeck.addCardtoDeck(randomCard[0])
            }  
            let cardsForUser = [...cardsForComputer, ...unnamedCards]
            for (let i = 0; i < cardsPerPile; i++) {
                // debugger
                randomCard = cardsForUser.splice([Math.floor(Math.random()*cardsForUser.length)],1)
                this.userDeck.addCardtoDeck(randomCard[0])
            }  






        }

        this.createPiles()
        this.dealUserHand()
        
    }

    createPiles() {
        this.computerDeck.unplayedCards = [...this.computerDeck.dealtCards]
        this.userDeck.unplayedCards = [...this.userDeck.dealtCards]
        
        const computerPile = document.querySelector("#computerPile")
        computerPile.innerText = this.computerDeck.totalCards()
        
        const playerPile = document.querySelector("#playerPile")
        playerPile.innerText = this.userDeck.totalCards()
       

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
            // debugger
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
            this.appendtoGameLog("User plays " + card.name)
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

        this.appendtoGameLog("Computer plays " + randomCard.name)

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
        let message = ""
        if (rule.winner_id === computerID) {
            message = `Computer Wins: ${winnerCard.name} beats ${loserCard.name} because ${rule.rule}` 
            //remove loserCard from user deck
            game.computerDeck.moveCardToPlayed(loserCard)
            game.userDeck.removeCardFromDeck(loserCard)
        } else {
            message = `User Wins: ${winnerCard.name} beats ${loserCard.name} because ${rule.rule}`
            game.userDeck.moveCardToPlayed(loserCard)
            game.computerDeck.removeCardFromDeck(loserCard)
        }
        this.appendtoGameLog(message)
        this.clearForm()
        this.showWinner(message)

    }

    clearForm() {
        const formSpace = document.querySelector("#new-card-form")
        formSpace.innerHTML = ""
    }

    showWinner(msg) {
        const formSpace = document.querySelector("#new-card-form")
        formSpace.innerHTML = `
        ${msg}<br><br>
        <form id="clear-cards">
            <center><input type="submit" value="Clear Cards"></center>
        </form>
        `
    
        const form = document.querySelector("#clear-cards");
        form.addEventListener("submit", this.clearPlayedCards.bind(this))

    }


    clearPlayedCards(e) {
        e.preventDefault();
        this.clearForm()
        const computerPlayed = document.querySelector("#computerPlayed")
        const playerPlayed = document.querySelector("#playerPlayed")
        computerPlayed.children[0].remove()
        playerPlayed.children[0].remove()

        const computerPile = document.querySelector("#computerPile")
        computerPile.innerText = this.computerDeck.totalCards()

        const playerPile = document.querySelector("#playerPile")
        playerPile.innerText = this.userDeck.totalCards()

        this.dealUserHand()
    }

    
    appendtoGameLog(msg) {
        const gamelog = document.querySelector("#gamelog")
        const newEntry = document.createElement("li")
        newEntry.innerText = msg
        gamelog.prepend(newEntry)
    }

}



//display how many total cards and how many cards in pile
//when pile is empty reshuffle (check after enactrule)
//when total cards is 0 someone wins! (check after enactrule)


//update text

//error handeling - no catch errors right now and no error handeling in controllers
//refactor everything!!!!

//take turns going first?