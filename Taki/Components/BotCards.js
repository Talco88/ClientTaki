import React from 'react';
import ReactDOM from 'react-dom';
import CardBack from './CardBack';
import {Platform}  from './../JS/Platform.js';


export default class BotCards extends React.Component {
    constructor(args){
        super(args);
        this.platform = new Platform();
        this.updating = false;
        this.state = {
            playerId: 1,
            cards:  this.platform.getOtherPlayerHand(1) 
        };
    }

    setCards(iCards)
    {
        this.setState({playerId: 1});
    }

    componentDidMount() {
        this.timerInterval = setInterval(
            () => this.setCards(),
            200
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerInterval);
    }
    
    render() {
        let margin = this.platform.calculateMargininCards(this.props.AiCards.length, this.platform.unifyCardWidth);
        return (
            <div id="botCards" className="section bot-cards">
                { this.props.AiCards.map((card) => (<CardBack key={card.id} marginR={margin}/>))}
            </div>
        );
    }
}
