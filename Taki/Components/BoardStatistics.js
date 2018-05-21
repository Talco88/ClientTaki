import React from 'react';
import ReactDOM from 'react-dom';
import Statistics from './Statistics';
import {Platform}  from './../JS/Platform.js';


export default class BoardStatistics extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
        this.state = { 
            gameTime: this.platform.gameTime,
            currentPlayer: this.platform.displayPlayer()
         };
    }
    componentDidMount() {
        this.updateInterval = setInterval(
            () => this.updateCurrentPlayer(),
            this.platform.uiUpdateInterval
        );
        this.timerInterval = setInterval(
            () => this.statsTick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
        clearInterval(this.timerInterval);
    }

    updateCurrentPlayer(){
        this.setState({currentPlayer: this.platform.displayPlayer()});
    }

    statsTick(){
        this.platform.gameTime++;
        this.setState({gameTime: this.platform.gameTime});
    }


    isStopTimmer(){
        if (this.platform.getIsGameFinished()){
            clearInterval(this.timerInterval);
        }
    }

    onEndGameClicked(){
        console.log("ending Game...");
    }

    render() {
        this.isStopTimmer();
        return (
            <div className="statistics">
                <Statistics GameTime={this.state.gameTime}/>
                <p>Currently Playing: {this.state.currentPlayer}</p>
                <div className="finish-game">
                    <button type="button" className="in-game-btn end-game-btn" onClick={this.onEndGameClicked.bind(this)}>End Game</button>
                </div>
            </div>
        );
    }
}