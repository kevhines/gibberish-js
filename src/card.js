class Card {
    constructor(card) {
        this.id = card.id
        this.name = card.name
        this.filename = card.filename
        let winRules = card.rules_winner.map(rule => new Rule(rule))
        let loseRules = card.rules_loser.map(rule => new Rule(rule))
        this.rules = [...winRules, ...loseRules]
    }


    addRuleToCard(rule) {
        this.rules.push(rule)
    }

    updateName(e) {
        e.preventDefault();
        const nameInput = document.querySelector("input[id='cardName']")
        const cardURL = "http://localhost:3000/cards/" + this.id
        if (nameInput.value) {
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
            .catch(e => alert(e)) 

        } else {
            window.alert("You need to enter a name!")
        }

    }
    
}



