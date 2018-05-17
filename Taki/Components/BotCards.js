import React from 'react';
import ReactDOM from 'react-dom';
import CardBack from './CardBack';
import {Platform}  from './../JS/Platform.js';


export default class BotCards extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
        this.state = {cards:  this.platform.getOtherPlayerHand(1) };

    }

    setCards(iCards){
        this.setState({cards: iCards});
    }

    render() {
        return (
            <div id="botCards" className="section bot-cards">
                { this.state.cards.map((card) => (<CardBack key={card.id}/>))}
            </div>
        );
    }
}
