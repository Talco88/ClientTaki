var boardLogic = {};

boardLogic.firstHandDivision = 8;
boardLogic.IsInit = false;
boardLogic.punishNumber = 0;
boardLogic.cardColors = Object.freeze({ 0: "Green", 1: "Red", 2: "Yellow", 3: "Blue", 4: "Non" });
boardLogic.cardOptions = Object.freeze({ 1: "1", 2: "+2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "TAKI", 11: "Stop", 12: "CC", 13: "+" });
boardLogic.numberOfPlayers = 2;
boardLogic.totalNumberOfRounds = 0;
boardLogic.totalPlayTime = 0;
boardLogic.changColorSelection = 4;
boardLogic.debugdeckOfCards = false;

////****
///  Oppen Issues:
///      Playing Taki is not finilize + change Color os not working! need to add statistics
////  AI not responceing to change color and cant play it itself
///******


boardLogic.init = function () {
    boardLogic.runId = 0;
    boardLogic.totalNumberOfPlay = 0;
    boardLogic.totalPlayTime = 0;
    boardLogic.deckOfCards = [];
    boardLogic.trashDeck = [];
    boardLogic.openTaki = false;
    boardLogic.isGameFinish = false;
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

        if (utility.debug && boardLogic.debugdeckOfCards) {
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
            boardLogic.printCurrentCard();
            boardLogic.openUISelection();
            boardLogic.setPlayerTurn(false);
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
    else if (boardLogic.openTaki) {
        // only taki color card are allow
        return iCard.color === boardLogic.currentCard.color;
    }
    else if (iCard.color === boardLogic.currentCard.color || iCard.color === boardLogic.changColorSelection || iCard.number === boardLogic.currentCard.number) {
        if (iCard.number == 2) {
            boardLogic.punishNumber += 2;
        }
        else if (iCard.number == 10) {
            boardLogic.openTaki = true;
        }

        if (boardLogic.currentCard.number === 12) {
            // the move after the change color need to reset it.
            boardLogic.changColorSelection = 4;
            boardLogic.removechangeColor();
        }
        return true;
    }

    return false;
}

boardLogic.closeTaki = function () {
    boardLogic.openTaki = false;
    var closeTaki = document.querySelector(".close-taki");
    closeTaki.style.display = utility.displayHidden;
    boardLogic.setPlayerTurn(true);
}

boardLogic.setPlayerTurn = function (iIsForceNextPlayer) {
    if (iIsForceNextPlayer) {
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
    boardLogic.totalNumberOfPlay++;

    if (utility.debug) {
        console.log("current Player turn Id is: " + boardLogic.currentPlayer + "  turn Number: " + boardLogic.totalNumberOfPlay);
    }
    if (boardLogic.currentCard.number != 12) {
        // only if not wating to change color   
        setTimeout(boardLogic.makeAiMove, aiPlayer.moveDelay);
    }

    if (aiPlayer.Hand.length === 0 || playerLogic.Hand.length === 0) {
        boardLogic.isGameFinish = true;
        if (utility.debug) {
            var winner = (aiPlayer.Hand.length === 0)? "computer" : "Human";
            console.log("game finish, and " + winner + " won!!");
        }
    }
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
    if (boardLogic.isGameFinish) {
        if (utility.debug) {
            console.log("game finish, unable to make move!");
        }
        return;
    }

    if (!boardLogic.currentPlayer) {
        boardLogic.currentPlayer = iPlayerId;
    }

    if (boardLogic.currentPlayer != iPlayerId && iPlayerId != aiPlayer.playerId) {
        // playr try to play, in case AI miss a turn
        setTimeout(boardLogic.makeAiMove, aiPlayer.moveDelay);
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

    display = document.querySelector('#time');
    utility.displayStats(display);

    var endTakiBtn = document.querySelector(".end-taki-button");
    endTakiBtn.onclick = boardLogic.closeTaki;

    var colrBtns = document.querySelectorAll(".color-button");
    if (colrBtns && colrBtns.length > 0) {
        for (var i = 0; i < colrBtns.length; i++) {
            colrBtns[i].onclick = boardLogic.onSelectedColorclick;
        }
    }
}

boardLogic.removeFromView = function () {
    boardLogic.divInDOM.style.display = utility.displayHidden;
}

boardLogic.openUISelection = function () {
    if (aiPlayer && aiPlayer.playerId === boardLogic.currentPlayer) {
    // AI no need to show the UI extentions
        return;
    }
    if (boardLogic.currentCard.number === 12) {
        // CC
        var colorSelection = document.querySelector(".color-selection");
        colorSelection.style.display = utility.displayActive;
    }
    else if (boardLogic.currentCard.number === 10) {
        // TAKI
        var closeTaki = document.querySelector(".close-taki");
        closeTaki.style.display = utility.displayActive;
    }
}

boardLogic.removechangeColor = function () {
    var colorSelection = document.getElementById("currentCard");
    colorSelection.style.color = null;
}

boardLogic.onSelectedColorclick = function (iElement) {
    var color = iElement.currentTarget.classList[1];
    var colorNumber = 4;
    for (var i = 0; i < Object.keys(boardLogic.cardColors).length; i++) {
        if (boardLogic.cardColors[i].toUpperCase() == color.toUpperCase()){
            colorNumber = i;
        }
    }
    if (colorNumber < 4 && colorNumber > -1) {
        boardLogic.changColorSelection = colorNumber;
    }

    var colorSelection = document.querySelector(".color-selection");
    colorSelection.style.display = utility.displayHidden;

    var colorSelection = document.getElementById("currentCard");
    colorSelection.style.color = boardLogic.cardColors[colorNumber];

    setTimeout(boardLogic.makeAiMove, aiPlayer.moveDelay);
}