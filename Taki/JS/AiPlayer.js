var aiPlayer = {}
aiPlayer.playerId = 1;
aiPlayer.moveDelay = 500;

aiPlayer.init = function () {
    aiPlayer.isCurrentlyMakingMove = false;
    aiPlayer.Hand = boardLogic.getFirsdHandOfCards();
    aiPlayer.printAiCards();
}

aiPlayer.drowCardsFromDeck = function () {
    aiPlayer.Hand = aiPlayer.Hand.concat(boardLogic.drowCardsFromDeck(aiPlayer.playerId));
}

aiPlayer.makeMove = function () {
    var index = -1;
    var changecolorIndex = 0;
    var i = 0;
    var selectCard = null;
    var changeColor = null;

    // validate that that the turn is the ai after the delay.
    if (boardLogic.currentPlayer === aiPlayer.playerId && !aiPlayer.isCurrentlyMakingMove) {
        aiPlayer.isCurrentlyMakingMove = true; // locking in case of double calls
        if (boardLogic.openTaki &&
            (boardLogic.isCardInTheSameNumberExsist(aiPlayer.Hand, 11) ||
             boardLogic.isCardInTheSameNumberExsist(aiPlayer.Hand, 13))) {
            // open taki, posible to put '+' or stop, looking for best option
            var numberOfPlus = 0;
            var numberOfStops = 0;
            var numberOfPlusInTakiColor = 0;
            var numberOfStopsInTakiColor = 0;
            var lookForNumber = -1;
            var plusIndex = -1;
            var stopIndex = -1;
            var regularCardIndex = -1;
            var subSelectionIndex = 0;

            aiPlayer.Hand.forEach(function (specialCard) {
                if (specialCard.number === 11) {
                    numberOfStops++;
                }
                if (specialCard.number === 13) {
                    numberOfPlus++;
                }

                if (specialCard.color === boardLogic.currentCard.color) {
                    if (specialCard.number === 13) {
                        numberOfPlusInTakiColor++;
                        plusIndex = subSelectionIndex;
                    }
                    else if (specialCard.number === 11) {
                        numberOfStopsInTakiColor++;
                        stopIndex = subSelectionIndex;
                    }
                    else {
                        regularCardIndex = subSelectionIndex;
                    }
                }
                subSelectionIndex++;
            });

            if (numberOfStopsInTakiColor > 0 && numberOfStops > numberOfStopsInTakiColor) {
                // posible stop bridges
                index = stopIndex;
                if (regularCardIndex > -1) {
                    index = regularCardIndex;
                }
            }
            else if (numberOfPlusInTakiColor > 0 && numberOfPlus > numberOfPlusInTakiColor) {
                //posible '+' bridges
                index = plusIndex;
                if (regularCardIndex > -1) {
                    index = regularCardIndex;
                }
            }


            if (index < 0) {
                // bridge is not possible, play the special cards now
                if (numberOfStopsInTakiColor > 0) {
                    index = stopIndex;
                }
                else if (numberOfPlusInTakiColor > 0) {
                    index = plusIndex;
                }
            }

            if (index > -1) {
                selectCard = aiPlayer.Hand[index];
            }
        }

        if (selectCard == null) {
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
                            changecolorIndex = i;
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
                            if (boardLogic.isCardInTheSameColorExsist(aiPlayer.Hand, card.color)) {
                                // + or taki are better option...
                                selectCard = card;
                                index = i;
                            }
                        }
                    }
                }
                i++;
            });
        }
        if (selectCard == null && changeColor == null) {
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
        else if (selectCard == null && changeColor != null) {
            // play the change color
            if (boardLogic.getCardFromPlayer(changeColor, aiPlayer.playerId)) {
                aiPlayer.Hand.splice(changecolorIndex, 1);
            }
            var selectedColor = aiPlayer.getColorWithMaxCards();
            boardUI.setSelectedChangeColor(selectedColor, aiPlayer.playerId);

            selectCard = "change color with color: " + boardLogic.cardColors[selectedColor];
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
        aiPlayer.isCurrentlyMakingMove = false;
    }

    if (aiPlayer.Hand.length === 0) {
        boardLogic.checkGameFinish();
    }
    else if (aiPlayer.Hand.length === 1) {
        boardLogic.updateOneCard();
    }
}

aiPlayer.getColorWithMaxCards = function () {
    var red = 0;
    var blue = 0;
    var green = 0;
    var yellow = 0;

    aiPlayer.Hand.forEach(function (c) {
        switch (c.color) {
            case 0:
                green++;
                break;
            case 1:
                red++;
                break;
            case 2:
                yellow++;
                break;
            case 3:
                blue++;
                break;
        }
    });

    var max = Math.max(red, blue, green, yellow);

    // this is irelevent if we have more then one color with 'max'number of cards
    if (green === max) {
        return 0;
    }
    if (red === max) {
        return 1;
    }
    if (yellow === max) {
        return 2;
    }
    if (blue === max) {
        return 3;
    }
}

aiPlayer.printAiCards = function () {
    var aisCards = document.getElementById("botCards");
    aisCards.innerHTML = "";
    for (var i = 0; i < aiPlayer.Hand.length; i++) {
        var card = aiPlayer.Hand[i];
        aisCards.appendChild(utility.flipedCard());
    }

    utility.updateBoardLayout();
}