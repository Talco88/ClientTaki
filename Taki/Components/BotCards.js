import React from 'react';
import ReactDOM from 'react-dom';
import CardBack from './CardBack';
import {Platform}  from './../JS/Platform.js';


export default class BotCards extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
        this.state = {
            playerId: 1,
            cards:  this.platform.getOtherPlayerHand(1) 
        };

    }

    componentDidMount() {
        this.updateInterval = setInterval(
            () => this.setCards(this.platform.getPlayerHand(this.state.playerId)),
            this.platform.uiUpdateInterval
        );
    }

      // We will tear down the timer in the componentWillUnmount() lifecycle hook:
    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    setCards(iCards){
        this.setState({cards: iCards});
    }

    render() {
        let margin = this.platform.calculateMargininCards(this.state.cards.length, this.platform.unifyCardWidth);
        return (
            <div id="botCards" className="section bot-cards">
                { this.state.cards.map((card) => (<CardBack key={card.id} marginR={margin}/>))}
            </div>
        );
    }
}
