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
            currentColor: 4
        };
        openCardIU = this;
    }

    //hook runs after the component output has been rendered to the DOM
    componentDidMount() {
        this.updateInterval = setInterval(
          () => this.setCard(this.platform.getOpenCard(), this.platform.getSelectedColor()),
          this.platform.uiUpdateInterval
        );
      }

      // We will tear down the timer in the componentWillUnmount() lifecycle hook:
      componentWillUnmount() {
        clearInterval(this.updateInterval);
      }
   

    setCard(iCard, iColor){
        this.setState({currentCard: iCard});
        this.setState({currentColor: iColor})
    }

    onClickedTakeCard(){
        this.platform.getCardsFromDeck(this.state.playerId);
    }

    render() {
        let card = this.state.currentCard;
        let currentCardClassName = "card " + this.state.currentColor.ColorText;
        return (
            <div className="central-board">
                    <div id="deckCards" className="card deck-wrapper" onClick={this.onClickedTakeCard.bind(this)}>
                        <div className="cards-deck">
                        </div>
                    </div>
                <div id="currentCard" className={currentCardClassName}>
                    <Card key={card.id} id={card.id} number={card.number} option={card.option} color={card.color} displayColor={card.displayColor}/>
                </div>
            </div>
        );
    }
}
