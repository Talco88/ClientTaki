import React, { Component } from 'react';
import LastGameStats from './LastGameStats';
import Board from './Board';
import {Platform}  from './../JS/Platform.js';


export default class Lobby extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform(this.updateData.bind(this));
        this.state = { 
            startGame: false
         };
    }

    updateData(iOpenCard, iPlayerCards, iOponentCards){
        this.setEndGame();
        this.setState({currentCard: iOpenCard});
        this.setState({currentColor: this.platform.getSelectedColor()});
        this.setState({playersCard: iPlayerCards});
        this.setState({otherCards: iOponentCards});
        this.setState({messageToPlayer: this.platform.getMessageToPlayer()});
    }

    setEndGame(){
        this.setState({startGame: (this.platform.gameMode != 0)});
    }

    onStartGameClicked(){
        this.platform.gameMode = 1;
        this.platform.resetGame();
        this.setState({startGame: true});
    }

    onSelectTournamentClicked(){
        this.platform.gameMode = 2;
        this.platform.resetGame();
        this.platform.setNewGameInTournament();
        this.setState({startGame: true});
    }

    render() {
        if (!this.state.startGame){
            return (
                <div className="lobby">
                    <button type="button" onClick={this.onStartGameClicked.bind(this)}>Start Game</button>
                    <button type="button" onClick={this.onSelectTournamentClicked.bind(this)}> Start Tournament </button>
                </div>
            );
        }
        else{
            return(
                <Board 
                    CurrentCard = {this.state.currentCard} 
                    CurrentColor={this.state.currentColor} 
                    MessageToPlayer = {this.state.messageToPlayer} 
                    PlayersCard = {this.state.playersCard}
                    AiCards = {this.state.otherCards}
                />
            );
        }
    }
}
