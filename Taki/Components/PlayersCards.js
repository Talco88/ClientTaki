import React from 'react';
import ReactDOM from 'react-dom';
import Card from './Card';
import {Platform}  from './../JS/Platform.js';

let playerCardToShow = null;
export default class PlayersCards extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
        this.playerId = this.platform.playerId;
        this.cards = this.platform.getPlayerHand(0); 
        this.state = {
            playerId: 0
            //cards:  this.platform.getPlayerHand(0) 
        };
        playerCardToShow = this;
    }

    setCards(iCards)
    {
        this.setState({cards: iCards});
    }

    render() {
        this.cards = this.props.PlayersCard;
        let margin = this.platform.calculateMargininCards(this.cards.length, this.platform.unifyCardWidth);
        return (
            <div id="playersCards" className="section player-cards">
                { this.cards.map((card) => (
                    <Card 
                        key={card.id} 
                        id={card.id} 
                        number={card.number} 
                        option={card.option} 
                        color={card.color} 
                        displayColor={card.displayColor} 
                        selection={this.onClickedSelectedCard.bind(this)}
                        marginR={margin}/>
                    ))
                }
            </div>
        );
    }

    onClickedSelectedCard(event){
        if (this.platform.getIsGameFinished()){
            return;
        }
        let number = event.currentTarget.classList[0];
        let color = event.currentTarget.classList[1];
        let cardId = event.currentTarget.classList[2];
        let selectedCard = null;
        let index = -1;
        let i = 0;
    
        
        let logicMessage = this.platform.isUserCurrentTurn(true);
        if (logicMessage != "") {
            if (this.platform.debug){
                console.log(logicMessage);
            }
        }
        else {
            this.cards.forEach(function (card) {
                if (card.id == cardId) {
                    selectedCard = card;
                    index = i;
                }
                i++;
            })

            if (index >= 0) {
                this.platform.playSelectCard(index, selectedCard, this.playerId , this);
            }
            else {
                let message = "Ouppsy, unable to find the card";
                console.log(message);
            }
        }
    }
}