import {BoardLogicClass} from "./BoardLogic.js";

let _PlatformInstance = null;
export default class Platform {
    // singelton platform
    constructor(iUICallback){
        if(_PlatformInstance){
            return _PlatformInstance;
        }

        _PlatformInstance = this;
        this.Callback = iUICallback;
        this.debug = false;
        this.isTurnament = false;
        this.isDisplayLobbyStats = false;
        this.playerId = 0;
        this.aiPlayerId = 1;
        this.gameTime = 0;
        this.playerTimer = 0;
        this.uiUpdateInterval = 150;
        this.unifyCardWidth = 110;
        this.MessageToPlayer = "";
        this.popupMessage = "";
        this.gameMode = 0;
        this.numberOfTurnametGames = 3;
        this.showPopupClose = false;
        this.currentTurnamentFinish = false;
        let boardFactory = new BoardLogicClass();
        this.boardState = boardFactory.getBoardState(this.debug);
        this.boardState.init();
    }

    resetGame(iIsRerender = true){
        this.boardState.init();
        this.showPopupClose = false;
        this.currentTurnamentFinish = false;
        this.MessageToPlayer = "";
        this.popupMessage = "";
        this.gameTime = 0;
        if (this.gameMode === 1){
            this.humanPlayerScore = 0;
            this.aiPlayerScore = 0;
            this.numberOfGames = 0;
        }
        if (iIsRerender){
            this.updateUIAfterChanges();
        }
        this.isWaitingForFinalTurnamentMessage = true;
    }

    updateUIData(){
        setTimeout(this.updateUIAfterChanges.bind(this), 1); // in some cases nees some delay to update all changes
        this.updateUIDelay();
    }

    updateUIDelay(){
        setTimeout(this.updateUIAfterChanges.bind(this), 700);
    }

