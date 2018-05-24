import React from 'react';
import ReactDOM from 'react-dom';
import CardUpperSection from './CardUpperSection';
import CardCenterSection from './CardCenterSection';
import CardLowerSection from './CardLowerSection';


export default class Card extends React.Component {
    render() {
        let wrapperClassName = this.props.option + " " + this.props.displayColor + " 0" + this.props.id + " card taki-card";

        return (
            <div id='playersHandCard' className={wrapperClassName} onClick = {this.props.selection} style={{marginRight:  this.props.marginR}}>
                <CardUpperSection option={this.props.option}/>
                <CardCenterSection  color={this.props.color} option = {this.props.option} number={this.props.number}/>
                <CardLowerSection option={this.props.option}/>
            </div>
        );
    }
}