var boardLogic = {};
boardLogic.cardColors = Object.freeze({ 0: "Green", 1: "Red", 2: "Yellow", 3: "Blue", 4: "Non" });
boardLogic.cardOptions = Object.freeze({ 1: "1", 2: "+2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "Taki", 11: "Stop", 12: "ChangeColor", 13: "+" })


boardLogic.init = function () {
    boardLogic.deckOfCards = [];
    boardLogic.trashDeck = [];
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
        boardLogic.deckOfCards.push(boardLogic.createCard(number, 4));
    }
    else {
        boardLogic.deckOfCards.push(boardLogic.createCard(number, color));
        boardLogic.deckOfCards.push(boardLogic.createCard(number, color));
    }
}

boardLogic.createCard = function (number, color){
    var card = {
        number: number,
        color: color
    };
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

boardLogic.GetCardFromDeck = function () {
    if (boardLogic.deckOfCards.length == 0) {
        boardLogic.deckOfCards = boardLogic.trashDeck;
        boardLogic.shuffleDeck(boardLogic.deckOfCards);
        boardLogic.trashDeck = [];
    }
    return boardLogic.deckOfCards.shift();
}

boardLogic.trowCardToTrash = function (iCard) {
    boardLogic.trashDeck.push(iCard);
}

boardLogic.getCardFromPlayer = function (iCard) {
    if (boardLogic.cardRooles(iCard)) {
        boardLogic.trowCardToTrash(boardLogic.currentCard);
        boardLogic.currentCard = iCard;
        return true;
    }

    return false;
}

boardLogic.cardRooles = function (iCard){
    // turn logic here, also mark the flags like +2 or the stop or + etc...
    return (iCard.color === boardLogic.currentCard.color || iCard.number === boardLogic.currentCard.number);
}

// UI manipulation section
boardLogic.loadUI = function () {
    lobby.removeFromView();
    boardLogic.divInDOM = document.getElementById("board");
    boardLogic.divInDOM.style.display = utility.displayActive;

    boardLogic.init();

    ////////
    // TODO: remove this code
    // test display all the cards on the page
    ////////
    boardLogic.testUI();
    var startBtn = document.getElementById("drowCard");
    if (startBtn) {
        startBtn.onclick = testDrowingCard;
    }
}


boardLogic.testUI = function () {
    var testDiv = document.getElementById("cards");
    testDiv.innerHTML = "";
    for (var i = 0; i < boardLogic.deckOfCards.length; i++) {
        testDiv.innerHTML += "</br><li>" + boardLogic.cardOptions[boardLogic.deckOfCards[i].number] + " " + boardLogic.cardColors[boardLogic.deckOfCards[i].color] + "</li>";
    }
}

boardLogic.removeFromView = function () {
    boardLogic.divInDOM.style.display = utility.displayHidden;
}


function testDrowingCard() {
    var currentCard = document.getElementById("currentCard");
    if (boardLogic.currentCard != undefined) {
        boardLogic.trowCardToTrash(boardLogic.currentCard);
    }
    boardLogic.currentCard = boardLogic.GetCardFromDeck();
    currentCard.innerHTML = "Nmber: " + boardLogic.cardOptions[boardLogic.currentCard.number] + " Color: " + boardLogic.cardColors[boardLogic.currentCard.color];
    boardLogic.testUI();
}
