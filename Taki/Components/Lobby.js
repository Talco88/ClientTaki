import React, { Component } from 'react';
import LastGameStats from './LastGameStats';
import Board from './Board';


export default class Lobby extends React.Component {
    constructor(args){
        super(args);
        this.state = { startGame: false };
    }

    onStartGameCLicked(){
        this.setState({startGame: true});
    }


    render() {
        if (!this.state.startGame){
            return (
                <div className="lobby">
                    <LastGameStats/>
                    <button type="button" onClick={this.onStartGameCLicked.bind(this)}>Start Game</button>
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
