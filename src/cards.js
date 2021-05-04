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

    updateName(e) {
        e.preventDefault();
        const nameInput = document.querySelector("input[id='cardName']")
        console.log("updated card")
        console.log(e)
        console.log(this)

        let configObj = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              "name": nameInput.value
        }) }

        fetch(cardURL, configObj)
        .then(function(response) {return response.json();})
        .then(function(object) {appendDOM(object);}); 

debugger

    }
    
    
    
    static getCards() {
        fetch("http://localhost:3000/cards")
        .then( r => r.json())
        .then(cards => this.listCards(cards))
        .catch(e => alert(e))
    
    }

}