    updateUIAfterChanges(){
        this.Callback(this.getOpenCard(), this.getPlayerHand(this.playerId), this.getOtherPlayerHand(this.aiPlayerId));
        if (this.getCurrentPlayer() === this.aiPlayerId){
            this.updateUIDelay();
        }
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

    getNumberOfHistorySteps(){
        return this.boardState.getNumberOfHistorySteps();
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
        this.MessageToPlayer = this.boardState.closeTaki(this.playerId);
        this.updateUIData();
    }

    getIsWatingForCahngeColor(){
        return this.boardState.getIsWatingForCahngeColor();
    }

    setNewColorString(iColorText){
        this.boardState.setChangeColorFromString(iColorText, this.playerId);
        this.updateUIData();
    }

    getCardsFromDeck(iPlayerId){
        this.MessageToPlayer = "";
        if (!this.getIsGameFinished()){
            var logicMessage = this.boardState.validateUserInteraction(iPlayerId);
            if (logicMessage != "") {
                if (this.debug){
                    console.log(logicMessage);
                }
                this.MessageToPlayer = logicMessage;
            }
            else if (this.boardState.validateNoOtherOptionsToPlay(iPlayerId)) {
                var cards = this.boardState.drowCardsFromDeck(iPlayerId);
                if (cards && cards.length > 0) {

                }
                else {
                    if (this.debug) {
                        console.log("try to pull card not in turn");
                    }
                }
            }
            else {
                this.MessageToPlayer = "Let's not get too rush...\nLooks like you have some option to play";
                if (this.debug) {
                    console.log("try to pull whie there are other options to play");
                }
            }
        }
        this.updateUIData();
    }

    historyNext(){
        this.boardState.moveUpHistoryIndex();
        this.updateUIAfterChanges();
    }

    historyPrev(){
        this.boardState.moveDownHistoryIndex();
        this.updateUIAfterChanges();
    }

    playSelectCard(iCardIndex, iCard, iPlayerId, iComponent){
        this.MessageToPlayer = "";
        if(!this.getIsGameFinished()){
            if (this.boardState.getCardFromPlayer(iCard, iPlayerId))
            {
                if (iCardIndex > -1) {
                    // state
                    let cards = this.boardState.removeCardFromPlayer(iCardIndex, iPlayerId);
                    iComponent.setCards(cards);

                    if (cards.length === 1) {
                        this.boardState.updateOneCard();
                    }
                    this.boardState.checkGameFinish();
                }
            }
            else {
                let message = "Move is illegal... \nLet's try another card";
                this.MessageToPlayer = message;
                if (this.debug){
                    console.log(message);
                }
            }
        }
        this.updateUIData();
    }

    getTotalNumberOfTurns(){
        return this.boardState.getTotalNumberOfPlay();
    }

    getTimesPlayerGotOneCard(){
        return this.boardState.getTimesPlayerGotOneCard();
    }

    getIsGameFinished(){
        if (this.numberOfGames && this.numberOfGames >= 0 && this.boardState.getIsGameEnded() && !this.currentTurnamentFinish){
            this.calculatePlayerScores();
            this.popupMessage = "Current round: " + ( this.numberOfTurnametGames - this.numberOfGames + 1) +" has finished.\nIncluding this game scores are: \n   Human:  " + this.humanPlayerScore + "\n   AI:      " + this.aiPlayerScore;
            this.numberOfGames--;
            this.currentTurnamentFinish = true;
        }

        return this.boardState.getIsGameEnded();
    }

    isUserCurrentTurn(iIsPlayMove){
        if (this.boardState != null){
            let retVal = this.boardState.validateUserInteraction(this.playerId, iIsPlayMove);
            this.MessageToPlayer = retVal;
            return retVal;
        }
        if (this.debug){
            console.log("boardState is not initiate");
        }
        return null;
    }

    displayPlayer () {
        return this.boardState.displayPlayer();
    }

    playerEndedGame(){
        this.boardState.playerEndedGame();
        this.MessageToPlayer = "Hope you will finish the game next time,\n computer win!";
        this.updateUIAfterChanges();
    }

    exitGameBoard(){
        this.gameMode = 0;
        this.updateUIAfterChanges();
    }

    calculateMargininCards(numberOfCards, cardWidth) {
        var calculatedMargin = ((((document.body.clientWidth - 50) / numberOfCards) - cardWidth) / 1) - 4;
        if (calculatedMargin > -10) {
            calculatedMargin = -10;
        }
        return calculatedMargin;
    }

    getMessageToPlayer(){
        if (this.getIsGameFinished()){
            let  finishMsg = this.boardState.getWinner();
            if (this.humanPlayerScore > 0 || this.aiPlayerScore > 0){
                finishMsg = (this.aiPlayerScore > this.humanPlayerScore) ? "Computer Wins tournament!\nBut you did give a good fight" : "You win the tournament!, Good Job!";
                finishMsg = (this.aiPlayerScore === this.humanPlayerScore) ? "It a tie! \nHo, what a match!" : finishMsg;
            }
            this.MessageToPlayer = finishMsg;
        }
        return this.MessageToPlayer;
    }

    getIsShowPopup(){
        return (this.boardState.getIsGameEnded() && !this.showPopupClose);
    }

    closePopupwindow(){
        this.showPopupClose = true;
        if(this.numberOfGames > 0) {
            this.resetGame(false);
        }
        else if (this.numberOfGames === 0 && this.gameMode === 2 && this.isWaitingForFinalTurnamentMessage){
            this.popupMessage = this.MessageToPlayer;
            this.isWaitingForFinalTurnamentMessage = false;
            setTimeout(() => {
                this.showPopupClose = false;
                this.updateUIAfterChanges();
            }, 200);
        }
        this.updateUIAfterChanges();
    }

    getPopupMessage(){
        if (this.popupMessage === ""){
            return this.MessageToPlayer;
        }
        return this.popupMessage;
    }


    /////////////
    // this section manage the Tournament data
    /////////////
    calculatePlayerScores(){
        this.humanPlayerScore += this.boardState.CalculatePlayerTournamentScore(1);
        this.aiPlayerScore += this.boardState.CalculatePlayerTournamentScore(0);

    }

    setNewGameInTournament(){
        this.humanPlayerScore = 0;
        this.aiPlayerScore = 0;
        this.numberOfGames = this.numberOfTurnametGames;
        this.resetGame();
    }
}

export {Platform};