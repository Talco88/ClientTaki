import React, { Component } from 'react';
import {Platform}  from './../JS/Platform.js';


export default class TournamentData extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
    }
    render() {
        if (this.platform.gameMode === 2){
            let gameNumber = this.platform.numberOfTurnametGames - this.platform.numberOfGames + 1;
            if (gameNumber > this.platform.numberOfTurnametGames){
                gameNumber = this.platform.numberOfTurnametGames
            }
            return (
                <div className="tournament-data">
                    <p>Games {gameNumber} out of: {this.platform.numberOfTurnametGames}.</p>
                    <p>Human Score: {this.platform.humanPlayerScore} </p>
                    <p>Computer Score: {this.platform.aiPlayerScore} </p>
                </div>
            );
        }
        else{
            return(null);
        }
    }
}
