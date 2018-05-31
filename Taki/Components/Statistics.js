import React from 'react';
import ReactDOM from 'react-dom';
import {Platform}  from './../JS/Platform.js';


export default class Statistics extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
        this.state = {time: this.platform.getGameTime  };
    }

    parsTimeToMinAndSec(iTime) {
        let minutes = parseInt(iTime / 60, 10)
        let seconds = parseInt(iTime % 60, 10);
    
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
    
        return minutes + ":" + seconds;
    }

    render() {
        let numberOfturns = this.platform.getTotalNumberOfTurns();
        let avrageTime = (numberOfturns === 0) ?  this.props.GameTime : this.props.GameTime / numberOfturns;

        return (
            <div className="statistic-data">
                <p>Total game time is: {this.parsTimeToMinAndSec(this.props.GameTime)}</p>
                <p>Total number of turns: {numberOfturns}</p>
                <p>Average time per-turn: {this.parsTimeToMinAndSec(avrageTime)} </p>
                <p>Number of one card: {this.platform.getTimesPlayerGotOneCard()}</p>
            </div>
        );
    }
}