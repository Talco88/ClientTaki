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
        this.state = {
            playerId: 0,
            cards:  this.platform.getPlayerHand(0) 
        };
        playerCardToShow = this;
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
    
    setCards(iCards)
    {
        this.setState({cards: iCards});
    }

    render() {
        return (
            <div id="playersCards" className="section player-cards">
                { this.state.cards.map((card) => (<Card key={card.id} id={card.id} number={card.number} option={card.option} color={card.color} displayColor={card.displayColor} selection={this.onClickedSelectedCard.bind(this)}/>))}
            </div>
        );
    }

    onClickedSelectedCard(event){
        let number = event.currentTarget.classList[0];
        let color = event.currentTarget.classList[1];
        let cardId = event.currentTarget.classList[2];
        let selectedCard = null;
        let index = -1;
        let i = 0;
    
        
        let logicMessage = this.platform.isUserCurrentTurn(true);
        if (logicMessage != "") {
            console.log(logicMessage);
            //utility.displayPopUp(logicMessage);
        }
        else {
            this.state.cards.forEach(function (card) {
                if (card.id == cardId) {
                    selectedCard = card;
                    index = i;
                }
                i++;
            })

            if (index >= 0) {
                var responce = this.platform.playSelectCard(index, selectedCard, this.playerId , this);
                if (responce != "") {
                    if (this.platform.debug) {
                        console.log(responce);
                    }
                }
            }
            else {
                let message = "Ouppsy, unable to find the card";
                console.log(message);
                //utility.displayPopUp("Ouppsy, unable to find the card");
            }
        }
    }

}