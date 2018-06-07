import {AiPlayerClass} from "./AiPlayer.js";

///////////////////////////////////////////////////////////////////
/////  avrage time per turn per human player not working....
////    BUG::: super taki on top of super taki may couse it to be non colored   
////  BUG::: 2+ in taki may cous to allow put other +2 in diffrant color! - shuld be fix
////
///////////////////////////////////////////////////////////////////

class BoardLogicClass {
    constractor(arg){};

    getBoardState(iIsDebug){
        var boardLogic = {};

        boardLogic.firstHandDivision = 8;
        boardLogic.IsInit = false;
        boardLogic.cardColors = Object.freeze({ 0: "Green", 1: "Red", 2: "Yellow", 3: "Blue", 4: "Non" });
        boardLogic.cardOptions = Object.freeze({ 1: "1", 2: "+2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "TAKI", 11: "Stop", 12: "CC", 13: "+" });
        boardLogic.debugdeckOfCards = false;
        boardLogic.isDebug = iIsDebug;
        boardLogic.moveDelay = 400;
        let aiFactory = new AiPlayerClass();
        boardLogic.aiPlayer = aiFactory.getAiState(boardLogic);

        boardLogic.init = function () {
            boardLogic.numberOfPlayers = 2;
            boardLogic.runId = 0;
            boardLogic.totalNumberOfPlay = 0;
            boardLogic.totalPlayTime = 0;
            boardLogic.timesPlayerGotOneCard = 0;
            boardLogic.totalNumberOfRounds = 0;
            boardLogic.changColorSelection = 4;
            boardLogic.punishNumber = 0;
            boardLogic.deckOfCards = [];
            boardLogic.trashDeck = [];
            boardLogic.history = [];
            boardLogic.playersHands = [];
            boardLogic.openTaki = false;
            boardLogic.isPlayerQuit = false;
            boardLogic.isWatingForCahngeColor = false;
            boardLogic.currentPlayer = 0;
            boardLogic.isGameFinish = false;
            for (var i = 1; i <= Object.keys(boardLogic.cardOptions).length; i++) {
                for (var j = 0; j < (Object.keys(boardLogic.cardColors).length - 1); j++) {
                    boardLogic.addGeneratedCards(i, j);
                }
            }
            boardLogic.CreateSupperTaki();

            boardLogic.shuffleDeck(boardLogic.deckOfCards);
            boardLogic.IsInit = true;

            // first cards opem
            boardLogic.openFirstCard();

            // init player hands:
            boardLogic.initPlayersHands();
            boardLogic.AddToHistory();
        }

        boardLogic.initPlayersHands = function (){
            boardLogic.humanPlayerId = 0;
            boardLogic.aiPlayerId = 1
            
            for (var i = 0; i < boardLogic.numberOfPlayers; i++) {
                boardLogic.playersHands.push(boardLogic.getFirsdHandOfCards());
            }

            boardLogic.aiPlayer.init(boardLogic.playersHands[boardLogic.aiPlayerId]);
        }

        boardLogic.getIsTakiOpen = function(){
            return boardLogic.openTaki;
        }

        boardLogic.getCurrentCard = function(){
            let retVal = boardLogic.currentCard;
            if (boardLogic.isGameFinish){
                retVal = boardLogic.history[boardLogic.historyIndex].openCard;
            }
            return retVal;
        }

        boardLogic.getSelectedColor = function(){
            return {
                ColorNumber: boardLogic.changColorSelection, 
                ColorText: boardLogic.cardColors[boardLogic.changColorSelection]
            };
        }

        boardLogic.getPlayerHand = function(iPlayerId){
            /*//////////////////////////////////////////////////
            add player validation
            ////////////////////////////////////////////////*/
            let retVal = boardLogic.playersHands;
            if (boardLogic.isGameFinish){
                retVal = boardLogic.history[boardLogic.historyIndex].playerCards;
            }

            return retVal[iPlayerId];
        }

        boardLogic.removeCardFromPlayer = function(iCardIndex, iPlayerId){
            boardLogic.playersHands[iPlayerId].splice(iCardIndex, 1);
            boardLogic.AddToHistory();
            return boardLogic.playersHands[iPlayerId];
        }

        boardLogic.getOtherPlayerHand = function(iOtherPlayerId){
            // validation?
            return boardLogic.getPlayerHand(iOtherPlayerId);
        }

        boardLogic.openFirstCard = function () {
            var opendCard = boardLogic.getCardFromDeck();

            while (opendCard.number === 2 || opendCard.number > 9) {
                boardLogic.trowCardToTrash(boardLogic.currentCard);
                opendCard = boardLogic.getCardFromDeck();
            }

            boardLogic.currentCard = opendCard;
        }

        boardLogic.CreateSupperTaki = function () {
            // supper taki have special number of cards.
            boardLogic.deckOfCards.push(boardLogic.createCard(10, 4));
            boardLogic.deckOfCards.push(boardLogic.createCard(10, 4));
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
                color: color,
                option: boardLogic.cardOptions[number],
                displayColor: boardLogic.cardColors[color]
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
            if (boardLogic.checkPlayersTurn(iPlayerId) && !boardLogic.openTaki && !boardLogic.isWatingForCahngeColor) {
                var retCards = [];
                var numberOfCardsToDrow = 1;
                if (boardLogic.punishNumber > 0) {
                    numberOfCardsToDrow = boardLogic.punishNumber;
                    boardLogic.punishNumber = 0;
                }

                if (boardLogic.isDebug && boardLogic.debugdeckOfCards) {
                    console.log(boardLogic.deckOfCards);
                }
                boardLogic.setPlayerTurn(true);
                let addCards = boardLogic.getSomeCardsFromDeck(numberOfCardsToDrow);
                boardLogic.playersHands[iPlayerId] = boardLogic.playersHands[iPlayerId].concat(addCards);
                boardLogic.AddToHistory();
                return boardLogic.playersHands[iPlayerId];
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
                    boardLogic.setPlayerTurn(false);
                    return true;
                }
            }

            return false;
        }

        boardLogic.cardRooles = function (iCard){
            // turn logic here, also mark the flags like +2 or the stop or + etc...
            if (boardLogic.openTaki) {
                // only taki color card are allow
                if (boardLogic.checkCardTakiColorWithBoard(iCard))
                {
                    boardLogic.changColorSelection = 4;
                    return true;
                }
            }
            else if (boardLogic.currentCard.number === 2 && boardLogic.punishNumber > 0)
            {
                // only +2 is plyble at this point
                if(iCard.number === 2){
                    boardLogic.handlePlusTwoCard(iCard);
                    return true;
                }
            }
            else if (iCard.number === 10 && iCard.color === 4) {
                // super taki
                if (boardLogic.currentCard.number != 12){
                    if (boardLogic.changColorSelection === 4){ // if currently not active change color selection
                        boardLogic.changColorSelection = boardLogic.currentCard.color;
                    }
                }
                
                boardLogic.openTaki = true;
                return true;
            }
            else if (iCard.color === boardLogic.currentCard.color || iCard.color === boardLogic.changColorSelection || iCard.number === boardLogic.currentCard.number) {
                if (iCard.number == 10) {
                    boardLogic.openTaki = true;
                }

                boardLogic.handlePlusTwoCard(iCard);

                if (boardLogic.currentCard.color === 4) {
                    // the move after the change color need to reset it.
                    boardLogic.changColorSelection = 4;
                }
                return true;
            }

            return false;
        }

        boardLogic.checkCardTakiColorWithBoard = function (iCard) {
            return (iCard.color != 4 &&                                 // prevent change color in taki
                    (iCard.color === boardLogic.currentCard.color ||    // only same color in taki.
                     iCard.color === boardLogic.changColorSelection));    // in case of supper taki, only same selected color
        }

        boardLogic.handlePlusTwoCard = function(iCard){
            if (iCard.number == 2) {
                boardLogic.punishNumber += 2;
            }
        }

        boardLogic.closeTaki = function (iPlayerId) {
            if (iPlayerId === boardLogic.currentPlayer){
                if (boardLogic.openTaki) {
                    boardLogic.openTaki = false;
                    if (boardLogic.currentCard.number === 2){
                        // during taki inly the last +2 counted so all other are canceled
                        boardLogic.punishNumber = 2;
                    }
                    boardLogic.setPlayerTurn(false);
                    return "";
                }
                else{
                    return "taki is not open";
                }
            }
            else{
                return "this is not your turn";
            }
        }

        boardLogic.getCurrentPlayer = function(){
            return boardLogic.currentPlayer;
        }

        boardLogic.setPlayerTurn = function (iIsForceNextPlayer) {
            if (iIsForceNextPlayer) {
                boardLogic.currentPlayer++;
                boardLogic.checkGameFinish();
            }
            else {
                if (boardLogic.openTaki || boardLogic.currentCard.number === 13 || boardLogic.currentCard.number === 12) {
                    // do not change player
                    if (boardLogic.currentCard.number === 12) {
                        // change color, prevent all other events.
                        boardLogic.isWatingForCahngeColor = true;
                    }
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
            boardLogic.totalNumberOfRounds++;

            if (boardLogic.isDebug) {
                console.log("current Player turn Id is: " + boardLogic.currentPlayer + "  turn Number: " + boardLogic.totalNumberOfPlay);
            }

            setTimeout(boardLogic.makeAiMove, boardLogic.moveDelay);

        }

        boardLogic.getTotalNumberOfPlay = function(){
            let retVal = boardLogic.totalNumberOfRounds;
            if (boardLogic.isGameFinish){
                retVal = boardLogic.historyIndex;
            }
            return retVal;
        }

        boardLogic.getTimesPlayerGotOneCard = function() {
            let retVal = boardLogic.timesPlayerGotOneCard;
            if (boardLogic.isGameFinish){
                retVal = boardLogic.history[boardLogic.historyIndex].timesPlayerGotOneCard;
            }
            return retVal;
        }

        boardLogic.checkGameFinish = function () {
            if (boardLogic.currentCard.number != 13) {
                if (boardLogic.playersHands[boardLogic.aiPlayerId].length === 0 || boardLogic.playersHands[boardLogic.humanPlayerId].length === 0) {
                    boardLogic.finishGame();
                }
            }
        }

        boardLogic.getWinner = function() {
            if (boardLogic.isPlayerQuit){
                return "Hope you will finish the game next time,\n Computer win!";
            }
            let winner = (boardLogic.playersHands[boardLogic.aiPlayerId].length === 0) ? "Computer" : "You";
            return "game finish, and " + winner  + " win!!";
        }

        boardLogic.finishGame = function(){
            boardLogic.historyIndex = boardLogic.history.length - 1;
            boardLogic.isGameFinish = true;
            boardLogic.openTaki = false;
            boardLogic.isWatingForCahngeColor = false;
        }

        boardLogic.getNumberOfHistorySteps = function (){
            return boardLogic.history.length - 1;
        }

        boardLogic.getIsGameEnded = function(){
            return boardLogic.isGameFinish;
        }

        boardLogic.getIsWatingForCahngeColor = function(){
            return boardLogic.isWatingForCahngeColor;
        }

        boardLogic.setChangeColorFromString = function(iColorText, iPlayerId){
            if (boardLogic.isWatingForCahngeColor){
                var colorNumber = 4;
                for (var i = 0; i < Object.keys(boardLogic.cardColors).length; i++) {
                    if (boardLogic.cardColors[i].toUpperCase() == iColorText.toUpperCase()) {
                        colorNumber = i;
                    }
                }

                boardLogic.setChangeColor(colorNumber, iPlayerId);
            }
            boardLogic.makeAiMove();
        }

        boardLogic.setChangeColor = function (iColor, iPlayerId) {
            if (boardLogic.checkPlayersTurn(iPlayerId)){
                if (iColor < 4 && iColor > -1) {
                    boardLogic.changColorSelection = iColor;
                    boardLogic.setPlayerTurn(true);
                    boardLogic.isWatingForCahngeColor = false;
                    return true;
                }
            }
            return false;
        }

        boardLogic.makeAiMove = function () {
            if (boardLogic.currentPlayer === boardLogic.aiPlayerId) {
                setTimeout(function () {
                    if (boardLogic.currentPlayer === boardLogic.aiPlayerId) {
                        if (boardLogic.isDebug) {
                            console.log("calling for Ai to make move");
                        }

                        boardLogic.aiPlayer.makeMove();
                    }
                }, boardLogic.moveDelay);
            }
        }

        boardLogic.checkPlayersTurn = function (iPlayerId) {
            if (boardLogic.isGameFinish) {
                if (boardLogic.isDebug) {
                    console.log("game finish, unable to make move!");
                }
                return;
            }

            if (boardLogic.currentPlayer != iPlayerId && iPlayerId != boardLogic.aiPlayerId) {
                // player try to play, in case AI miss a turn
                boardLogic.makeAiMove();
            }
            return boardLogic.currentPlayer === iPlayerId
        }

        boardLogic.validateUserInteraction = function (iPlayerId, iIsPlayMove) {
            var stringMessage = "";

            if (boardLogic.openTaki && !iIsPlayMove) {
                stringMessage = "wait, don't take cards\nwhile there is an open taki....";
            }

            if (boardLogic.isWatingForCahngeColor) {
                stringMessage = "wait!\nNeed to select color first";
            }

            if (!boardLogic.checkPlayersTurn(iPlayerId)) {
                stringMessage = "Hold on, \nPlease wait for your turn";
            }

            return stringMessage;
        }

        boardLogic.validateNoOtherOptionsToPlay = function(iPlayerId){
            let cards = boardLogic.playersHands[iPlayerId];
            let checkColor = (boardLogic.currentCard.color === 4) ? boardLogic.changColorSelection : boardLogic.currentCard.color;
            if (
                    ((boardLogic.currentCard.number != 2 || boardLogic.punishNumber === 0) &&
                        (boardLogic.isCardInTheSameColorExsist(cards, boardLogic.currentCard.color) ||
                        boardLogic.isColorLessOptionCardAvilable(cards))) 
                    ||
                    boardLogic.isCardInTheSameNumberExsist(cards, boardLogic.currentCard.number)
                )
            {
                return false;
            }

            return true;
        }

        boardLogic.isColorLessOptionCardAvilable = function (iCards) {
            var retVal = false;
            iCards.forEach(function (card) {
                if (card.color === 4 && card.number != 10) {
                    retVal = true;
                }
            });
            return retVal;
        }

        boardLogic.isCardInTheSameColorExsist = function (iCards, iColor) {
            var retVal = false;
            if (iColor != 4){
                iCards.forEach(function(card){
                    if(card.color === iColor){
                        retVal = true;
                    }
                });
            }
            return retVal;
        }

        boardLogic.isCardInTheSameNumberExsist = function (iCards, iNumber) {
            var retVal = false;
            iCards.forEach(function (card) {
                if (card.number === iNumber && (iNumber != 10 || card.color != 4)) {
                    retVal = true;
                }
            });
            return retVal;
        }

        boardLogic.updateOneCard = function () {
            boardLogic.timesPlayerGotOneCard++;
        }

        boardLogic.playerEndedGame = function () {
            boardLogic.finishGame();
            boardLogic.isPlayerQuit = true;
        }

        boardLogic.AddToHistory = function () {
            boardLogic.totalNumberOfPlay++;
            let currentBoardState = {};
            currentBoardState.openCard = boardLogic.currentCard;
            currentBoardState.timesPlayerGotOneCard = boardLogic.timesPlayerGotOneCard;
            currentBoardState.playerCards = JSON.parse(JSON.stringify(boardLogic.playersHands));
            currentBoardState.playingPlayer = boardLogic.displayPlayer();
            boardLogic.history.push(currentBoardState);

        }

        boardLogic.moveUpHistoryIndex = function(){
            if (boardLogic.historyIndex < (boardLogic.history.length - 1)){
                boardLogic.historyIndex++;
            }

            if(boardLogic.isDebug){
                console.log("boardLogic.historyIndex: " + boardLogic.historyIndex);
            }
        }

        boardLogic.moveDownHistoryIndex = function(){
            if (boardLogic.historyIndex > 0){
                boardLogic.historyIndex--;
            }
            
            if(boardLogic.isDebug){
                console.log("boardLogic.historyIndex: " + boardLogic.historyIndex);
            }
        }

        boardLogic.displayPlayer = function () {
            if (boardLogic.isGameFinish) {
                return boardLogic.history[boardLogic.historyIndex].playingPlayer;
            }
            else {
                return (boardLogic.currentPlayer && boardLogic.currentPlayer === boardLogic.aiPlayerId) ? "Computer" : "You";
            }
        }

        boardLogic.CalculatePlayerTournamentScore = function(iPlayerId){
            let sumTotal = 0;
            let cards = boardLogic.playersHands[iPlayerId];
            for(let card of cards){
                if (card.number === 10 || card.number === 12){
                    sumTotal += 15;
                }
                else if (card.number === 11 || card.number === 13 || card.number === 2){
                    sumTotal += 10;
                }
                else{
                    sumTotal += card.number;
                }
            }
            return sumTotal;
        }

        return boardLogic;
    }
}

export {BoardLogicClass};
