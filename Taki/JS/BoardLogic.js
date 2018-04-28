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
///      Display statistic finilize in the lobby
///      Add: the avrage time to all the games
///******


boardLogic.init = function () {
    boardLogic.runId = 0;
    boardLogic.totalNumberOfPlay = 0;
    boardLogic.totalPlayTime = 0;
    boardLogic.timesPlayerGotOneCard = 0;
    boardLogic.deckOfCards = [];
    boardLogic.trashDeck = [];
    boardLogic.openTaki = false;
    boardLogic.currentPlayer = playerLogic.playerId;
    boardUI.closeTaki();
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

    while (opendCard.number === 2 || opendCard.number > 9) {
        boardLogic.trowCardToTrash(boardLogic.currentCard);
        opendCard = boardLogic.getCardFromDeck();
    }

    boardLogic.currentCard = opendCard;
    boardUI.printCurrentCard(boardLogic.currentCard);
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
            boardUI.printCurrentCard(boardLogic.currentCard);
            boardUI.openUISelection();
            boardLogic.setPlayerTurn(false);
            return true;
        }
    }

    return false;
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
            boardUI.removechangeColor();
        }
        return true;
    }

    return false;
}

boardLogic.closeTaki = function () {
    boardLogic.openTaki = false;
    boardLogic.setPlayerTurn(false);

    boardUI.closeTaki();
}

boardLogic.setPlayerTurn = function (iIsForceNextPlayer) {
    if (iIsForceNextPlayer) {
        boardLogic.currentPlayer++;
        boardLogic.checkGameFinish();
    }
    else {
        if (boardLogic.openTaki || boardLogic.currentCard.number === 13 || boardLogic.currentCard.number === 12) {
            // do not change player
        }
        else {
            boardLogic.currentPlayer++;
            if (boardLogic.currentCard.number === 11) {
                // skip player
                boardLogic.currentPlayer++;
            }
        }
        boardLogic.checkGameFinish();
    }

    boardLogic.currentPlayer = boardLogic.currentPlayer % boardLogic.numberOfPlayers;
    boardLogic.totalNumberOfPlay++;
    boardLogic.totalNumberOfRounds++;

    if (utility.debug) {
        console.log("current Player turn Id is: " + boardLogic.currentPlayer + "  turn Number: " + boardLogic.totalNumberOfPlay);
    }

    setTimeout(boardLogic.makeAiMove, aiPlayer.moveDelay);

}

boardLogic.checkGameFinish = function () {
    if (boardLogic.currentCard.number != 13) {
        if (aiPlayer.Hand.length === 0 || playerLogic.Hand.length === 0) {
            boardLogic.isGameFinish = true;
            utility.finishGame();
            if (utility.debug) {
                var winner = (aiPlayer.Hand.length === 0) ? "computer" : "Human";
                console.log("game finish, and " + winner + " won!!");
            }
        }
    }
}

boardLogic.setChangeColor = function (iColor, iPlayerId) {
    if (boardLogic.checkPlayersTurn(iPlayerId)){
        if (iColor < 4 && iColor > -1) {
            boardLogic.changColorSelection = iColor;
            boardLogic.setPlayerTurn(true);
            return true;
        }
    }
    return false;
}

boardLogic.makeAiMove = function () {
    if (boardLogic.currentPlayer === aiPlayer.playerId) {
        setTimeout(function () {
            if (boardLogic.currentPlayer === aiPlayer.playerId) {
                if (utility.debug) {
                    console.log("calling for Ai to make move");
                }

                aiPlayer.makeMove();
            }
        }, aiPlayer.moveDelay);
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
        // player try to play, in case AI miss a turn
        boardLogic.makeAiMove();
    }
    return boardLogic.currentPlayer === iPlayerId
}

boardLogic.validateNoOtherOptionsToPlay = function(iCards){
    if (boardLogic.isCardInTheSameColorExsist(iCards, boardLogic.currentCard.color) ||
        boardLogic.isCardInTheSameNumberExsist(iCards, boardLogic.currentCard.number) ||
        boardLogic.isColorLessOptionCardAvilable(iCards)) {
        return false;
    }

    return true;
}

boardLogic.isColorLessOptionCardAvilable = function (iCards) {
    var retVal = false;
    iCards.forEach(function (card) {
        if (card.color === 4) {
            retVal = true;
        }
    });
    return retVal;
}

boardLogic.isCardInTheSameColorExsist = function (iCards, iColor) {
    var retVal = false;
    iCards.forEach(function(card){
        if(card.color === iColor){
            retVal = true;
        }
    });
    return retVal;
}

boardLogic.isCardInTheSameNumberExsist = function (iCards, iNumber) {
    var retVal = false;
    iCards.forEach(function (card) {
        if (card.number === iNumber) {
            retVal = true;
        }
    });
    return retVal;
}

boardLogic.updateOneCard = function () {
    boardLogic.timesPlayerGotOneCard++;
}

boardLogic.playerEndedGame = function () {
    boardLogic.isGameFinish = true;
    utility.finishGame("Hope you will finish the game next time");
}
