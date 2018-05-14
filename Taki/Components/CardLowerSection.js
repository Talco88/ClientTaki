import React from 'react';
import ReactDOM from 'react-dom';

export default class CardLowerSection extends React.Component {
    render() {
        return (
            <div id='playersHandCard' className='card-small-option card-lower-option' >
                {this.props.option}
            </div>
        );
    }
}

