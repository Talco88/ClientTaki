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
        return (
            <div className="statistic-data">
                <p>Total game time is: {this.parsTimeToMinAndSec(this.props.GameTime)}</p>
                <p>Total number of turns: {this.platform.getTotalNumberOfTurns()}</p>
                <p>Average time per-turn: <span id="timePerTrun"> 00:00</span> </p>
                <p>Number of time any player got one card: {this.platform.getTimesPlayerGotOneCard()}</p>
            </div>
        );
    }
}