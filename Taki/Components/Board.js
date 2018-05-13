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
                <BotCards/>
                <CentralUI />
                <PlayersCards />
            </div>
        );
    }
}
