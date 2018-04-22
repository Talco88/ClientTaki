var playerLogic = {};
playerLogic.playerId = 0;

playerLogic.init = function () {
    playerLogic.Hand = boardLogic.getFirsdHandOfCards();
    playerLogic.printCadsToUser();
    playerLogic.initUIData();
}

// the function get a card and try to make a move, if the move is llegal the remove the card, else return string with error
playerLogic.playSelectedCard = function (iCardIndex, iCard) {

    if (boardLogic.getCardFromPlayer(iCard, playerLogic.playerId))
    {
        // move was verify.
        // remove icard from hand.
        var index = -1;
        for (var i = 0; i < playerLogic.Hand.length; i++) {
            if (playerLogic.Hand[i].color === iCard.color && playerLogic.Hand[i].number === iCard.number) {
                index = i;
                break;
            }
        }

        if (index > -1) {
            playerLogic.Hand.splice(index, 1);
            playerLogic.printCadsToUser();
        }
        return "";
    }
    else {
        return "Move is Illegal";
    }
}

playerLogic.drowCardsFromDeck = function () {
    /// add validation that the player have no other option
    var cards = boardLogic.drowCardsFromDeck(playerLogic.playerId);
    if (cards && cards.length > 0) {
        playerLogic.Hand = playerLogic.Hand.concat(cards);
        playerLogic.printCadsToUser();
    }
    else {
        if (utility.debug) {
            console.log("try to pull card not in turn");
        }
    }
}

playerLogic.initUIData = function () {
    document.getElementById("deckCards").onclick = playerLogic.drowCardsFromDeck;
}

playerLogic.printCadsToUser = function () {
    var playersCards = document.getElementById("playersCards");
    playersCards.innerHTML = "";
    for (var i = 0; i < playerLogic.Hand.length; i++) {
        var card = playerLogic.Hand[i];
        playersCards.appendChild(utility.getCardHtml(card, playerLogic.onclickedCard));
    }
    utility.manageCardsmargin(".player-cards .taki-card");
}

playerLogic.onclickedCard = function (iElement) {
    var number = iElement.currentTarget.classList[0];
    var color = iElement.currentTarget.classList[1];
    var cardId = iElement.currentTarget.classList[2];
    var selectedCard = null;
    var index = -1;
    var i = 0;
    playerLogic.Hand.forEach(function (card) {
        if (card.id == cardId) {
            selectedCard = card;
            index = i;
        }
        i++;
    })

    if (index >= 0) {
        var responce = playerLogic.playSelectedCard(index, selectedCard);
        if (responce != "") {
            if (utility.debug) {
                console.log(responce);
            }
        }
    }
    else {
        alert("unable to find the card");
    }

    if (utility.debug) {
        console.log("card Selected, id: " + cardId + "  located at: " + index);
    }
}