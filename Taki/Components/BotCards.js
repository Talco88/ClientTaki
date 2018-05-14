import React from 'react';
import ReactDOM from 'react-dom';
import CardBack from './CardBack';


export default class BotCards extends React.Component {
    constructor(args){
        super(args);
        this.state = {cards: [{id: 1, number: 4, color: 1},{id: 2, number: 6, color: 2},{id: 3, number: 1, color: 3},{id: 4, number: 10, color: 4}]};
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
