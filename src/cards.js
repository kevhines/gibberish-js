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












 





}



