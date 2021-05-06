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
        this.refreshPileCount()

       

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

    dealUserHand() {
        const firstPos = document.querySelector("#firstPos")
        const secondPos = document.querySelector("#secondPos")
        const thirdPos = document.querySelector("#thirdPos")
        const playerCards = document.querySelector("#playerCards")
        let unplayedUserCards = this.userDeck.totalUnplayedCards()


        if (unplayedUserCards > 0) {this.placeCard(firstPos)}
        if (unplayedUserCards > 0) {this.placeCard(secondPos)}
        if (unplayedUserCards > 0) {this.placeCard(thirdPos)}

 
 
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
        debugger
        game.hasCardBeenNamed(parseInt(e.target.dataset.id, 10))
    }

    
    hasCardBeenNamed(id) {
        debugger
        let card = this.userDeck.findCard(id) //error
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

        this.checkforWinner()
        this.checkforShuffle()
        this.refreshPileCount()
        this.dealUserHand()
    }

    checkforWinner() {
        if (game.userDeck.totalCards === 0) {
            this.gameOver("Computer")
        } else if (game.computerDeck.totalCards === 0) {
            this.gameOver("User")
        }

    }

    gameOver() {
        //clear board - everything
        //display win message
        //reset to start button
    }

    checkforShuffle() {
        //untested!!

        if (this.userDeck.totalUnplayedCards() === 0 && this.userDeck.playedCards.length > 3) {
            let userHand = this.currentUserHand()
            let cardsToShuffle = this.userDeck.playedCards.filter(card => !userHand.includes(card))
            // debugger
            this.userDeck.unplayedCards = [...cardsToShuffle]
            this.userDeck.playedCards = [...userHand]
            // debugger
        } else if (this.computerDeck.totalUnplayedCards() === 0) {
            this.computerDeck.unplayedCards = [...this.computerDeck.playedCards]
            this.computerDeck.playedCards = []
        }

    }

    currentUserHand() {
        const firstPos = document.querySelector("#firstPos")
        const secondPos = document.querySelector("#secondPos")
        const thirdPos = document.querySelector("#thirdPos")
        const userHand =[]
        if (firstPos.children[0]) {
            userHand.push(this.allDeck.findCard(parseInt(firstPos.children[0].dataset.id,10)))
        }
        if (secondPos.children[0]) {
        userHand.push(this.allDeck.findCard(parseInt(secondPos.children[0].dataset.id,10)))
        }
        if (thirdPos.children[0]) {
        userHand.push(this.allDeck.findCard(parseInt(thirdPos.children[0].dataset.id,10)))
        }
        return userHand

    }

    
    appendtoGameLog(msg) {
        const gamelog = document.querySelector("#gamelog")
        const newEntry = document.createElement("li")
        newEntry.innerText = msg
        gamelog.prepend(newEntry)
    }

}

//error on line 199 - after shuffle it uses findcard to look at dealt cards, but I have non dealt cards - need to check all uses of dealt cards, probably just shift it all to allDeck instead
// refresh pile count after I draw cards and after computer plays card?
//when total cards is 0 someone wins! (check after enactrule)
//might not need dealth cards - can just use unplayed????


//update text

//error handeling - no catch errors right now and no error handeling in controllers
//refactor everything!!!!

//take turns going first?