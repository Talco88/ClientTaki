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
        this.playerId = 0;
        this.aiPlayerId = 1;
        let boardFactory = new BoardLogicClass();
        this.boardState = boardFactory.getBoardState(this.debug);
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
            return this.boardState.getCurrentCard();
        }
        if (this.debug){
            console.log("boardState is not initiate");
        }
        return null;
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

    isUserCurrentTurn(iIsPlayMove){
        if (this.boardState != null){
            return this.boardState.validateUserInteraction(this.playerId, iIsPlayMove);
        }
        if (this.debug){
            console.log("boardState is not initiate");
        }
        return null;
    }

}

export {Platform};