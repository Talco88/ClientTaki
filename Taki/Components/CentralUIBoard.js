import React from 'react';
import ReactDOM from 'react-dom';
import TakiCardBack from './../Imgs/taki-card-back.JPG';



export default class CentralUIBoard extends React.Component {
    render() {
        return (
            <div className="central-board">
                    <div id="deckCards" className="card deck-wrapper">
                        <div className="cards-deck">
                            <img src={TakiCardBack} />
                        </div>
                    </div>
                <div id="currentCard" className="card"></div>
            </div>
        );
    }
}