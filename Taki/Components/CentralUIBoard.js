import React from 'react';
import ReactDOM from 'react-dom';
import Card from './Card';
import {Platform}  from './../JS/Platform.js';


let openCardIU = null;
export default class CentralUIBoard extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
        this.state = {currentCard:  this.platform.getOpenCard()};
        openCardIU = this;
    }

    onChange(){
        this.setState({currentCard: this.state.currentCard});
    }
   

    setCards(iCard){
        this.setState({currentCard: iCard});
    }

    render() {
        let card = this.state.currentCard;
        return (
            <div className="central-board">
                    <div id="deckCards" className="card deck-wrapper">
                        <div className="cards-deck">

                        </div>
                    </div>
                <div id="currentCard" className="card">
                    <Card key={card.id} id={card.id} number={card.number} option={card.option} color={card.color} displayColor={card.displayColor}/>
                </div>
            </div>
        );
    }
}