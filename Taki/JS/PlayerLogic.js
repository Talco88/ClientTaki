var playerLogic = {};

playerLogic.init = function () {
    playerLogic.Hand = boardLogic.getFirsdHandOfCards();
}

playerLogic.playSelectedCard = function (iCard) {
    if (boardLogic.getCardFromPlayer(iCard)) {
        var index = -1;
        // move was verify.
        // remove icard from hand.
        for (var i = 0; i < playerLogic.Hand.length; i++) {
            if (playerLogic.Hand[i].color === iCard.color && playerLogic.Hand[i].number === iCard.number) {
                index = i;
                break;
            }
        }

        if (index > -1) {
            playerLogic.Hand.splice(index, 1);
        }
    }
    else {
        return "Move is Illegal";
    }
}

playerLogic.drowCardsFromDeck = function () {
    playerLogic.Hand = playerLogic.Hand.concat(boardLogic.drowCardsFromDeck());
}