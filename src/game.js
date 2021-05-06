class Game {

    constructor() {
        this.allDeck = new AllCards()
        this.computerDeck = new PlayableDeck()
        this.userDeck = new PlayableDeck()
        this.firstPos = document.querySelector("#firstPos")
        this.secondPos = document.querySelector("#secondPos")
        this.thirdPos = document.querySelector("#thirdPos")
    }

    //createForms

    createForm(stringHTML,callback) {
        const formSpace = document.querySelector("#card-display-form")
        formSpace.innerHTML = stringHTML
        const form = document.querySelector("#card-form");
        form.addEventListener("submit",callback)
    }

    startGameForm() {
        
        let stringHTML = `
        <strong>To start the game click this button!</strong><br><br>
        <form id="card-form">
            <center><input type="submit" value="Start Game"></center>
        </form>
        `
        this.createForm(stringHTML,this.dealCards.bind(this))
    }

    getCardName(namelessCard) {
        
        let stringHTML = `
        Hey, this card has never been played. Enter a name for it:<br><br>
        <form id="card-form">
            <label><strong>Name for this card:</strong></label>
            <input type="text" id="cardName"><br><br>
            <input type="submit" value="Submit">
        </form>
        `
        this.createForm(stringHTML,namelessCard.updateName.bind(namelessCard))

    }

    ruleForm(computerID, userID) {
        let computerCard = this.allDeck.findCard(computerID)
        let playerCard = this.allDeck.findCard(userID)

        let stringHTML = `
        I don't know who wins this hand. You decide!<br><br>
        <form id="card-form">
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
        this.createForm(stringHTML,Rule.createRule.bind(Rule))


    }

        showWinner(msg) {
       
        let stringHTML = `
        ${msg}<br><br>
        <form id="card-form">
            <center><input type="submit" value="Clear Cards"></center>
        </form>
        `
    
        this.createForm(stringHTML,this.clearPlayedCards.bind(this))

    }

    gameOver(winner) {
        //clear board - everything (user hand, form, any played cards)

        this.clearForm()
        this.clearUserHand()
        this.appendtoGameLog(winner + " WON!")

        
        let stringHTML = `
        <strong>${winner} WINS!</strong><br><br>
        <form id="card-form">
            <center><input type="submit" value="New Game"></center>
        </form>
        `
    
        this.createForm(stringHTML, this.newGame.bind(this))

        
    }

    clearForm() {
        const formSpace = document.querySelector("#card-display-form")
        formSpace.innerHTML = ""
    }

    ///end of form creation (and the clear form thing.)

    //stuff involving User Hand

    currentUserHand() {
        const userHand =[]
        if (this.firstPos.children[0]) {
            userHand.push(this.allDeck.findCard(parseInt(this.firstPos.children[0].dataset.id,10)))
        }
        if (this.secondPos.children[0]) {
        userHand.push(this.allDeck.findCard(parseInt(this.secondPos.children[0].dataset.id,10)))
        }
        if (this.thirdPos.children[0]) {
        userHand.push(this.allDeck.findCard(parseInt(this.thirdPos.children[0].dataset.id,10)))
        }
        return userHand

    }

    dealUserHand() {
        const playerCards = document.querySelector("#playerCards")
        let unplayedUserCards = this.userDeck.totalUnplayedCards()


        if (unplayedUserCards > 0) {this.placeCard(this.firstPos)}
        if (unplayedUserCards > 0) {this.placeCard(this.secondPos)}
        if (unplayedUserCards > 0) {this.placeCard(this.thirdPos)}

 
 
        playerCards.addEventListener('click',this.playCard) 
        this.refreshPileCount()
    }

    clearUserHand() {
        this.firstPos.innerHTML = ""
        this.secondPos.innerHTML = ""
        this.thirdPos.innerHTML = ""
    }

    //end of User Hand stuff


    dealCards(e) {
        e.preventDefault();
        this.clearForm()
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

        const cardsPerPile = (this.allDeck.unplayedCards.length) / 2
        this.appendtoGameLog(cardsPerPile + " cards dealt to each player!")
        const totalNamedCards = this.allDeck.namedCards.length
        let unnamedCards = this.allDeck.unplayedCards.filter(card => !this.allDeck.namedCards.includes(card))
        let randomCard 
        let cardsForUser = []
        let userCardLimit = cardsPerPile

        if (totalNamedCards <= cardsPerPile) {
            this.computerDeck.unplayedCards = [...this.allDeck.namedCards]
            cardsForUser = [ ...unnamedCards]
            userCardLimit = this.allDeck.namedCards.length
        } else {
            let cardsForComputer = [...this.allDeck.namedCards]
            for (let i = 0; i < cardsPerPile; i++) {
                randomCard = cardsForComputer.splice([Math.floor(Math.random()*cardsForComputer.length)],1)
                this.computerDeck.addCardtoDeck(randomCard[0])
            }  
            cardsForUser = [...cardsForComputer, ...unnamedCards]
        }
        for (let i = 0; i < userCardLimit; i++) {
            randomCard = cardsForUser.splice([Math.floor(Math.random()*cardsForUser.length)],1)
            this.userDeck.addCardtoDeck(randomCard[0])
        }

        this.refreshPileCount() //removed create Piles because they are made now during sort
        this.dealUserHand()
        
    }



    refreshPileCount() {

        const computerPile = document.querySelector("#computerPile")
        let computerUnplayed = this.computerDeck.totalUnplayedCards()
        let computerTotal = this.computerDeck.totalCards()
        let computerCounts = `<span class="count">${computerUnplayed}</span><span class="total">${computerTotal} total cards</span>`

        const playerPile = document.querySelector("#playerPile")
        let userUnplayed = this.userDeck.totalUnplayedCards()
        let userTotal = this.userDeck.totalCards()
        let userCounts = `<span class="count">${userUnplayed}</span><span class="total">${userTotal} total cards</span>`
        
        computerPile.innerHTML = computerCounts
        playerPile.innerHTML = userCounts
    }



    placeCard(pos) {
        if (!pos.children[0]) {
            const cardIMG = document.createElement("IMG")
            let randomCard = this.userDeck.drawCard()
            cardIMG.setAttribute("src", "cards/" + randomCard.filename)
            cardIMG.dataset.id = randomCard.id
            pos.append(cardIMG)
        }

    }





    playCard(e) {
        const playerPlayed = document.querySelector("#playerPlayed")
        if (e.target.nodeName === "IMG") {
            e.currentTarget.removeEventListener(e.type, game.playCard);
            playerPlayed.append(e.target)
        }
        game.hasCardBeenNamed(parseInt(e.target.dataset.id, 10))
    }

    
    hasCardBeenNamed(id) {
        let card = this.allDeck.findCard(id) 
        if (!!card.name) {
            this.appendtoGameLog("User plays " + card.name)
            this.playComputerCard()
        } else {
            this.getCardName(card)
        }
        
    }

    playComputerCard() {
        this.clearForm()

        const computerPlayed = document.querySelector("#computerPlayed")
        let randomCard = this.computerDeck.drawCard()

        this.appendtoGameLog("Computer plays " + randomCard.name)

        const cardIMG = document.createElement("IMG")
        cardIMG.setAttribute("src", "cards/" + randomCard.filename)
        cardIMG.dataset.id = randomCard.id
        computerPlayed.append(cardIMG)
        this.refreshPileCount()
        this.findRule(randomCard.id)
    }

    findRule(cardID) {
        let card = this.allDeck.findCard(cardID)
        const playerPlayed = document.querySelector("#playerPlayed")
        let userID = parseInt(playerPlayed.children[0].dataset.id,10)
        if (card.rules.length > 0) {
            let ruleForCards = card.rules.find(rule => ((rule.winner_id === cardID && rule.loser_id === userID) || (rule.winner_id === userID && rule.loser_id === cardID)))
            if (ruleForCards) {
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








    clearPlayedCards(e) {
        e.preventDefault();
        this.clearForm()
        const computerPlayed = document.querySelector("#computerPlayed")
        const playerPlayed = document.querySelector("#playerPlayed")
        computerPlayed.children[0].remove()
        playerPlayed.children[0].remove()

        if (!this.checkforWinner()) {
            this.checkforShuffle()
            this.refreshPileCount()
            this.dealUserHand()
        }
    }

    checkforWinner() {
        if (game.userDeck.totalCards() === 0) {
            this.gameOver("Computer")
            return true
        } else if (game.computerDeck.totalCards() === 0) {
            this.gameOver("User")
            return true
        }

    }



    newGame(e) {
        e.preventDefault()
        this.clearForm()
        this.appendtoGameLog("New Game Starting")
        this.computerDeck.clear()
        this.userDeck.clear()
        this.allDeck.resetNamed()
        this.sortCards()
        
    }

    checkforShuffle() {

        if (this.userDeck.totalUnplayedCards() === 0 && this.userDeck.playedCards.length > 3) {
            let userHand = this.currentUserHand()
            let cardsToShuffle = this.userDeck.playedCards.filter(card => !userHand.includes(card))
            this.userDeck.unplayedCards = [...cardsToShuffle]
            this.userDeck.playedCards = [...userHand]
        } else if (this.computerDeck.totalUnplayedCards() === 0) {
            this.computerDeck.unplayedCards = [...this.computerDeck.playedCards]
            this.computerDeck.playedCards = []
        }

    }



    
    appendtoGameLog(msg) {
        const gamelog = document.querySelector("#gamelog")
        const newEntry = document.createElement("li")
        newEntry.innerText = msg
        gamelog.prepend(newEntry)
    }

}


//update text

//error handeling - no catch errors in fetch right now and no error handeling in controllers
//refactor everything!!!!

//take turns going first?