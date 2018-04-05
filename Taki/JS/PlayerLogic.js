var playerLogic = {};

playerLogic.init = function () {
    playerLogic.Hand = boardLogic.getFirsdHandOfCards();
}

// the function get a card and try to make a move, if the move is llegal the remove the card, else return string with error
playerLogic.playSelectedCard = function (iCard) {
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