import React, { Component } from 'react';
import LastGameStats from './LastGameStats';
import Board from './Board';
import {Platform}  from './../JS/Platform.js';


export default class Lobby extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
        this.state = { startGame: false };
    }

    componentDidMount() {
        this.updateInterval = setInterval(
            () => this.setEndGame(),
            this.platform.uiUpdateInterval
        );
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    setEndGame(){
        this.setState({startGame: (this.platform.gameMode != 0)});
    }

    onStartGameClicked(){
        this.platform.gameMode = 1;
        this.platform.resetGame();
        this.setState({startGame: true});
    }

    onStartTurnamentClicked(){
        this.platform.gameMode = 2;
        this.setState({startGame: true});
    }

    render() {
        if (!this.state.startGame){
            return (
                <div className="lobby">
                    <button type="button" onClick={this.onStartGameClicked.bind(this)}>Start Game</button>
                </div>
            );
        }
        else{
            return(
                <Board />
            );
        }
    }
}
