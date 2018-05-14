import React from 'react';
import ReactDOM from 'react-dom';
import Card from './Card';


export default class PlayersCards extends React.Component {
    constructor(args){
        super(args);
        this.state = {cards: [{id: 1, number: 4, color: 1},{id: 2, number: 6, color: 2},{id: 3, number: 1, color: 3},{id: 4, number: 10, color: 4}] };
    }

    setCards(iCards){
        this.setState({cards: iCards});
    }

    render() {
        return (
            <div id="playersCards" className="section player-cards">
                { this.state.cards.map((card) => (<Card key={card.id} id={card.id} number={card.number} color={card.color}/>))}
            </div>
        );
    }
}