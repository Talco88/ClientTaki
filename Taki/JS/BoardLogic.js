var boardLogic = {};
boardLogic.cardColors = Object.freeze({"Green":0, "Red":1, "Yellow":2, "Blue":3, "Non":4});
boardLogic.cardOptions = Object.freeze({"1":1, "+2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "Taki":10, "Stop":11, "ChangeColor":12, "+":13})


boardLogic.testUI = function () {
    var testDiv = document.getElementById("cards");
    for (var i = 0; i < boardLogic.deckOfCards.length; i++) {
        testDiv.innerHTML += "</br><li>" + boardLogic.deckOfCards[i].number + " " + boardLogic.deckOfCards[i].color + "</li>";
    }
}

boardLogic.init = function () {
    boardLogic.deckOfCards = [];
    for (var i = 1; i <= Object.keys(boardLogic.cardOptions).length; i++) {
        if (i != 2) {
            for (var j = 0; j < (Object.keys(boardLogic.cardColors).length - 1); j++) {
                boardLogic.addGeneratedCards(i, j);
            }
            
        }
    }

    boardLogic.shuffleDeck(boardLogic.deckOfCards);
}

boardLogic.addGeneratedCards = function (number, color) {
    if (number == 12) {
        boardLogic.deckOfCards.push(boardLogic.createCard(number, color));
    }
    else {
        boardLogic.deckOfCards.push(boardLogic.createCard(number, color));
        boardLogic.deckOfCards.push(boardLogic.createCard(number, color));
    }
}

boardLogic.createCard = function (number, color){
    var card = {};
    card.number = number;
    card.color = color;
    return card;
}

boardLogic.shuffleDeck = function (iDeck) {
    var j, x;
    for (var i = iDeck.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = iDeck[i];
        iDeck[i] = iDeck[j];
        iDeck[j] = x;
    }
}

boardLogic.loadUI = function () {
    var file = "../HTML/Board.html";
    boardLogic.init();
    if (boardLogic.html) {
        boardLogic.setToView(boardLogic.html);
    }
    else {
        utility.getHTMLData(file, boardLogic.setToView);
    }
}

boardLogic.setToView = function (content) {
    boardLogic.html = content;
    utility.setToMainView(content);

    boardLogic.testUI();
}