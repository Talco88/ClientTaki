import React from 'react';
import ReactDOM from 'react-dom';
import {Platform}  from './../JS/Platform.js';


export default class SelectionUIGenerator extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
        this.state = {
            currentPlayerId: this.platform.getCurrentPlayer(),
            takiOpen:  this.platform.getIsTakiOpen(),
            changeColorOpen: this.platform.getIsWatingForCahngeColor()
        };

    }

    onCloseTakiClicked(){
        this.platform.setCloseTaki();
    }

    onChangeColorClicked(iEvent){
        this.platform.setNewColorString(iEvent.target.classList[1]);
    }

    onNextBtnClicked(){
        this.platform.historyNext();
    }

    onPrevBtnClicked(){
        this.platform.historyPrev();
    }
        
    render() {
        let isPlayerCurrentlyPlayer = (this.platform.playerId === this.platform.getCurrentPlayer());
        if (isPlayerCurrentlyPlayer && this.platform.getIsTakiOpen()){
            return (
                <div className="close-taki">
                    <button type="button" className="end-taki-button in-game-btn" onClick={this.onCloseTakiClicked.bind(this)} >
                        Close TAKI
                    </button>
                </div>
            );
        }
        else if(isPlayerCurrentlyPlayer && this.platform.getIsWatingForCahngeColor()){
            return(
                <div className="color-selection" onClick={this.onChangeColorClicked.bind(this)} >
                    <button type="button" className="color-button red"></button>
                    <button type="button" className="color-button yellow"></button>
                    <button type="button" className="color-button blue"></button>
                    <button type="button" className="color-button green"></button>
                </div>
            );
        }
        else if (this.platform.getIsGameFinished()){
            return (
                <div>
                    <button 
                        type="button" 
                        className="in-game-btn" 
                        onClick={this.onNextBtnClicked.bind(this)} 
                        disabled={this.platform.getTotalNumberOfTurns() === this.platform.getNumberOfHistorySteps()} 
                    >
                        Next
                    </button>
                    <button 
                        type="button" 
                        className="in-game-btn" 
                        onClick={this.onPrevBtnClicked.bind(this)} 
                        disabled={this.platform.getTotalNumberOfTurns() === 0} 
                    >
                        Prev
                    </button>
                </div>
            );
        }
        else{
            return (
                null
            );
        }
    }
}