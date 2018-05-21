import React, { Component } from 'react';
import Statistics from './Statistics';
import {Platform}  from './../JS/Platform.js';


export default class LastGameStats extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
        this.state = {  };
    }



    render() {
        if (this.platform.isDisplayLobbyStats){
            return (
                <div className="last-game-statistic">
                    <h1>Last Game Statistics:</h1>
                    <h2>Winner: <span id="Lastwinner"></span> </h2>
                    <Statistics />
                </div>
            );
        }
        else{
            return (null);
        }
    }
}