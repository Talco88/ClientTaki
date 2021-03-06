﻿import React from 'react';
import ReactDOM from 'react-dom';
import Statistics from './Statistics';
import TournamentData from './TournamentData';
import {Platform}  from './../JS/Platform.js';


export default class BoardStatistics extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
        this.state = { 
            gameTime: this.platform.gameTime
         };
    }
    componentDidMount() {
        this.timerInterval = setInterval(
            () => this.statsTick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerInterval);
    }

    statsTick(){
        if (!this.platform.getIsGameFinished()){
            this.platform.gameTime++;
            this.setState({gameTime: this.platform.gameTime});
        }
    }


    isStopTimmer(){
        if (this.platform.getIsGameFinished() && this.platform.gameMode != 2){
            clearInterval(this.timerInterval);
        }
    }

    onEndGameClicked(){
        if (this.platform.getIsGameFinished() || this.platform.gameMode === 2){
            this.platform.exitGameBoard();
        }
        else{
            this.platform.playerEndedGame();
        }
    }

    render() {
        this.isStopTimmer();
        let btnString = (this.platform.getIsGameFinished()) ? "Exit" : "End Game";
        return (
            <div className="statistics">
                <Statistics GameTime={this.state.gameTime}/>
                <p>Currently Playing: {this.platform.displayPlayer()}</p>
                <div className="finish-game">
                    <button type="button" className="in-game-btn end-game-btn" onClick={this.onEndGameClicked.bind(this)}>{btnString}</button>
                </div>
                <TournamentData />
            </div>
        );
    }
}