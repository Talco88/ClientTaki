import React from 'react';
import ReactDOM from 'react-dom';

export default class CardBack extends React.Component {
    render() {
        return (
            <div id='botHandCard' className='card deck-wrapper bot-card-display' style={{marginRight:  this.props.marginR}}>
                <div className='cards-deck'></div>
            </div>
        );
    }
}