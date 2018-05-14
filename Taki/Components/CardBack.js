import React from 'react';
import ReactDOM from 'react-dom';
import CardUpperSection from './CardUpperSection';
import CardCenterSection from './CardCenterSection';
import CardLowerSection from './CardLowerSection';
import {boardLogic}  from './../JS/BoardLogic.js';

export default class CardBack extends React.Component {
    render() {
        return (
            <div id='botHandCard' className='card deck-wrapper bot-card-display' >
                <div className='cards-deck'></div>
            </div>
        );
    }
}