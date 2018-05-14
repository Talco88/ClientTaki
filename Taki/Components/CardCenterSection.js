import React from 'react';
import ReactDOM from 'react-dom';

export default class CardCenterSection extends React.Component {
    render() {
        let color = this.props.color;
        let innerText = (color != 4) ? this.props.option : null;
        var specialOption = this.props.option;
        if (color === 4 && this.props.number === 10) {
            // supper taki - special input
            specialOption = "super-taki";
        }

        let classNameData = "card-option " + specialOption + "-inner";
        return (
            <div id='playersHandCard' className={classNameData} >
                {innerText}
            </div>
        );
    }
}

