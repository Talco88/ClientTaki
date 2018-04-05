var boardLogic = {};
boardLogic.firstHandDivision = 8;
boardLogic.IsInit = false;
boardLogic.punishNumber = 0;
boardLogic.debug = true;
boardLogic.cardColors = Object.freeze({ 0: "Green", 1: "Red", 2: "Yellow", 3: "Blue", 4: "Non" });
boardLogic.cardOptions = Object.freeze({ 1: "1", 2: "+2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "Taki", 11: "Stop", 12: "ChangeColor", 13: "+" })


boardLogic.init = function () {
    boardLogic.deckOfCards = [];
    boardLogic.trashDeck = [];
    boardLogic.skipTurn = false;
    for (var i = 1; i <= Object.keys(boardLogic.cardOptions).length; i++) {
        if (i != 2) {
            for (var j = 0; j < (Object.keys(boardLogic.cardColors).length - 1); j++) {
                boardLogic.addGeneratedCards(i, j);
            }
        }
    }

    boardLogic.shuffleDeck(boardLogic.deckOfCards);
    boardLogic.IsInit = true;
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

boardLogic.getCardFromDeck = function () {
    if (!boardLogic.IsInit) {
        boardLogic.init();
    }

    if (boardLogic.deckOfCards.length == 0) {
        boardLogic.deckOfCards = boardLogic.trashDeck;
        boardLogic.shuffleDeck(boardLogic.deckOfCards);
        boardLogic.trashDeck = [];
    }
    return boardLogic.deckOfCards.shift();
}

boardLogic.getSomeCardsFromDeck = function (iNumberOfCards) {
    var cardsArray = [];
    for (var i = 0; i < iNumberOfCards; i++) {
        cardsArray.push(boardLogic.getCardFromDeck());
    }
    return cardsArray;
}

boardLogic.getFirsdHandOfCards = function () {
    return boardLogic.getSomeCardsFromDeck(boardLogic.firstHandDivision);
}

boardLogic.drowCardsFromDeck = function () {
    var retCards = [];
    var numberOfCardsToDrow = 1;
    if (boardLogic.punishNumber > 0) {
        numberOfCardsToDrow = boardLogic.punishNumber;
    }

    if (boardLogic.debug) {
        console.log(boardLogic.deckOfCards);
    }
    return boardLogic.getSomeCardsFromDeck(numberOfCardsToDrow);
}

boardLogic.trowCardToTrash = function (iCard) {
    if (!boardLogic.IsInit) {
        alert("Unable to get card from uninitialized board!!!");
    }
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
    if (iCard.color === boardLogic.currentCard.color || iCard.number === boardLogic.currentCard.number) {
        if (iCard.number == 2) {
            boardLogic.punishNumber += 2;
        }
        else if (iCard.number == 11) {
            boardLogic.skipTurn = true;
        }
        return true;
    }

    return false;
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

    var startBtn = document.getElementById("drowCard");
    if (startBtn) {
        startBtn.onclick = testDrowingCard;
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
    boardLogic.currentCard = boardLogic.getCardFromDeck();
    currentCard.innerHTML = "Nmber: " + boardLogic.cardOptions[boardLogic.currentCard.number] + " Color: " + boardLogic.cardColors[boardLogic.currentCard.color];
}
