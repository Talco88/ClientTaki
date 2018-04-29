var playerLogic = {};
playerLogic.playerId = 0;

playerLogic.init = function () {
    playerLogic.isAborted = false;
    playerLogic.Hand = boardLogic.getFirsdHandOfCards();
    boardUI.printPlayerCadsToUser(playerLogic.Hand);
    boardUI.initDecUIData(playerLogic.drowCardsFromDeck);
}

// the function get a card and try to make a move, if the move is llegal the remove the card, else return string with error
playerLogic.playSelectedCard = function (iCardIndex, iCardId, iCard) {

    if (boardLogic.getCardFromPlayer(iCard, playerLogic.playerId))
    {
        if (iCardIndex > -1) {
            playerLogic.Hand.splice(iCardIndex, 1);
            boardUI.printPlayerCadsToUser(playerLogic.Hand);

            if (playerLogic.Hand.length === 1) {
                boardLogic.updateOneCard();
            }
            boardLogic.checkGameFinish();
        }
        return "";
    }
    else {
        utility.displayPopUp("Move is illegal... \nLet's try another card");
        return "Move is Illegal";
    }
}

playerLogic.drowCardsFromDeck = function () {
    var logicMessage = boardLogic.validateUserInteraction(playerLogic.playerId);
    if (logicMessage != "") {
        utility.displayPopUp(logicMessage);
    }
    else if (boardLogic.validateNoOtherOptionsToPlay(playerLogic.Hand)) {
        var cards = boardLogic.drowCardsFromDeck(playerLogic.playerId);
        if (cards && cards.length > 0) {
            playerLogic.Hand = playerLogic.Hand.concat(cards);
            boardUI.printPlayerCadsToUser(playerLogic.Hand);
        }
        else {
            if (utility.debug) {
                console.log("try to pull card not in turn");
            }
        }
    }
    else {
        utility.displayPopUp("Hold on, let's not get too rush...\nLooks like you have some option to play");
        if (utility.debug) {
            console.log("try to pull whie there are other options to play");
        }
    }
}

playerLogic.onclickEndGame = function () {
    playerLogic.isAborted = true;
    boardLogic.playerEndedGame();
}

playerLogic.onclickedCard = function (iElement) {
    var number = iElement.currentTarget.classList[0];
    var color = iElement.currentTarget.classList[1];
    var cardId = iElement.currentTarget.classList[2];
    var selectedCard = null;
    var index = -1;
    var i = 0;
    
    var logicMessage = boardLogic.validateUserInteraction(playerLogic.playerId, true);
    if (logicMessage != "") {
        utility.displayPopUp(logicMessage);
    }
    else {
        playerLogic.Hand.forEach(function (card) {
            if (card.id == cardId) {
                selectedCard = card;
                index = i;
            }
            i++;
        })

        if (index >= 0) {
            var responce = playerLogic.playSelectedCard(index, cardId, selectedCard);
            if (responce != "") {
                if (utility.debug) {
                    console.log(responce);
                }
            }
        }
        else {
            utility.displayPopUp("Ouppsy, unable to find the card");
        }

        if (utility.debug) {
            console.log("card Selected, id: " + cardId + "  located at: " + index);
        }
    }
}