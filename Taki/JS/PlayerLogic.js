var playerLogic = {};

playerLogic.init = function () {
    playerLogic.Hand = boardLogic.getFirsdHandOfCards();

    playerLogic.printCadsToUser();
}

// the function get a card and try to make a move, if the move is llegal the remove the card, else return string with error
playerLogic.playSelectedCard = function (iCardIndex, iCard) {

    if (boardLogic.getCardFromPlayer(iCard))
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
        }
        return "";
    }
    else {
        return "Move is Illegal";
    }
}

playerLogic.drowCardsFromDeck = function () {
    playerLogic.Hand = playerLogic.Hand.concat(boardLogic.drowCardsFromDeck());
}

playerLogic.printCadsToUser = function () {
    var playersCards = document.getElementById("playersCards");
    for (var i = 0; i < playerLogic.Hand.length; i++) {
        var card = playerLogic.Hand[i];
        playersCards.appendChild(utility.getCardHtml(card, playerLogic.onclickedCard));
    }
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
        playerLogic.playSelectedCard(index, selectedCard);
    }
    else {
        alert("unable to find the card");
    }
    alert("card Selected, id: " + cardId + "  located at: " + index);
}