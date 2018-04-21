var boardLogic = {};

boardLogic.firstHandDivision = 8;
boardLogic.IsInit = false;
boardLogic.punishNumber = 0;
boardLogic.cardColors = Object.freeze({ 0: "Green", 1: "Red", 2: "Yellow", 3: "Blue", 4: "Non" });
boardLogic.cardOptions = Object.freeze({ 1: "1", 2: "+2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "Taki", 11: "Stop", 12: "CC", 13: "+" });
boardLogic.numberOfPlayers = 2;
boardLogic.totalNumberOfRounds = 0;
boardLogic.totalPlayTime = 0;


boardLogic.init = function () {
    boardLogic.runId = 0;
    boardLogic.totalNumberOfRounds = 0;
    boardLogic.totalPlayTime = 0;
    boardLogic.deckOfCards = [];
    boardLogic.trashDeck = [];
    boardLogic.openTaki = false;
    for (var i = 1; i <= Object.keys(boardLogic.cardOptions).length; i++) {
        if (i != 2) {
            for (var j = 0; j < (Object.keys(boardLogic.cardColors).length - 1); j++) {
                boardLogic.addGeneratedCards(i, j);
            }
        }
    }

    boardLogic.shuffleDeck(boardLogic.deckOfCards);
    boardLogic.IsInit = true;

    // first cards opem
    boardLogic.openFirstCard();
}

boardLogic.openFirstCard = function () {
    var opendCard = boardLogic.getCardFromDeck();
    while (opendCard.number === 2  || opendCard.number > 9) {
        opendCard = boardLogic.getCardFromDeck();

        // ADD card to trash
    }
    boardLogic.currentCard = opendCard;
    boardLogic.trowCardToTrash(boardLogic.currentCard);
    boardLogic.printCurrentCard();
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

boardLogic.createCard = function (number, color) {
    var card = {
        id: boardLogic.runId,
        number: number,
        color: color
    };
    boardLogic.runId++;
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

boardLogic.drowCardsFromDeck = function (iPlayerId) {
    if (boardLogic.checkPlayersTurn(iPlayerId)) {
        var retCards = [];
        var numberOfCardsToDrow = 1;
        if (boardLogic.punishNumber > 0) {
            numberOfCardsToDrow = boardLogic.punishNumber;
        }

        if (utility.debug) {
            console.log(boardLogic.deckOfCards);
        }
        boardLogic.setPlayerTurn(true);
        return boardLogic.getSomeCardsFromDeck(numberOfCardsToDrow);
    }
    else {
        return [];
    }
}

boardLogic.trowCardToTrash = function (iCard) {
    if (!boardLogic.IsInit) {
        alert("Unable to get card from uninitialized board!!!");
    }
    boardLogic.trashDeck.push(iCard);
}

boardLogic.getCardFromPlayer = function (iCard, iPlayerId) {
    if (boardLogic.checkPlayersTurn(iPlayerId))
    {
        if (boardLogic.cardRooles(iCard))
        {
            boardLogic.trowCardToTrash(boardLogic.currentCard);
            boardLogic.currentCard = iCard;
            boardLogic.setPlayerTurn(false);
            boardLogic.printCurrentCard();
            return true;
        }
    }

    return false;
}

boardLogic.printCurrentCard = function () {
    var currentCard = document.getElementById("currentCard");
    currentCard.innerHTML = "";
    currentCard.appendChild(utility.getCardHtml(boardLogic.currentCard));
}

boardLogic.cardRooles = function (iCard){
    // turn logic here, also mark the flags like +2 or the stop or + etc...
    if (boardLogic.currentCard.number === 2) {
        // only +2 is plyble at this point
        return iCard.number === 2;
    }
    else if (iCard.number === 12) {
        // change color, player need to select
    }
    else if (iCard.color === boardLogic.currentCard.color || iCard.number === boardLogic.currentCard.number) {
        if (iCard.number == 2) {
            boardLogic.punishNumber += 2;
        }
        else if (iCard.number == 10) {
            boardLogic.openTaki = true;
        }
        return true;
    }

    return false;
}

boardLogic.closeTaki = function () {
    boardLogic.openTaki = false;
}

boardLogic.setPlayerTurn = function (iIsFromDeck) {
    if (iIsFromDeck) {
        boardLogic.currentPlayer++;
    }
    else {
        if (boardLogic.openTaki || boardLogic.currentCard.number === 13) {
            // do not change player
        }
        else {
            boardLogic.currentPlayer++;
            if (boardLogic.currentCard.number === 11) {
                // skip player
                boardLogic.currentPlayer++;
            }
        }
    }

    boardLogic.currentPlayer = boardLogic.currentPlayer % boardLogic.numberOfPlayers;

    if (utility.debug) {
        console.log("current Player turn Id is: " + boardLogic.currentPlayer);
    }
    setTimeout(boardLogic.makeAiMove, 2000);
}

boardLogic.makeAiMove = function () {
    if (boardLogic.currentPlayer === aiPlayer.playerId) {
        if (utility.debug) {
            console.log("calling for Ai to make move");
        }

        aiPlayer.makeMove();
    }
}

boardLogic.checkPlayersTurn = function (iPlayerId) {
    if (!boardLogic.currentPlayer) {
        boardLogic.currentPlayer = iPlayerId;
    }
    return boardLogic.currentPlayer === iPlayerId
}

// UI manipulation section
boardLogic.loadUI = function () {
    lobby.removeFromView();
    boardLogic.divInDOM = document.querySelector(".board");
    boardLogic.divInDOM.style.display = utility.displayActive;

    boardLogic.init();
    playerLogic.init();
    aiPlayer.init();

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
    boardLogic.printCurrentCard();
}
