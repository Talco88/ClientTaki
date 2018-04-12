var aiPlayer = {}

aiPlayer.init = function () {
    aiPlayer.Hand = boardLogic.getFirsdHandOfCards();
}

aiPlayer.drowCardsFromDeck = function () {
    aiPlayer.Hand = aiPlayer.Hand.concat(boardLogic.drowCardsFromDeck());
}

aiPlayer.makeMove = function () {
    var index = 0;
    var i = 0;
    var selectCard = null;
    var changeColor = null;
    aiPlayer.Hand.forEach(function (card) {
        if (boardLogic.currentCard.number === 2) {
            // open card 2+, only 2+ is valid chois
            if (boardLogic.currentCard.number === card.number) {
                selectCard = card;
                index = i;
            }
        }
        else {
            if (changeColor == null) {
                if (boardLogic.currentCard.number === 12) {
                    changeColor = card;
                }
            }
            if (boardLogic.currentCard.number === card.number || boardLogic.currentCard.color === card.color) {
                if (selectCard == null) {
                    selectCard = card;
                    index = i;
                }
                else if (card.number === 10 || card.number === 13) {
                    // + or taki are bette option...
                    selectCard = card;
                    index = i;
                }
            }
        }
        i++;
    });

    if (selectCard == null) {
        // drow cards
    }
    else if (changeColor == null) {
        // play the change color
    }
    else {
        // try make move on selected card.
    }
}