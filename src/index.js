function showCover() {
    let coverDiv = document.createElement('div');
    coverDiv.id = 'cover-div';
    // make the page unscrollable while the modal form is open
    document.body.style.overflowY = 'hidden';
    document.body.append(coverDiv);
}

  function hideCover() {
    document.getElementById('cover-div').remove();
    document.body.style.overflowY = '';
 }

function showPrompt(callback) {
    showCover();
    let form = document.getElementById('add-name')
    let container = document.getElementById('modal-container')
    // add image of card to modal?
    

    function complete(value) {
        hideCover();
        container.style.display = 'none';
        document.onkeydown = null;
        callback(value);
    }

    form.onsubmit = function() {
        let value = form.text.value;
        if (value == '') return false; // ignore empty submit

        complete(value);
        return false;
    };

    let lastElem = form.elements[form.elements.length - 1];
    let firstElem = form.elements[0];

    lastElem.onkeydown = function(e) {
      if (e.key == 'Tab' && !e.shiftKey) {
        firstElem.focus();
        return false;
      }
    };

    firstElem.onkeydown = function(e) {
      if (e.key == 'Tab' && e.shiftKey) {
        lastElem.focus();
        return false;
      }
    };
    
    container.style.display = 'block';
    form.elements.text.focus();
 



  }

let game = new Game()
game.dealCards()