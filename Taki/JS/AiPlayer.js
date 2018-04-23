var aiPlayer = {}
aiPlayer.playerId = 1;
aiPlayer.moveDelay = 1000;

aiPlayer.init = function () {
    aiPlayer.Hand = boardLogic.getFirsdHandOfCards();
    aiPlayer.printAiCards();
}

aiPlayer.drowCardsFromDeck = function () {
    aiPlayer.Hand = aiPlayer.Hand.concat(boardLogic.drowCardsFromDeck(aiPlayer.playerId));
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
        else if (boardLogic.openTaki) {
            // since taki is open, only same color.
            if (boardLogic.currentCard.color === card.color) {
                if (selectCard == null) {
                    selectCard = card;
                    index = i;
                }
            }
        }
        else {
            if (changeColor == null) {
                if (card.number === 12) {
                    changeColor = card;
                }
            }
            if (boardLogic.currentCard.number === card.number ||
                (boardLogic.currentCard.color === card.color && boardLogic.changColorSelection === 4) ||
                (boardLogic.changColorSelection < 4 && card.color === boardLogic.changColorSelection)) {
                if (selectCard == null && card.number != 12) {
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
        if (boardLogic.openTaki) {
            boardLogic.closeTaki();
            selectCard = "AI close taki";
        }
        else {
            var cards = boardLogic.drowCardsFromDeck(aiPlayer.playerId);
            if (cards && cards.length > 0) {
                aiPlayer.Hand = aiPlayer.Hand.concat(cards);
            }
            else {
                if (utility.debug) {
                    console.log("AI try to pull card not in turn");
                }
            }
            selectCard = "take card form deck";
        }

        
    }
    else if (changeColor != null) {
        // play the change color
    }
    else {
        if (boardLogic.getCardFromPlayer(selectCard, aiPlayer.playerId)) {
            aiPlayer.Hand.splice(index, 1);
        }
    }

    if (utility.debug) {
        console.log("AI play the following: ");
        console.log(selectCard);
    }


    aiPlayer.printAiCards();
}

aiPlayer.printAiCards = function () {
    var aisCards = document.getElementById("botCards");
    aisCards.innerHTML = "";
    for (var i = 0; i < aiPlayer.Hand.length; i++) {
        var card = aiPlayer.Hand[i];
        aisCards.appendChild(utility.flipedCard());
    }
    utility.manageCardsmargin(".bot-card-display");
}