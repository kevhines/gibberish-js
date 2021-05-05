class Card {
    constructor(card) {
        this.id = card.id
        this.name = card.name
        this.filename = card.filename
        // this.rules = [...card.rules_winner, ...card.rules_loser]
       let winRules = card.rules_winner.map(rule => new Rule(rule))
        let loseRules = card.rules_loser.map(rule => new Rule(rule))
        this.rules = [...winRules, ...loseRules]
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

    updateName(e) {
        e.preventDefault();
        const nameInput = document.querySelector("input[id='cardName']")
        const cardURL = "http://localhost:3000/cards/" + this.id
        if (nameInput.value) {
            console.log("updated card")
            console.log(e)
            console.log(this)
            const body = {
                card: {
                    name: nameInput.value
                }
            }
            let configObj = {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
                },
                body: JSON.stringify(body) }

            fetch(cardURL, configObj)
            .then(r => r.json())
            .then(obj => {
                this.name = obj.name
                game.hasCardBeenNamed(this.id)
            }) 

        } else {
            window.alert("You need to enter a name!")
        }

    }
    
    













    
    static getCards() {
        fetch("http://localhost:3000/cards")
        .then( r => r.json())
        .then(cards => this.listCards(cards))
        .catch(e => alert(e))
    
    }

}



