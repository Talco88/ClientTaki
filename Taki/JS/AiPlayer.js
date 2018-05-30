class AiPlayerClass {
    constractor(args) {}

    getAiState(iBoard){
        var aiPlayer = {}
        aiPlayer.playerId = 1;
        aiPlayer.boardLogic = iBoard;

        aiPlayer.init = function (iCards) {
            aiPlayer.isCurrentlyMakingMove = false;
            aiPlayer.Hand = iCards;
        }

        aiPlayer.drowCardsFromDeck = function () {
            aiPlayer.Hand = this.boardLogic.drowCardsFromDeck(aiPlayer.playerId);
        }

        aiPlayer.makeMove = function () {
            var index = -1;
            var changecolorIndex = 0;
            var i = 0;
            var selectCard = null;
            var changeColor = null;
            aiPlayer.Hand = this.boardLogic.getPlayerHand(aiPlayer.playerId);

            // validate that that the turn is the ai after the delay.
            if (this.boardLogic.currentPlayer === aiPlayer.playerId && !aiPlayer.isCurrentlyMakingMove) {
                aiPlayer.isCurrentlyMakingMove = true; // locking in case of double calls
                if (this.boardLogic.openTaki &&
                    (this.boardLogic.isCardInTheSameNumberExsist(aiPlayer.Hand, 11) ||
                     this.boardLogic.isCardInTheSameNumberExsist(aiPlayer.Hand, 13))) {
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

                    for(let specialCard of aiPlayer.Hand){
                        if (specialCard.number === 11) {
                            numberOfStops++;
                        }
                        if (specialCard.number === 13) {
                            numberOfPlus++;
                        }

                        if (this.boardLogic.checkCardTakiColorWithBoard(specialCard)) {
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
                    }

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
                    for (let card of aiPlayer.Hand){
                        if (this.boardLogic.currentCard.number === 2 && this.boardLogic.punishNumber > 0)
                        {
                            if (this.boardLogic.currentCard.number === card.number){
                                selectCard = card;
                                index = i;
                            }
                        }
                        else if (this.boardLogic.openTaki) {
                            // since taki is open, only same color.
                            if (this.boardLogic.checkCardTakiColorWithBoard(card)) {
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

                            if (this.boardLogic.currentCard.number === card.number ||
                                (this.boardLogic.currentCard.color === card.color && this.boardLogic.changColorSelection === 4) ||
                                (this.boardLogic.changColorSelection < 4 && card.color === this.boardLogic.changColorSelection)) {
                                if (selectCard == null && card.number != 12) {
                                    selectCard = card;
                                    index = i;
                                }
                                else if (card.number === 10 || card.number === 13) {
                                    if (this.boardLogic.isCardInTheSameColorExsist(aiPlayer.Hand, card.color)) {
                                        // + or taki are better option...
                                        selectCard = card;
                                        index = i;
                                    }
                                }
                            }
                        }
                        i++;
                    }
                }

                if (selectCard == null && changeColor == null) {
                    if (this.boardLogic.openTaki) {
                        this.boardLogic.closeTaki(aiPlayer.playerId);
                        selectCard = "AI close taki";
                    }
                    else {
                        var cards = this.boardLogic.drowCardsFromDeck(aiPlayer.playerId);
                        if (cards && cards.length > 0) {
                            aiPlayer.Hand = aiPlayer.Hand.concat(cards);
                        }
                        else {
                            if (this.boardLogic.debug) {
                                console.log("AI try to pull card not in turn");
                            }
                        }
                        selectCard = "take card form deck";
                    }
                }
                else if (selectCard == null && changeColor != null) {
                    // play the change color
                    if (this.boardLogic.getCardFromPlayer(changeColor, aiPlayer.playerId)) {
                        this.boardLogic.removeCardFromPlayer(changecolorIndex, aiPlayer.playerId);
                    }
                    var selectedColor = aiPlayer.getColorWithMaxCards();
                    /*////////////////////////////////////////////////////////////////////////////////////////
                    TODO: find way update the UI in case of change color
                    ////////////////////////////////////////////////////////////////////////////////////////*/
                    this.boardLogic.setChangeColor(selectedColor, aiPlayer.playerId)
                    //boardUI.setSelectedChangeColor(selectedColor, aiPlayer.playerId);

                    selectCard = "change color with color: " + this.boardLogic.cardColors[selectedColor];
                }
                else {
                    if (this.boardLogic.getCardFromPlayer(selectCard, aiPlayer.playerId)) {
                        this.boardLogic.removeCardFromPlayer(index, aiPlayer.playerId);
                    }
                }

                if (this.boardLogic.debug) {
                    console.log("AI play the following: ");
                    console.log(selectCard);
                }

                /////////////////////////////////////////////////aiPlayer.printAiCards();
                aiPlayer.isCurrentlyMakingMove = false;
            }

            if (aiPlayer.Hand.length === 0) {
                this.boardLogic.checkGameFinish();
            }
            else if (aiPlayer.Hand.length === 1) {
                this.boardLogic.updateOneCard();
            }
        }

        aiPlayer.getColorWithMaxCards = function () {
            var red = 0;
            var blue = 0;
            var green = 0;
            var yellow = 0;

            for (let c of aiPlayer.Hand){
            //aiPlayer.Hand.forEach(function (c) {
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
            }

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

        return aiPlayer;
    }

}

export {AiPlayerClass};