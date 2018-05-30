import React from 'react';
import ReactDOM from 'react-dom';
import Card from './Card';
import {Platform}  from './../JS/Platform.js';


var openCardIU = null;
export default class CentralUIBoard extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
        this.state = {
            playerId: 0,
            currentCard:  this.platform.getOpenCard(),
            currentColor: 4,
            PlayerMessages: this.platform.getMessageToPlayer()
        };
        openCardIU = this;
    }

    setCard(iCard, iColor){
        this.setState({currentCard: iCard});
        this.setState({currentColor: iColor});
        //this.setState({PlayerMessages: this.platform.getMessageToPlayer()});
    }

    onClickedTakeCard(){
        this.platform.getCardsFromDeck(this.state.playerId);
    }

    render() {
        let card = this.props.CurrentCard;
        let currentCardClassName = "card " + this.props.CurrentColor.ColorText;
        return (
            <div className="central-board">
                <div className="board-cards-data">
                    <div id="deckCards" className="card deck-wrapper" onClick={this.onClickedTakeCard.bind(this)}>
                        <div className="cards-deck">
                        </div>
                    </div>
                    <div id="currentCard" className={currentCardClassName}>
                        <Card key={card.id} id={card.id} number={card.number} option={card.option} color={card.color} displayColor={card.displayColor}/>
                    </div>
                </div>
                <div className="messaging">
                    <p>{this.props.MessageToPlayer}</p>
                </div>
            </div>
        );
    }
}
