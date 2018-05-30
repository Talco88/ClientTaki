//import React from 'react';
//import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import BotCards from './BotCards';
import CentralUI from './CentralUI';
import PlayersCards from './PlayersCards';


export default class Board extends React.Component {
    render() {
        return (
            <div className="board">
                <BotCards AiCards={this.props.AiCards}/>
                <CentralUI 
                    CurrentCard = {this.props.CurrentCard} 
                    CurrentColor={this.props.CurrentColor}  
                    MessageToPlayer={this.props.MessageToPlayer}
                />
                <PlayersCards PlayersCard={this.props.PlayersCard} />
            </div>
        );
    }
}
