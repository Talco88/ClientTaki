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

    componentDidMount() {
        this.updateInterval = setInterval(
            () => this.setBoardState(),
            this.platform.uiUpdateInterval
        );
    }

      // We will tear down the timer in the componentWillUnmount() lifecycle hook:
    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    setBoardState(){
        this.setState({currentPlayerId: this.platform.getCurrentPlayer()});
        this.setState({takiOpen:  this.platform.getIsTakiOpen()});
        this.setState({changeColorOpen: this.platform.getIsWatingForCahngeColor()});
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
        let isPlayerCurrentlyPlayer = (this.platform.playerId === this.state.currentPlayerId);
        if (isPlayerCurrentlyPlayer && this.state.takiOpen){
            return (
                <div className="close-taki">
                    <button type="button" className="end-taki-button in-game-btn" onClick={this.onCloseTakiClicked.bind(this)} >
                        Close TAKI
                    </button>
                </div>
            );
        }
        else if(isPlayerCurrentlyPlayer && this.state.changeColorOpen){
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
                    <button type="button" className="in-game-btn" onClick={this.onNextBtnClicked.bind(this)} >
                        Next
                    </button>
                    <button type="button" className="in-game-btn" onClick={this.onPrevBtnClicked.bind(this)} >
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