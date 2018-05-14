import React from 'react';
import ReactDOM from 'react-dom';
import CardUpperSection from './CardUpperSection';
import CardCenterSection from './CardCenterSection';
import CardLowerSection from './CardLowerSection';
import {boardLogic}  from './../JS/BoardLogic.js';

export default class Card extends React.Component {
    render() {
        let option = boardLogic.cardOptions[this.props.number];
        let color = boardLogic.cardColors[this.props.color];
        let wrapperClassName = option + " " + color + " 0" + this.props.id + " card taki-card";
        return (
            <div id='playersHandCard' className={wrapperClassName} >
                <CardUpperSection option={option}/>
                <CardCenterSection  color={this.props.color} option = {option} number={this.props.number}/>
                <CardLowerSection option={option}/>
            </div>
        );
    }
}

/*
if (iClickFunc && iClickFunc != null) {
    // a call is not always needed
    cardDiv.onclick = iClickFunc;
}

/**/