import {BoardLogicClass} from "./BoardLogic.js";

let _PlatformInstance = null;
export default class Platform {
    // singelton platform
    constructor(){
        if(_PlatformInstance){
            return _PlatformInstance;
        }

        _PlatformInstance = this;
        this.debug = true;
        this.isTurnament = false;
        this.isDisplayLobbyStats = false;
        this.playerId = 0;
        this.aiPlayerId = 1;
        this.gameTime = 0;
        this.playerTimer = 0;
        this.uiUpdateInterval = 150;
        let boardFactory = new BoardLogicClass();
        this.boardState = boardFactory.getBoardState(this.debug);
        this.boardState.init();
    }

    resetGame(){
        this.boardState.init();
    }

    getPlayerHand(iPlayerId){
        if (this.boardState != null){
            return this.boardState.getPlayerHand(iPlayerId);
        }
        if (this.debug){
            console.log("boardState is not initiate");
        }
        return null;
    }

    getOtherPlayerHand(iOtherPlayerId){
        if (this.boardState != null){
            return this.boardState.getOtherPlayerHand(iOtherPlayerId);
        }
        if (this.debug){
            console.log("boardState is not initiate");
        }
        return null;
    }

    getOpenCard(){
        if (this.boardState != null){
            this.isDisplayLobbyStats = true;
            return this.boardState.getCurrentCard();
        }
        if (this.debug){
            console.log("boardState is not initiate");
        }
        return null;
    }

    getSelectedColor(){
        if (this.boardState != null){
            return this.boardState.getSelectedColor();
        }
        if (this.debug){
            console.log("boardState is not initiate");
        }
        return null;
    }

    getCurrentPlayer(){
        return this.boardState.getCurrentPlayer();
    }

    getIsTakiOpen(){
        return this.boardState.getIsTakiOpen();
    }

    setCloseTaki(){
        return this.boardState.closeTaki(this.playerId);
    }

    getIsWatingForCahngeColor(){
        return this.boardState.getIsWatingForCahngeColor();
    }

    setNewColorString(iColorText){
        this.boardState.setChangeColorFromString(iColorText, this.playerId);
    }

    getCardsFromDeck(iPlayerId){
        var logicMessage = this.boardState.validateUserInteraction(iPlayerId);
        if (logicMessage != "") {
            console.log(logicMessage);
            //utility.displayPopUp(logicMessage);
        }
        else if (this.boardState.validateNoOtherOptionsToPlay(iPlayerId)) {
            var cards = this.boardState.drowCardsFromDeck(iPlayerId);
            if (cards && cards.length > 0) {
                //playerLogic.Hand = playerLogic.Hand.concat(cards);
                //boardUI.printPlayerCardsToUser(playerLogic.Hand);
            }
            else {
                if (this.debug) {
                    console.log("try to pull card not in turn");
                }
            }
        }
        else {
            //utility.displayPopUp("Let's not get too rush...\nLooks like you have some option to play");
            if (this.debug) {
                console.log("try to pull whie there are other options to play");
            }
        }
    }

    historyNext(){
        this.boardState.moveUpHistoryIndex();
    }

    historyPrev(){
        this.boardState.moveDownHistoryIndex();
    }

    playSelectCard(iCardIndex, iCard, iPlayerId, iComponent){
        if (this.boardState.getCardFromPlayer(iCard, iPlayerId))
        {
            if (iCardIndex > -1) {
                // state
                let cards = this.boardState.removeCardFromPlayer(iCardIndex, iPlayerId);
                iComponent.setCards(cards);
                //boardUI.printPlayerCardsToUser(playerLogic.Hand);

                if (cards.length === 1) {
                    this.boardState.updateOneCard();
                }
                this.boardState.checkGameFinish();
            }
            return "";
        }
        else {
            let message = "Move is illegal... \nLet's try another card";
            //utility.displayPopUp(message);
            if (this.debug){
                console.log(message);
            }
            return "Move is Illegal";
        }
    }

    getTotalNumberOfTurns(){
        return this.boardState.totalNumberOfPlay;
    }

    getTimesPlayerGotOneCard(){
        return this.boardState.timesPlayerGotOneCard;
    }

    getIsGameFinished(){
        return this.boardState.getIsGameEnded();
    }

    isUserCurrentTurn(iIsPlayMove){
        if (this.boardState != null){
            return this.boardState.validateUserInteraction(this.playerId, iIsPlayMove);
        }
        if (this.debug){
            console.log("boardState is not initiate");
        }
        return null;
    }

    displayPlayer () {
        return this.boardState.displayPlayer();
    }

    gameEnded(){
        return 1/0;
    }
}

export {Platform};