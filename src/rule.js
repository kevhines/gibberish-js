class Rule {

    constructor(rule) {
        this.winner_id = rule.winner_id
        this.loser_id = rule.loser_id
        this.rule = rule.rule
        this.id = rule.id
    }

    static createRule(e) {
        e.preventDefault();
        const ruleWhy = document.querySelector("input[id='ruleWhy']")
        const winnerChoice = document.getElementById("ruleWinner");
        let userID = parseInt(playerPlayed.children[0].dataset.id,10)
        let computerID = parseInt(computerPlayed.children[0].dataset.id,10)
        let loserID
        let winnerID = parseInt(winnerChoice.value, 10)
        loserID = (winnerID === computerID) ? userID: computerID
debugger
        const rulesURL = "http://localhost:3000/rules/"
        if (ruleWhy.value) {
            console.log("creating rule")
            console.log(e)
            console.log(this)
            const body = {
                rule: {
                    rule: ruleWhy.value,
                    winner_id: winnerID,
                    loser_id: loserID
                }
            }
            let configObj = {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
                },
                body: JSON.stringify(body) }

            fetch(rulesURL, configObj)
            .then(r => r.json())
            // .then(obj => {
            //     this.name = obj.name
            //     game.hasCardBeenNamed(this.id)
            // }) 
        } else {
            window.alert("Tell me why this card wins!")
        }

    }


    
}